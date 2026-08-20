import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import mysql from "mysql2/promise";

const outDir = "/home/ubuntu/nlf-migration-backup/database";
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) throw new Error("DATABASE_URL is required for database export.");

const safeJson = value => JSON.stringify(value, (_key, item) => {
  if (typeof item === "bigint") return item.toString();
  if (Buffer.isBuffer(item)) return { type: "Buffer", data: item.toString("base64") };
  return item;
}, 2);

const sha256 = text => crypto.createHash("sha256").update(text).digest("hex");
const quoteIdentifier = value => `\`${String(value).replaceAll("`", "``")}\``;
const isSafeObjectName = value => /^[A-Za-z0-9_]+$/.test(value);
const sqlValue = value => {
  if (value === null || value === undefined) return "NULL";
  if (Buffer.isBuffer(value)) return `X'${value.toString("hex")}'`;
  if (value instanceof Date) return mysql.escape(value.toISOString().slice(0, 23).replace("T", " "));
  if (typeof value === "bigint") return value.toString();
  if (typeof value === "object") return mysql.escape(JSON.stringify(value));
  return mysql.escape(value);
};

await fs.mkdir(path.join(outDir, "tables"), { recursive: true });
const connection = await mysql.createConnection(databaseUrl);
const [databaseRows] = await connection.query("SELECT DATABASE() AS databaseName");
const databaseName = databaseRows[0]?.databaseName;
if (!databaseName) throw new Error("No database selected.");

const [objects] = await connection.query("SHOW FULL TABLES");
const tableKey = `Tables_in_${databaseName}`;
const exportMetadata = {
  exportedAtUtc: new Date().toISOString(),
  databaseName,
  tables: [],
  views: [],
  triggers: [],
  procedures: [],
  functions: [],
  exportNotes: [],
};
let schemaSql = `-- NLF full schema export\n-- Exported ${exportMetadata.exportedAtUtc}\nCREATE DATABASE IF NOT EXISTS ${quoteIdentifier(databaseName)};\nUSE ${quoteIdentifier(databaseName)};\n\n`;
let dataSql = `-- NLF full data export\n-- Exported ${exportMetadata.exportedAtUtc}\nUSE ${quoteIdentifier(databaseName)};\nSET FOREIGN_KEY_CHECKS=0;\n\n`;

for (const object of objects) {
  const name = object[tableKey];
  const type = object.Table_type;
  if (!name || !isSafeObjectName(name)) {
    exportMetadata.exportNotes.push(`Skipped object with unsafe name: ${name}`);
    continue;
  }
  if (type === "VIEW") {
    const [definitionRows] = await connection.query(`SHOW CREATE VIEW ${quoteIdentifier(name)}`);
    const definition = definitionRows[0]?.["Create View"];
    if (definition) {
      schemaSql += `\n-- View: ${name}\n${definition};\n`;
      exportMetadata.views.push({ name, sha256: sha256(definition) });
    }
    continue;
  }

  const [createRows] = await connection.query(`SHOW CREATE TABLE ${quoteIdentifier(name)}`);
  const createSql = createRows[0]?.["Create Table"];
  if (!createSql) throw new Error(`Could not retrieve schema for ${name}.`);
  schemaSql += `\n-- Table: ${name}\nDROP TABLE IF EXISTS ${quoteIdentifier(name)};\n${createSql};\n`;

  const [rows, fields] = await connection.query(`SELECT * FROM ${quoteIdentifier(name)}`);
  const columns = fields.map(field => field.name);
  const tableJson = safeJson(rows);
  await fs.writeFile(path.join(outDir, "tables", `${name}.json`), tableJson);
  const tableSql = [
    `-- Data for ${name}`,
    `DELETE FROM ${quoteIdentifier(name)};`,
  ];
  for (const row of rows) {
    const values = columns.map(column => sqlValue(row[column])).join(", ");
    tableSql.push(`INSERT INTO ${quoteIdentifier(name)} (${columns.map(quoteIdentifier).join(", ")}) VALUES (${values});`);
  }
  dataSql += `${tableSql.join("\n")}\n\n`;
  exportMetadata.tables.push({
    name,
    records: rows.length,
    columns,
    schemaSha256: sha256(createSql),
    dataSha256: sha256(tableJson),
    jsonFile: `tables/${name}.json`,
  });
}

const optionalQueries = [
  ["triggers", "SHOW TRIGGERS", "Trigger"],
  ["procedures", `SHOW PROCEDURE STATUS WHERE Db = ${mysql.escape(databaseName)}`, "Name"],
  ["functions", `SHOW FUNCTION STATUS WHERE Db = ${mysql.escape(databaseName)}`, "Name"],
];
for (const [key, query, nameKey] of optionalQueries) {
  try {
    const [rows] = await connection.query(query);
    exportMetadata[key] = rows;
    for (const row of rows) {
      const name = row[nameKey];
      if (!name || !isSafeObjectName(name)) continue;
      const statement = key === "triggers" ? `SHOW CREATE TRIGGER ${quoteIdentifier(name)}` : key === "procedures" ? `SHOW CREATE PROCEDURE ${quoteIdentifier(name)}` : `SHOW CREATE FUNCTION ${quoteIdentifier(name)}`;
      const [createRows] = await connection.query(statement);
      const definition = createRows[0]?.[key === "triggers" ? "SQL Original Statement" : key === "procedures" ? "Create Procedure" : "Create Function"];
      if (definition) schemaSql += `\n-- ${key.slice(0, -1)}: ${name}\n${definition};\n`;
    }
  } catch (error) {
    exportMetadata.exportNotes.push(`Could not export ${key}: ${error.message}`);
  }
}

dataSql += "SET FOREIGN_KEY_CHECKS=1;\n";
await fs.writeFile(path.join(outDir, "schema.sql"), schemaSql);
await fs.writeFile(path.join(outDir, "data.sql"), dataSql);
await fs.writeFile(path.join(outDir, "database-metadata.json"), safeJson(exportMetadata));
await connection.end();

console.log(JSON.stringify({
  databaseName,
  tables: exportMetadata.tables.length,
  records: exportMetadata.tables.reduce((sum, table) => sum + table.records, 0),
  views: exportMetadata.views.length,
  exportNotes: exportMetadata.exportNotes,
}, null, 2));
