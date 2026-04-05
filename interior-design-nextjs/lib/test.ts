import "dotenv/config";
import { query, db } from "./db.ts";

async function run() {
  try {
    const result = await query("SELECT 1 as test");
    console.log(result);
  } catch (error) {
    console.error(error);
  } finally {
    await db.end(); 
    process.exit(0);
  }
}

run();