const fs = require("fs");
const { Client } = require("pg");

const line = fs.readFileSync(".env", "utf8")
  .split(/\r?\n/)
  .find(s => /^\s*DATABASE_URL\s*=/.test(s));

if (!line) {
  console.log("DATABASE_URL is missing.");
  process.exit(1);
}

const connectionString = line.slice(line.indexOf("=") + 1)
  .trim().replace(/^["']|["']$/g, "");

async function main() {
  const client = new Client({
    connectionString,
    connectionTimeoutMillis: 10000,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    for (const table of ["members", "contact_messages"]) {
      console.log("\n--- " + table + " columns ---");

      const columns = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position
      `, [table]);

      console.table(columns.rows);

      console.log("--- " + table + " constraints ---");
      const constraints = await client.query(`
        SELECT conname AS name, contype AS type,
               pg_get_constraintdef(oid) AS definition
        FROM pg_constraint
        WHERE conrelid = to_regclass($1)
        ORDER BY conname
      `, ["public." + table]);

      console.table(constraints.rows);

      console.log("--- " + table + " RLS policies ---");
      const policies = await client.query(`
        SELECT policyname, permissive, roles, cmd, qual, with_check
        FROM pg_policies
        WHERE schemaname = 'public' AND tablename = $1
      `, [table]);

      console.table(policies.rows);
    }
  } catch (error) {
    console.log("Inspection failed:", error.code || "", error.message);
    process.exitCode = 1;
  } finally {
    await client.end().catch(() => {});
  }
}

main();
