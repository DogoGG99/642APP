
import { pool } from "./db";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  try {
    console.log("Running migrations...");
    
    // Read and execute the migration file
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, "../migrations/add_role_to_users.sql"),
      "utf8"
    );
    
    await pool.query(migrationSQL);
    
    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await pool.end();
  }
}

runMigration();
