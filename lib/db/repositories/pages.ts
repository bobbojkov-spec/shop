import { query, queryOne } from '../connection';
import { Page, PageSection } from '../models';

// Get all pages
export async function getPages(): Promise<Page[]> {
  return await query<Page>('SELECT * FROM pages ORDER BY created_at DESC');
}

// Get page by ID
export async function getPageById(id: number): Promise<Page | null> {
  return await queryOne<Page>('SELECT * FROM pages WHERE id = ?', [id]);
}

// Get page by slug
export async function getPageBySlug(slug: string): Promise<Page | null> {
  return await queryOne<Page>('SELECT * FROM pages WHERE slug = ?', [slug]);
}

// Get page sections
export async function getPageSections(pageId: number): Promise<PageSection[]> {
  return await query<PageSection>(
    'SELECT * FROM page_sections WHERE page_id = ? ORDER BY `order` ASC',
    [pageId]
  );
}

// Create page
export async function createPage(page: Omit<Page, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
  const result = await query<{ insertId: number }>(
    `INSERT INTO pages (page_type, slug, title, hero_image, content, meta_title, meta_description)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      page.page_type,
      page.slug,
      page.title,
      page.hero_image,
      page.content,
      page.meta_title,
      page.meta_description,
    ]
  );
  return result[0]?.insertId || 0;
}

// Update page
export async function updatePage(id: number, page: Partial<Omit<Page, 'id' | 'created_at' | 'updated_at'>>): Promise<boolean> {
  const fields: string[] = [];
  const values: any[] = [];

  Object.entries(page).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  });

  if (fields.length === 0) return false;

  values.push(id);
  await query(`UPDATE pages SET ${fields.join(', ')} WHERE id = ?`, values);
  return true;
}

// Delete page
export async function deletePage(id: number): Promise<boolean> {
  await query('DELETE FROM pages WHERE id = ?', [id]);
  return true;
}

// Create page section
export async function createPageSection(section: Omit<PageSection, 'id' | 'created_at'>): Promise<number> {
  const result = await query<{ insertId: number }>(
    `INSERT INTO page_sections (page_id, section_type, title, content, image, link, \`order\`)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      section.page_id,
      section.section_type,
      section.title,
      section.content,
      section.image,
      section.link,
      section.order,
    ]
  );
  return result[0]?.insertId || 0;
}

// Delete page sections
export async function deletePageSections(pageId: number): Promise<void> {
  await query('DELETE FROM page_sections WHERE page_id = ?', [pageId]);
}

