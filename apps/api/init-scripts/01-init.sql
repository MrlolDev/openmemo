-- OpenMemo Database Initialization
-- This script runs when the PostgreSQL container is first created

-- Create extensions that might be useful
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For fuzzy text search

-- Set timezone
SET timezone = 'UTC';

-- Create database user with appropriate permissions
-- (Note: The main database and user are already created via environment variables)

-- You can add any additional initialization here
-- For example, custom functions, indexes, or initial data

-- Log successful initialization
DO $$
BEGIN
  RAISE NOTICE 'OpenMemo database initialized successfully at %', now();
END $$;