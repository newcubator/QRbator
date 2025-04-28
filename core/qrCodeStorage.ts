import * as SQLite from "expo-sqlite";
import { QRCodeEntry } from "./qrCode";
export const DB_NAME = "qrcodes.db";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

const getDatabase = (): Promise<SQLite.SQLiteDatabase> => {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DB_NAME);
  }
  return dbPromise;
};

export const initDB = async (): Promise<void> => {
  const db = await getDatabase();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS qrcodes (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      content TEXT NOT NULL,
      tags TEXT, -- Stored as JSON string
      createdAt TEXT NOT NULL, -- Changed to TEXT for ISO String
      description TEXT -- Changed from notes to description
    );
  `);
};

const parseTags = (tagsString: string | null | undefined): string[] => {
  if (!tagsString) return [];
  try {
    const tags = JSON.parse(tagsString);
    return Array.isArray(tags) ? tags : [];
  } catch (e) {
    console.error("Error parsing tags:", e);
    return [];
  }
};

const mapRowToQRCodeEntry = (row: any): QRCodeEntry => {
  return {
    id: row.id,
    name: row.name,
    content: row.content,
    tags: parseTags(row.tags),
    createdAt: row.createdAt,
    description: row.description ?? undefined,
  };
};

export const getAllQRCodes = async (): Promise<QRCodeEntry[]> => {
  const db = await getDatabase();
  const allRows = await db.getAllAsync<any>(
    "SELECT * FROM qrcodes ORDER BY createdAt DESC;"
  );
  return allRows.map(mapRowToQRCodeEntry);
};

export const getQRCodesByTag = async (tag: string): Promise<QRCodeEntry[]> => {
  const db = await getDatabase();
  const rows = await db.getAllAsync<any>(
    "SELECT * FROM qrcodes WHERE tags LIKE ? ORDER BY createdAt DESC;",
    [`%"${tag}"%`]
  );
  return rows
    .map(mapRowToQRCodeEntry)
    .filter((code) => code.tags.includes(tag));
};

export const addQRCode = async (
  qrCode: Omit<QRCodeEntry, "id">
): Promise<string> => {
  const db = await getDatabase();
  const id = Date.now().toString();
  const tagsString = JSON.stringify(qrCode.tags || []);

  await db.runAsync(
    "INSERT INTO qrcodes (id, name, content, tags, createdAt, description) VALUES (?, ?, ?, ?, ?, ?);",
    [
      id,
      qrCode.name,
      qrCode.content,
      tagsString,
      qrCode.createdAt,
      qrCode.description || null,
    ]
  );
  return id;
};

export const getQRCodeById = async (
  id: string
): Promise<QRCodeEntry | null> => {
  const db = await getDatabase();
  const row = await db.getFirstAsync<any>(
    "SELECT * FROM qrcodes WHERE id = ?;",
    [id]
  );
  return row ? mapRowToQRCodeEntry(row) : null;
};

export const updateQRCode = async (qrCode: QRCodeEntry): Promise<void> => {
  const db = await getDatabase();
  const tagsString = JSON.stringify(qrCode.tags || []);
  const result = await db.runAsync(
    "UPDATE qrcodes SET name = ?, content = ?, tags = ?, description = ?, createdAt = ? WHERE id = ?;",
    [
      qrCode.name,
      qrCode.content,
      tagsString,
      qrCode.description || null,
      qrCode.createdAt,
      qrCode.id,
    ]
  );

  if (result.changes === 0) {
    console.warn(`QR code with ID "${qrCode.id}" not found for update.`);
  }
};

export const deleteQRCode = async (id: string): Promise<void> => {
  const db = await getDatabase();
  const result = await db.runAsync("DELETE FROM qrcodes WHERE id = ?;", [id]);

  if (result.changes === 0) {
    console.warn(`QR code with ID "${id}" not found for deletion.`);
  }
};

export const importQRCodes = async (qrCodes: QRCodeEntry[]): Promise<void> => {
  const db = await getDatabase();

  await db.withTransactionAsync(async () => {
    for (const qrCode of qrCodes) {
      if (!qrCode.id || !qrCode.name || !qrCode.content || !qrCode.createdAt) {
        console.warn("Skipping invalid QR code during import:", qrCode);
        continue;
      }

      const tagsString = JSON.stringify(qrCode.tags || []);
      await db.runAsync(
        `INSERT OR REPLACE INTO qrcodes (id, name, content, tags, createdAt, description) 
         VALUES (?, ?, ?, ?, ?, ?);`,
        [
          qrCode.id,
          qrCode.name,
          qrCode.content,
          tagsString,
          qrCode.createdAt,
          qrCode.description || null,
        ]
      );
    }
  });
};

export const deleteAllQRCodes = async (): Promise<void> => {
  const db = await getDatabase();
  const result = await db.runAsync("DELETE FROM qrcodes;");
};
