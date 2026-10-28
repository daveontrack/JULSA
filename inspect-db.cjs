const fs = require("fs");
const { Client } = require("pg");

function readEnv(key) {
  const line = fs.readFileSync(".env", "utf8")
    .split(/\r?\n/)
    .find(s => s.trim().startsWith(key + "="));
  return line ? line.slice(line.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "") : undefined;
}

async function main() {
  const client = new Client({
    connectionString: readEnv("DATABASE_URL"),
    connectionTimeoutMillis: 10000,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const result = await client.query(`
      SELECT table_schema, table_name, table_type
      FROM information_schema.tables
      WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
      ORDER BY table_schema, table_name
    `);

    if (result.rows.length === 0) {
      console.log("No application tables or views found.");
    } else {
      console.table(result.rows);
    }
  } catch (error) {
    console.log("Inspection failed:", error.code || "", error.message);
    process.exitCode = 1;
  } finally {
    await client.end().catch(() => {});
  }
}

main();
