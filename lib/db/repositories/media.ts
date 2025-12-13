import { query, queryOne } from '../connection';
import { MediaFile } from '../models';

// Get all media files with pagination
export async function getMediaFiles(
  page: number = 1,
  pageSize: number = 20,
  filters?: { mimeType?: string; search?: string }
): Promise<{ files: MediaFile[]; total: number }> {
  let whereClause = '1=1';
  const params: any[] = [];

  if (filters?.mimeType) {
    whereClause += ' AND mime_type LIKE ?';
    params.push(`%${filters.mimeType}%`);
  }

  if (filters?.search) {
    whereClause += ' AND (filename LIKE ? OR alt_text LIKE ?)';
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm);
  }

  const offset = (page - 1) * pageSize;
  params.push(pageSize, offset);

  const files = await query<MediaFile>(
    `SELECT * FROM media_files WHERE ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    params
  );

  const [totalResult] = await query<{ count: number }>(
    `SELECT COUNT(*) as count FROM media_files WHERE ${whereClause}`,
    params.slice(0, -2)
  );

  return {
    files,
    total: totalResult?.count || 0,
  };
}

// Get media file by ID
export async function getMediaFileById(id: number): Promise<MediaFile | null> {
  return await queryOne<MediaFile>('SELECT * FROM media_files WHERE id = ?', [id]);
}

// Create media file
export async function createMediaFile(file: Omit<MediaFile, 'id' | 'created_at'>): Promise<number> {
  const result = await query<{ insertId: number }>(
    `INSERT INTO media_files (filename, url, mime_type, size, width, height, alt_text, caption)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      file.filename,
      file.url,
      file.mime_type,
      file.size,
      file.width,
      file.height,
      file.alt_text,
      file.caption,
    ]
  );
  return result[0]?.insertId || 0;
}

// Delete media file
export async function deleteMediaFile(id: number): Promise<boolean> {
  await query('DELETE FROM media_files WHERE id = ?', [id]);
  return true;
}

