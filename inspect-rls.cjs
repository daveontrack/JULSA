const fs = require("fs");
const { Client } = require("pg");

const line = fs.readFileSync(".env", "utf8")
  .split(/\r?\n/)
  .find(s => /^\s*DATABASE_URL\s*=/.test(s));

if (!line) throw new Error("DATABASE_URL is missing");

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

    const result = await client.query(`
      SELECT
        n.nspname AS schema_name,
        c.relname AS table_name,
        c.relrowsecurity AS rls_enabled,
        c.relforcerowsecurity AS rls_forced
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public'
        AND c.relname IN ('members', 'contact_messages')
      ORDER BY c.relname
    `);

    console.table(result.rows);

    const grants = await client.query(`
      SELECT table_name, grantee, privilege_type
      FROM information_schema.role_table_grants
      WHERE table_schema = 'public'
        AND table_name IN ('members', 'contact_messages')
      ORDER BY table_name, grantee, privilege_type
    `);

    console.log("Table grants:");
    console.table(grants.rows);
  } catch (error) {
    console.log("Inspection failed:", error.code || "", error.message);
    process.exitCode = 1;
  } finally {
    await client.end().catch(() => {});
  }
}

main();
