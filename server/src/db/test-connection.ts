import { sql } from "drizzle-orm";
import { db } from "./db.js";

const testConnection = async () => {
  try {
    const result = await db.execute(sql`SELECT 1`);

    console.log("✅ Database connected successfully");
    console.log(result);
  } catch (error) {
    console.error("❌ Database connection failed");
    console.error(error);
    process.exit(1);
  }
};

testConnection();