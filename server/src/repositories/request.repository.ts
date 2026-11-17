
import { eq } from "drizzle-orm";

import { db } from "../db/db.js";
import { promptRequests } from "../db/schema/prompt-requests.schema.js";

type DbExecutor = Pick<
  typeof db,
  "select"
>;

export class RequestRepository {
  constructor(
    private readonly database: DbExecutor = db,
  ) {}

  async findById(requestId: string) {
    const result = await this.database
      .select()
      .from(promptRequests)
      .where(eq(promptRequests.id, requestId))
      .limit(1);

    return result[0] ?? null;
  }
}

export const requestRepository =
  new RequestRepository();
