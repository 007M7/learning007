import path from "node:path";
import { booksByField } from "./book-seeds.mjs";
import { fields } from "./field-config.mjs";
import { fieldsDir, readJson, writeJson } from "./utils.mjs";

for (const [field, config] of Object.entries(fields)) {
  const file = path.join(fieldsDir, field, "books.json");
  const previous = await readJson(file, { records: [] });
  const previousById = new Map((previous.records ?? []).map((record) => [record.id, record]));
  const records = booksByField[field].map((record) => {
    const oldAccess = previousById.get(record.id)?.access;
    if (!oldAccess || record.access.status !== "open_fulltext") return record;
    const sameDownload = oldAccess.download_url === record.access.download_url;
    return {
      ...record,
      access: {
        ...record.access,
        local_path: sameDownload ? (oldAccess.local_path ?? null) : null,
        sha256: sameDownload ? (oldAccess.sha256 ?? null) : null,
        bytes: sameDownload ? (oldAccess.bytes ?? null) : null,
        checked_at: sameDownload ? (oldAccess.checked_at ?? null) : null,
        download_error: sameDownload ? (oldAccess.download_error ?? null) : null
      }
    };
  });
  await writeJson(file, {
    field,
    title: config.title,
    curated_count: records.length,
    methodology: "人工精选学科骨架；Tavily 检索官方大学、出版社、政府与专业机构页面进行来源审计。",
    records
  });
  console.log(`${field}: ${records.length} books`);
}
