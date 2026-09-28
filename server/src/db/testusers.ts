import { db } from "./db.js";
import { users } from "./schema/users.js";

const testUsersTable = async () => {
  try {
    const result = await db.select().from(users);

    console.log("✅ Users table is working");
    console.log(result);
  } catch (error) {
    console.error("❌ Users table test failed");
    console.error(error);
    process.exit(1);
  }
};

testUsersTable();