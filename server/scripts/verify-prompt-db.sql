-- ============================================
-- PC-3 DATABASE VERIFICATION
-- ============================================

-- 1. Check tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'prompts',
    'prompt_versions',
    'prompt_tags'
  )
ORDER BY table_name;


-- 2. Check visibility default = private
SELECT
  column_name,
  column_default
FROM information_schema.columns
WHERE table_name = 'prompts'
  AND column_name = 'visibility';


-- 3. Check prompt_versions unique constraint
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'prompt_versions';


-- 4. Check NOT NULL constraints
SELECT
  table_name,
  column_name,
  is_nullable
FROM information_schema.columns
WHERE table_name IN (
  'prompts',
  'prompt_versions',
  'prompt_tags'
)
AND column_name IN (
  'author_id',
  'title',
  'prompt_type',
  'visibility',
  'lifecycle_status',
  'prompt_id',
  'version_number',
  'content',
  'editor_id',
  'tag_id'
)
ORDER BY table_name, column_name;


-- 5. Check foreign keys
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS referenced_table,
  ccu.column_name AS referenced_column,
  tc.constraint_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_name IN (
  'prompts',
  'prompt_versions',
  'prompt_tags'
)
ORDER BY tc.table_name;


-- 6. Check prompt_tags primary key
SELECT
  constraint_name,
  constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'prompt_tags'
  AND constraint_type = 'PRIMARY KEY';


-- 7. Check composite current-version FK
SELECT
  constraint_name,
  constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'prompts'
  AND constraint_type = 'FOREIGN KEY';