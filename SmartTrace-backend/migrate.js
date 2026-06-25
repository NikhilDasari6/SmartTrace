const fs = require("fs");
const path = require("path");
const db = require("./src/config/db");

async function migrate() {
  try {
    console.log("Starting migration...");
    const sqlPath = path.join(__dirname, "src", "smarttrace_schema.sql");
    let sql = fs.readFileSync(sqlPath, "utf8");

    // Remove single line comments
    sql = sql.replace(/--.*$/gm, "");

    // Split by ;
    const statements = sql
      .split(";")
      .map(s => s.trim())
      .filter(s => {
        if (s.length === 0) return false;
        const lower = s.toLowerCase();
        if (lower.startsWith("create database")) return false;
        if (lower.startsWith("use ")) return false;
        return true;
      });

    console.log(`Found ${statements.length} statements.`);

    for (let statement of statements) {
      console.log(`Executing: ${statement.substring(0, 50)}...`);
      await db.query(statement);
    }

    console.log("Migration completed successfully!");
    
    // Double check tables
    const [tables] = await db.query("SHOW TABLES");
    console.log("Tables now present:", tables.map(t => Object.values(t)[0]));
    
    process.exit(0);
  } catch (err) {
    console.error("Migration failed!");
    console.error(err);
    process.exit(1);
  }
}

migrate();
