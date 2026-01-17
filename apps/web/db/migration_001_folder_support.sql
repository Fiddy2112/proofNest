-- Database Migration for Dashboard Features
-- Run this in Supabase Dashboard → SQL Editor

-- 1. Add folder_id column to proofs table
ALTER TABLE proofs ADD COLUMN IF NOT EXISTS folder_id UUID REFERENCES folders(id) ON DELETE SET NULL;

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_proofs_folder_id ON proofs(folder_id);
CREATE INDEX IF NOT EXISTS idx_proofs_user_created ON proofs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_folders_user_id ON folders(user_id);

-- 3. Update existing proofs to have NULL folder_id (already at root)
UPDATE proofs SET folder_id = NULL WHERE folder_id IS NULL;

-- 4. Verify folders table exists and has proper structure
CREATE TABLE IF NOT EXISTS folders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable RLS on folders table if not already enabled
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for folders
DROP POLICY IF EXISTS "Users can insert their own folders" ON folders;
DROP POLICY IF EXISTS "Users can select their own folders" ON folders;
DROP POLICY IF EXISTS "Users can update their own folders" ON folders;
DROP POLICY IF EXISTS "Users can delete their own folders" ON folders;

CREATE POLICY "Users can insert their own folders" ON folders
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can select their own folders" ON folders
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can update their own folders" ON folders
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own folders" ON folders
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- 7. Ensure notes and proofs tables have RLS policies
ALTER TABLE notes ENABLE ROW LEVEL SECURITY IF NOT EXISTS;
ALTER TABLE proofs ENABLE ROW LEVEL SECURITY IF NOT EXISTS;

-- Notes policies
DROP POLICY IF EXISTS "Users can insert notes" ON notes;
DROP POLICY IF EXISTS "Users can select notes" ON notes;
DROP POLICY IF EXISTS "Users can update notes" ON notes;
DROP POLICY IF EXISTS "Users can delete notes" ON notes;

CREATE POLICY "Users can insert notes" ON notes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can select notes" ON notes FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can update notes" ON notes FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can delete notes" ON notes FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Proofs policies
DROP POLICY IF EXISTS "Users can insert proofs" ON proofs;
DROP POLICY IF EXISTS "Users can select proofs" ON proofs;
DROP POLICY IF EXISTS "Users can update proofs" ON proofs;
DROP POLICY IF EXISTS "Users can delete proofs" ON proofs;

CREATE POLICY "Users can insert proofs" ON proofs FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can select proofs" ON proofs FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can update proofs" ON proofs FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can delete proofs" ON proofs FOR DELETE TO authenticated USING (user_id = auth.uid());

SELECT 'Migration completed successfully!' as status;
