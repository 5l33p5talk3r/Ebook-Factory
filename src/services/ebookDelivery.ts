import fs from 'node:fs/promises';
import path from 'node:path';
import { getPool } from '../db/postgres';

const storageRoot = path.resolve(process.env.EBOOK_STORAGE_ROOT || './private/ebooks');
const allowedExtensions = new Set(['.pdf', '.epub']);

function safeStoragePath(key: string) {
  if (!key || key.length > 500 || key.includes('\0')) throw new Error('Invalid ebook key.');
  const resolved = path.resolve(storageRoot, key);
  if (resolved !== storageRoot && !resolved.startsWith(`${storageRoot}${path.sep}`)) throw new Error('Invalid ebook path.');
  if (!allowedExtensions.has(path.extname(resolved).toLowerCase())) throw new Error('Unsupported ebook format.');
  return resolved;
}

export async function getAuthorizedEbook(userId: string, productId: string, format: 'pdf' | 'epub') {
  const column = format === 'pdf' ? 'pdf_key' : 'epub_key';
  const result = await getPool().query<{title:string; key:string|null}>(`SELECT p.title,p.${column} AS key FROM entitlements e JOIN products p ON p.id=e.product_id WHERE e.user_id=$1 AND e.product_id=$2 AND e.status='active' AND p.status='published'`, [userId, productId]);
  const row = result.rows[0];
  if (!row?.key) return null;
  const filePath = safeStoragePath(row.key);
  const stat = await fs.stat(filePath);
  if (!stat.isFile()) return null;
  return { title: row.title, filePath, size: stat.size };
}
