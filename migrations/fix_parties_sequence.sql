-- Drop the existing sequence
DROP SEQUENCE IF EXISTS parties_id_seq CASCADE;

-- Create a new sequence starting from the highest ID
CREATE SEQUENCE parties_id_seq;

-- Set the sequence to start from the highest existing ID + 1
SELECT setval('parties_id_seq', COALESCE((SELECT MAX(id) FROM parties), 0) + 1, false);

-- Alter the id column to use the new sequence
ALTER TABLE parties ALTER COLUMN id SET DEFAULT nextval('parties_id_seq');

-- Grant necessary permissions
ALTER SEQUENCE parties_id_seq OWNED BY parties.id;
