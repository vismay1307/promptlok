
-- ============================================
-- REQ-1 DATABASE STRUCTURE VERIFICATION
-- ============================================

-- 1. Check all request-related tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'prompt_requests',
    'prompt_request_responses',
    'request_tags'
  )
ORDER BY table_name;


-- 2. Check request table columns and nullability
SELECT
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
    'prompt_requests',
    'prompt_request_responses',
    'request_tags'
  )
ORDER BY table_name, ordinal_position;


-- 3. Check all constraints, including composite foreign keys
SELECT
  rel.relname AS table_name,
  con.conname AS constraint_name,
  CASE con.contype
    WHEN 'p' THEN 'PRIMARY KEY'
    WHEN 'f' THEN 'FOREIGN KEY'
    WHEN 'u' THEN 'UNIQUE'
    WHEN 'c' THEN 'CHECK'
    ELSE con.contype::text
  END AS constraint_type,
  pg_get_constraintdef(con.oid) AS definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN pg_namespace ns ON ns.oid = rel.relnamespace
WHERE ns.nspname = 'public'
  AND rel.relname IN (
    'prompt_requests',
    'prompt_request_responses',
    'request_tags'
  )
ORDER BY rel.relname, con.contype, con.conname;


-- 4. Check indexes, including partial unique indexes
SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN (
    'prompt_requests',
    'prompt_request_responses',
    'request_tags'
  )
ORDER BY tablename, indexname;


-- 5. Check request status enum
SELECT
  t.typname AS enum_name,
  e.enumlabel AS enum_value,
  e.enumsortorder
FROM pg_type t
JOIN pg_enum e ON e.enumtypid = t.oid
WHERE t.typname = 'request_status'
ORDER BY e.enumsortorder;
