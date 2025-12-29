-- =============================================================================
-- v1.4 Database Reset — Fresh Exercise Data
-- Run in Supabase SQL Editor
-- =============================================================================

-- STEP 1: Clear cached plans (they reference old exercise IDs)
DELETE FROM generated_plans;

-- STEP 2: Clear all exercises
DELETE FROM exercises;

-- STEP 3: Reset the readable_id sequence to start from 1
ALTER SEQUENCE exercises_readable_id_seq RESTART WITH 1;

-- Verify tables are empty
SELECT 'exercises' as table_name, COUNT(*) as row_count FROM exercises
UNION ALL
SELECT 'generated_plans', COUNT(*) FROM generated_plans;
