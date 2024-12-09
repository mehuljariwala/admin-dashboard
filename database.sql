-- Drop existing triggers
DROP TRIGGER IF EXISTS update_parties_updated_at ON parties;
DROP TRIGGER IF EXISTS update_colors_updated_at ON colors;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
DROP TRIGGER IF EXISTS update_routes_updated_at ON routes;
DROP TRIGGER IF EXISTS update_sub_admins_updated_at ON sub_admins;

-- Drop existing functions
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop existing indexes
DROP INDEX IF EXISTS idx_colors_category;
DROP INDEX IF EXISTS idx_order_items_order;
DROP INDEX IF EXISTS idx_order_items_color;
DROP INDEX IF EXISTS idx_orders_party;
DROP INDEX IF EXISTS idx_inventory_transactions_color;
DROP INDEX IF EXISTS idx_parties_route;

-- Drop existing tables in correct order (respecting foreign key dependencies)
DROP TABLE IF EXISTS inventory_transactions CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS colors CASCADE;
DROP TABLE IF EXISTS parties CASCADE;
DROP TABLE IF EXISTS color_categories CASCADE;
DROP TABLE IF EXISTS routes CASCADE;
DROP TABLE IF EXISTS sub_admins CASCADE;

-- Create color_categories table
CREATE TABLE color_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    display_order INT NOT NULL
);

-- Insert the main categories
INSERT INTO color_categories (name, display_order) VALUES
('5 TAR', 1),
('3 TAR', 2),
('YARN', 3),
('Multy', 4);

-- Create routes table first (since parties will reference it)
CREATE TABLE routes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create parties table with route_id
CREATE TABLE parties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    contact_number VARCHAR(20),
    route_id INTEGER REFERENCES routes(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create colors table with color_code for styling
CREATE TABLE colors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    category_id INTEGER REFERENCES color_categories(id),
    display_order INTEGER,
    color_code VARCHAR(50), -- For CSS styling
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    party_id INTEGER REFERENCES parties(id),
    date DATE NOT NULL,
    delivery_date DATE,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create order_items table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    color_id INTEGER REFERENCES colors(id),
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create inventory_transactions table
CREATE TABLE inventory_transactions (
    id SERIAL PRIMARY KEY,
    color_id INTEGER REFERENCES colors(id),
    transaction_type VARCHAR(10) NOT NULL CHECK (transaction_type IN ('IN', 'OUT')),
    quantity INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create sub_admins table
CREATE TABLE sub_admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample colors for each category with color codes
INSERT INTO colors (name, code, category_id, display_order, color_code) VALUES
-- 5 TAR Colors
('Red', '2', 1, 1, '#ff0000'),
('Rani', '11', 1, 2, '#ff69b4'),
('R Blue', '14', 1, 3, '#0000ff'),
('Green', '-5', 1, 4, '#008000'),
('Orange', '17', 1, 5, '#ffa500'),
('Jambi', '9', 1, 6, '#800080'),
('Majenta', '4', 1, 7, '#ff00ff'),
('Firozi', '7', 1, 8, '#40e0d0'),
('Rama', '16', 1, 9, '#00ffff'),
('Golden', '2', 1, 10, '#ffd700'),
('Perot', '2', 1, 11, '#98fb98'),
('Gajari', '4', 1, 12, '#ff6347'),
('N Blue', '12', 1, 13, '#000080'),
('Chiku', '26', 1, 14, '#d2691e'),
('C Green', '13', 1, 15, '#90ee90'),
('Oninen', '5', 1, 16, '#4b0082'),
('L Green', '6', 1, 17, '#90ee90'),
('L Perot', '3', 1, 18, '#98fb98'),
('White', '2', 1, 19, '#ffffff'),
('LEMON', '0', 1, 20, '#fff44f'),
('L MAHENDI', '15', 1, 21, '#c04000'),

-- 3 TAR Colors
('Black', '19', 2, 1, '#000000'),
('Mahrron', '4', 2, 2, '#800000'),
('Gray', '-4', 2, 3, '#808080'),
('B Cream', '-4', 2, 4, '#ffe4c4'),
('D Pink', '2', 2, 5, '#ff1493'),
('Wine', '0', 2, 6, '#722f37'),
('B Green', '5', 2, 7, '#006400'),
('Cofee', '-2', 2, 8, '#6f4e37'),
('Pista', '4', 2, 9, '#bdb76b'),
('Pitch', '-3', 2, 10, '#000000'),
('Mahendi', '-3', 2, 11, '#73b839'),
('Sky', '2', 2, 12, '#87ceeb'),
('Lovender', '6', 2, 13, '#e6e6fa'),
('Petrol', '3', 2, 14, '#004f98'),
('C Green(poly)', '3', 2, 15, '#90ee90'),
('Mustard', '0', 2, 16, '#ffdb58'),
('Rust', '1', 2, 17, '#b7410e'),

-- Multy Colors
('D Multy', '1', 4, 1, '#ff0000'),
('L Multy', '2', 4, 2, '#ff69b4'),
('AK Multy', '3', 4, 3, '#0000ff');

-- Create indexes for better query performance
CREATE INDEX idx_colors_category ON colors(category_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_color ON order_items(color_id);
CREATE INDEX idx_orders_party ON orders(party_id);
CREATE INDEX idx_inventory_transactions_color ON inventory_transactions(color_id);
CREATE INDEX idx_parties_route ON parties(route_id);

-- Add triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_parties_updated_at
    BEFORE UPDATE ON parties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_colors_updated_at
    BEFORE UPDATE ON colors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_routes_updated_at
    BEFORE UPDATE ON routes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sub_admins_updated_at
    BEFORE UPDATE ON sub_admins
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
