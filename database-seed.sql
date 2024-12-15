-- Insert main categories
INSERT INTO color_categories (name, display_order) VALUES
('5 TAR', 1),
('3 TAR', 2),
('Yarn', 3);

-- Insert subcategories for 5 TAR
INSERT INTO color_subcategories (name, category_id, display_order) VALUES
('Multy', 1, 1),    -- For 5 TAR
('Polyester', 1, 2); -- For 5 TAR
