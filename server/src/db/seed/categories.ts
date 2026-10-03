import { db } from "../db.js";
import { promptCategories } from "../../db/schema/categories.schema.js";

const categories = [
  {
    name: "Technology",
    slug: "technology",
  },
  {
    name: "Coding & Development",
    slug: "coding-development",
  },
  {
    name: "SEO",
    slug: "seo",
  },
  {
    name: "Marketing",
    slug: "marketing",
  },
  {
    name: "Sales",
    slug: "sales",
  },
  {
    name: "Customer Support",
    slug: "customer-support",
  },
  {
    name: "Design",
    slug: "design",
  },
  {
    name: "Research",
    slug: "research",
  },
  {
    name: "Education",
    slug: "education",
  },
  {
    name: "Productivity",
    slug: "productivity",
  },
  {
    name: "Business",
    slug: "business",
  },
  {
    name: "Content Creation",
    slug: "content-creation",
  },
  {
    name: "Career",
    slug: "career",
  },
];

async function seedCategories() {
  console.log("Seeding prompt categories...");

  await db
    .insert(promptCategories)
    .values(categories)
    .onConflictDoUpdate({
      target: promptCategories.slug,
      set: {
        name: promptCategories.name,
      },
    });

  console.log("Prompt categories seeded successfully.");
}

seedCategories().catch((error) => {
  console.error("Category seed failed:", error);
  process.exit(1);
});