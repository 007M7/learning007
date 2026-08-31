import { stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fields } from "./field-config.mjs";
import { ensureDir, fieldsDir, knowledgeBaseDir, readJson, sha256, writeJson } from "./utils.mjs";

const maxBookBytes = Number(process.env.KB_MAX_BOOK_BYTES || 100 * 1024 * 1024);
const maxTotalBytes = Number(process.env.KB_MAX_TOTAL_BYTES || 500 * 1024 * 1024);
let downloadedTotal = 0;

function safeName(id) {
  return id.replace(/[^a-z0-9.-]+/gi, "-");
}

async function download(record, field) {
  if (record.access.status !== "open_fulltext" || !record.access.download_url) return record;
  const targetDir = path.join(knowledgeBaseDir, "cache", "books", field);
  const target = path.join(targetDir, `${safeName(record.id)}.pdf`);
  const relativeTarget = path.relative(knowledgeBaseDir, target).replaceAll("\\", "/");
  try {
    await ensureDir(targetDir);
    try {
      const existing = await stat(target);
      if (existing.size > 0 && record.access.sha256) {
        return { ...record, access: { ...record.access, local_path: relativeTarget, bytes: existing.size, download_error: null } };
      }
    } catch {}

    const response = await fetch(record.access.download_url, {
      redirect: "follow",
      signal: AbortSignal.timeout(Number(process.env.KB_DOWNLOAD_TIMEOUT_MS || 30000)),
      headers: { "User-Agent": "Learning007KnowledgeBase/1.0 (open educational resource archiver)" }
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const contentType = response.headers.get("content-type") ?? "";
    const advertisedLength = Number(response.headers.get("content-length") || 0);
    if (advertisedLength > maxBookBytes) throw new Error(`file exceeds ${maxBookBytes} byte limit`);
    if (downloadedTotal + advertisedLength > maxTotalBytes) throw new Error("run-wide download byte limit reached");
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.byteLength > maxBookBytes) throw new Error(`file exceeds ${maxBookBytes} byte limit`);
    if (downloadedTotal + buffer.byteLength > maxTotalBytes) throw new Error("run-wide download byte limit reached");
    const looksLikePdf = buffer.subarray(0, 5).toString("ascii") === "%PDF-";
    if (!looksLikePdf) throw new Error(`response is not a PDF (${contentType || "unknown content-type"})`);
    await writeFile(target, buffer);
    downloadedTotal += buffer.byteLength;
    return {
      ...record,
      access: {
        ...record.access,
        local_path: relativeTarget,
        sha256: sha256(buffer),
        bytes: buffer.byteLength,
        checked_at: new Date().toISOString(),
        download_error: null
      }
    };
  } catch (error) {
    return {
      ...record,
      access: {
        ...record.access,
        local_path: null,
        sha256: null,
        bytes: null,
        checked_at: new Date().toISOString(),
        download_error: error.message
      }
    };
  }
}

for (const field of Object.keys(fields)) {
  const file = path.join(fieldsDir, field, "books.json");
  const data = await readJson(file);
  const records = [];
  for (const record of data.records) records.push(await download(record, field));
  await writeJson(file, { ...data, records });
  const downloaded = records.filter((record) => record.access.local_path).length;
  const failed = records.filter((record) => record.access.status === "open_fulltext" && record.access.download_error).length;
  console.log(`${field}: ${downloaded} downloaded, ${failed} failed`);
}
