
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";
import assert from "node:assert/strict";

import { eq , sql} from "drizzle-orm";

import { db, closeDb } from "../db/db.js";
import { env } from "../config/env.js";

import { users } from "../db/schema/users.schema.js";
import { promptCategories } from "../db/schema/categories.schema.js";
import { prompts } from "../db/schema/prompts.schema.js";
import { promptVersions } from "../db/schema/prompt-versions.js";

import { PromptService } from "../services/prompt.service.js";
import { ApiError } from "../utils/ApiError.js";

const promptService = new PromptService();

type TestUser = {
  id: string;
  accountStatus: string;
};

async function createTestUser(label: string): Promise<TestUser> {
  const uniqueId = randomUUID();

  const [user] = await db
    .insert(users)
    .values({
      clerkUserId: `test_${uniqueId}`,
      email: `test_${uniqueId}@example.com`,
      username: `test_${uniqueId}`,
      displayName: `Integration Test ${label}`,
      accountStatus: "active",
    })
    .returning({
      id: users.id,
    });

  return {
    id: user.id,
    accountStatus: "active",
  };
}

async function createFixture() {
  const owner = await createTestUser("Owner");
  const categoryId = randomUUID();

  const [category] = await db
    .insert(promptCategories)
    .values({
      name: `Test Category ${categoryId}`,
      slug: `test-category-${categoryId}`,
    })
    .returning({
      id: promptCategories.id,
    });

  const [prompt] = await db
    .insert(prompts)
    .values({
      authorId: owner.id,
      title: "Integration Test Prompt",
      categoryId: category.id,
      promptType: "text",
      visibility: "private",
      lifecycleStatus: "draft",
    })
    .returning({
      id: prompts.id,
    });

  const [initialVersion] = await db
    .insert(promptVersions)
    .values({
      promptId: prompt.id,
      versionNumber: 1,
      content: "Initial prompt content",
      changeNote: "Initial version",
      editorId: owner.id,
    })
    .returning({
      id: promptVersions.id,
    });

  await db
    .update(prompts)
    .set({
      currentVersionId: initialVersion.id,
    })
    .where(eq(prompts.id, prompt.id));

  const userIds = [owner.id];

  return {
    owner,
    promptId: prompt.id,
    initialVersionId: initialVersion.id,
    userIds,

    async cleanup() {
      // Remove circular current-version reference first.
      await db
        .update(prompts)
        .set({
          currentVersionId: null,
        })
        .where(eq(prompts.id, prompt.id));

      await db
        .delete(promptVersions)
        .where(eq(promptVersions.promptId, prompt.id));

      await db
        .delete(prompts)
        .where(eq(prompts.id, prompt.id));

      await db
        .delete(promptCategories)
        .where(eq(promptCategories.id, category.id));

      if (userIds.length > 0) {
        await db
          .delete(users)
          .where(eq(users.id, owner.id));
      }
    },
  };
}

async function getVersions(promptId: string) {
  return db
    .select()
    .from(promptVersions)
    .where(eq(promptVersions.promptId, promptId));
}

async function getPrompt(promptId: string) {
  const [prompt] = await db
    .select()
    .from(prompts)
    .where(eq(prompts.id, promptId));

  return prompt;
}

// Safety: never run integration tests against development or production DB.
before(async () => {
  const databaseName = decodeURIComponent(
    new URL(env.DATABASE_URL).pathname.slice(1),
  );

  assert.equal(
    databaseName,
    "promptlok_test",
    `Integration tests require promptlok_test. Received: ${databaseName}`,
  );

  await db.execute(sql`SELECT 1`);
});

after(async () => {
  await closeDb();
});

test("unchanged content should reject with NO_CHANGES", async () => {
  const fixture = await createFixture();

  try {
    await assert.rejects(
      () =>
        promptService.createVersion(
          fixture.owner,
          fixture.promptId,
          {
            content: "Initial prompt content",
          },
        ),
      (error: unknown) => {
        assert.ok(error instanceof ApiError);
        assert.equal(error.statusCode, 409);
        assert.equal(error.code, "NO_CHANGES");
        return true;
      },
    );

    const versions = await getVersions(fixture.promptId);
    const prompt = await getPrompt(fixture.promptId);

    assert.equal(versions.length, 1);
    assert.equal(prompt.currentVersionId, fixture.initialVersionId);
  } finally {
    await fixture.cleanup();
  }
});

test("changed content should create the next version", async () => {
  const fixture = await createFixture();

  try {
    const created = await promptService.createVersion(
      fixture.owner,
      fixture.promptId,
      {
        content: "Updated prompt content",
        changeNote: "Improved instructions",
      },
    );

    const versions = await getVersions(fixture.promptId);
    const prompt = await getPrompt(fixture.promptId);

    assert.equal(created.versionNumber, 2);
    assert.equal(created.content, "Updated prompt content");
    assert.equal(versions.length, 2);
    assert.equal(prompt.currentVersionId, created.id);
  } finally {
    await fixture.cleanup();
  }
});

test("restoring an older version should create a new version", async () => {
  const fixture = await createFixture();

  try {
    await promptService.createVersion(
      fixture.owner,
      fixture.promptId,
      {
        content: "Updated prompt content",
        changeNote: "Second version",
      },
    );

    const restored = await promptService.restoreVersion(
      fixture.owner,
      fixture.promptId,
      fixture.initialVersionId,
    );

    const versions = await getVersions(fixture.promptId);
    const prompt = await getPrompt(fixture.promptId);

    assert.equal(restored.versionNumber, 3);
    assert.equal(restored.content, "Initial prompt content");
    assert.equal(
      restored.changeNote,
      "Restored from version 1",
    );
    assert.equal(versions.length, 3);
    assert.equal(prompt.currentVersionId, restored.id);
  } finally {
    await fixture.cleanup();
  }
});

test("non-owner should not be allowed to create a version", async () => {
  const fixture = await createFixture();
  const otherUser = await createTestUser("Non Owner");

  fixture.userIds.push(otherUser.id);

  try {
    await assert.rejects(
      () =>
        promptService.createVersion(
          otherUser,
          fixture.promptId,
          {
            content: "Unauthorized content",
          },
        ),
      (error: unknown) => {
        assert.ok(error instanceof ApiError);
        assert.equal(error.statusCode, 403);
        assert.equal(error.code, "FORBIDDEN");
        return true;
      },
    );

    const versions = await getVersions(fixture.promptId);

    assert.equal(versions.length, 1);
  } finally {
    await fixture.cleanup();

    await db
      .delete(users)
      .where(eq(users.id, otherUser.id));
  }
});

test("concurrent identical requests should create only one version", async () => {
  const fixture = await createFixture();

  try {
    const payload = {
      content: "Concurrent updated content",
      changeNote: "Concurrent test",
    };

    const results = await Promise.allSettled([
      promptService.createVersion(
        fixture.owner,
        fixture.promptId,
        payload,
      ),
      promptService.createVersion(
        fixture.owner,
        fixture.promptId,
        payload,
      ),
    ]);

    const successful = results.filter(
      (result) => result.status === "fulfilled",
    );

    const failed = results.filter(
      (result) => result.status === "rejected",
    );

    assert.equal(successful.length, 1);
    assert.equal(failed.length, 1);

    if (failed[0].status === "rejected") {
      assert.ok(failed[0].reason instanceof ApiError);
      assert.equal(failed[0].reason.statusCode, 409);
      assert.equal(failed[0].reason.code, "NO_CHANGES");
    }

    const versions = await getVersions(fixture.promptId);

    assert.equal(versions.length, 2);
  } finally {
    await fixture.cleanup();
  }
});
