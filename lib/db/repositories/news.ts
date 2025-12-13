import { query, queryOne } from '../connection';
import { NewsArticle } from '../models';

// Get all news articles with pagination
export async function getNewsArticles(
  page: number = 1,
  pageSize: number = 10,
  filters?: { publishStatus?: string; search?: string }
): Promise<{ articles: NewsArticle[]; total: number }> {
  let whereClause = '1=1';
  const params: any[] = [];

  if (filters?.publishStatus) {
    whereClause += ' AND publish_status = ?';
    params.push(filters.publishStatus);
  }

  if (filters?.search) {
    whereClause += ' AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?)';
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  const offset = (page - 1) * pageSize;
  params.push(pageSize, offset);

  const articles = await query<NewsArticle>(
    `SELECT * FROM news_articles WHERE ${whereClause} ORDER BY publish_date DESC, created_at DESC LIMIT ? OFFSET ?`,
    params
  );

  const [totalResult] = await query<{ count: number }>(
    `SELECT COUNT(*) as count FROM news_articles WHERE ${whereClause}`,
    params.slice(0, -2)
  );

  return {
    articles,
    total: totalResult?.count || 0,
  };
}

// Get news article by ID
export async function getNewsArticleById(id: number): Promise<NewsArticle | null> {
  return await queryOne<NewsArticle>('SELECT * FROM news_articles WHERE id = ?', [id]);
}

// Get news article by slug
export async function getNewsArticleBySlug(slug: string): Promise<NewsArticle | null> {
  return await queryOne<NewsArticle>('SELECT * FROM news_articles WHERE slug = ?', [slug]);
}

// Create news article
export async function createNewsArticle(article: Omit<NewsArticle, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
  const result = await query<{ insertId: number }>(
    `INSERT INTO news_articles (title, slug, featured_image, excerpt, content, publish_status, publish_date, author, meta_title, meta_description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      article.title,
      article.slug,
      article.featured_image,
      article.excerpt,
      article.content,
      article.publish_status,
      article.publish_date,
      article.author,
      article.meta_title,
      article.meta_description,
    ]
  );
  return result[0]?.insertId || 0;
}

// Update news article
export async function updateNewsArticle(id: number, article: Partial<Omit<NewsArticle, 'id' | 'created_at' | 'updated_at'>>): Promise<boolean> {
  const fields: string[] = [];
  const values: any[] = [];

  Object.entries(article).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  });

  if (fields.length === 0) return false;

  values.push(id);
  await query(`UPDATE news_articles SET ${fields.join(', ')} WHERE id = ?`, values);
  return true;
}

// Delete news article
export async function deleteNewsArticle(id: number): Promise<boolean> {
  await query('DELETE FROM news_articles WHERE id = ?', [id]);
  return true;
}

