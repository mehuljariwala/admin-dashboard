-- Add route_id column to parties table
ALTER TABLE parties ADD COLUMN route_id INTEGER REFERENCES routes(id);

-- Create index for better query performance
CREATE INDEX idx_parties_route ON parties(route_id);
