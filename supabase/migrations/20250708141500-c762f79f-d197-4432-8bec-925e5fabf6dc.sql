-- Clean up duplicate RLS policies for dating_ads table
-- First remove the duplicate policies to avoid conflicts

DROP POLICY IF EXISTS "Users can create ads" ON dating_ads;
DROP POLICY IF EXISTS "Users can create their own dating ads" ON dating_ads;
DROP POLICY IF EXISTS "Users can delete own ads" ON dating_ads;
DROP POLICY IF EXISTS "Users can delete their own dating ads" ON dating_ads;
DROP POLICY IF EXISTS "Users can edit their own dating ads" ON dating_ads;
DROP POLICY IF EXISTS "Users can update own ads" ON dating_ads;
DROP POLICY IF EXISTS "Users can update their own avatar_url" ON dating_ads;
DROP POLICY IF EXISTS "Users can update their own dating ads" ON dating_ads;
DROP POLICY IF EXISTS "Users can view all dating ads" ON dating_ads;
DROP POLICY IF EXISTS "dating_ads_delete" ON dating_ads;
DROP POLICY IF EXISTS "dating_ads_delete_optimized" ON dating_ads;
DROP POLICY IF EXISTS "dating_ads_insert" ON dating_ads;
DROP POLICY IF EXISTS "dating_ads_insert_optimized" ON dating_ads;
DROP POLICY IF EXISTS "dating_ads_select" ON dating_ads;
DROP POLICY IF EXISTS "dating_ads_select_optimized" ON dating_ads;
DROP POLICY IF EXISTS "dating_ads_update" ON dating_ads;
DROP POLICY IF EXISTS "dating_ads_update_optimized" ON dating_ads;

-- Create clean, simple RLS policies
CREATE POLICY "Enable select for all users on active ads" ON dating_ads
    FOR SELECT USING (is_active = true);

CREATE POLICY "Enable insert for authenticated users own ads" ON dating_ads
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users own ads" ON dating_ads
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for users own ads" ON dating_ads
    FOR DELETE USING (auth.uid() = user_id);