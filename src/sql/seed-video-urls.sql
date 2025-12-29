-- ============================================================================
-- v1.4 "The Value" — Exercise Video URLs
-- Run this in Supabase SQL Editor to seed video URLs for testing
-- ============================================================================

-- Barbell Bench Press (readable_id = 1)
UPDATE exercises 
SET video_url = 'https://www.youtube.com/embed/_FkbD0FhgVE' 
WHERE readable_id = 1;

-- Barbell Squat (readable_id = 3)
UPDATE exercises 
SET video_url = 'https://www.youtube.com/embed/-bJIpOq-LWk' 
WHERE readable_id = 3;

-- Verify the updates
SELECT readable_id, name, video_url 
FROM exercises 
WHERE video_url IS NOT NULL;
