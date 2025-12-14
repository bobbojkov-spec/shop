
-- Add SEO columns to products table
ALTER TABLE products 
ADD COLUMN meta_keywords VARCHAR(500) NULL AFTER meta_description,
ADD COLUMN og_title VARCHAR(255) NULL AFTER meta_keywords,
ADD COLUMN og_description VARCHAR(500) NULL AFTER og_title,
ADD COLUMN og_image VARCHAR(500) NULL AFTER og_description,
ADD COLUMN canonical_url VARCHAR(500) NULL AFTER og_image;
