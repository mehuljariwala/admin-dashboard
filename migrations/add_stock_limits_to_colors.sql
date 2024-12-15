-- Add min_stock and max_stock columns to colors table
ALTER TABLE colors
ADD COLUMN min_stock integer NOT NULL DEFAULT 0,
ADD COLUMN max_stock integer NOT NULL DEFAULT 100,
ADD COLUMN color_code varchar(7) NOT NULL DEFAULT '#000000';

-- Add check constraints
ALTER TABLE colors
ADD CONSTRAINT min_stock_non_negative CHECK (min_stock >= 0),
ADD CONSTRAINT max_stock_greater_than_min CHECK (max_stock >= min_stock),
ADD CONSTRAINT color_code_format CHECK (color_code ~ '^#[0-9A-Fa-f]{6}$');
