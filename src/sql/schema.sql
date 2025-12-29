-- =============================================================================
-- FORMA DATABASE SCHEMA v1.0
-- Description: Setup script for Tables, Indexes, RLS Policies, and Seed Data.
-- =============================================================================

-- 1. EXTENSIONS
-- Enable UUID generation for unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- 2. TABLES
-- =============================================================================

-- Table: exercises
-- The "Source of Truth" derived from NotebookLM research.
CREATE TABLE IF NOT EXISTS public.exercises (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    readable_id SERIAL UNIQUE, -- Optimized integer ID for AI token economy
    name TEXT NOT NULL UNIQUE,
    target_muscle TEXT NOT NULL,
    secondary_muscles TEXT[],
    equipment TEXT[] NOT NULL,
    difficulty_tier INT DEFAULT 1 CHECK (difficulty_tier BETWEEN 1 AND 3),
    science_note TEXT, 
    science_source TEXT,
    video_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: generated_plans
-- Caching layer to store AI results and prevent redundant API calls.
CREATE TABLE IF NOT EXISTS public.generated_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id), -- Nullable for Guest users
    input_constraints JSONB NOT NULL,       -- The "Cache Key" (User inputs)
    plan_data JSONB NOT NULL,               -- The AI Result
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 3. INDEXES & OPTIMIZATION
-- =============================================================================

-- B-Tree for standard lookups
CREATE INDEX IF NOT EXISTS idx_exercises_muscle ON public.exercises(target_muscle);

-- GIN Indexes for Array/JSON filtering (Crucial for performance)
CREATE INDEX IF NOT EXISTS idx_exercises_equipment ON public.exercises USING GIN(equipment);
CREATE INDEX IF NOT EXISTS idx_plans_inputs ON public.generated_plans USING GIN(input_constraints);

-- =============================================================================
-- 4. SECURITY (ROW LEVEL SECURITY)
-- =============================================================================

ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_plans ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-runs)
DROP POLICY IF EXISTS "Public exercises are viewable by everyone" ON public.exercises;
DROP POLICY IF EXISTS "Anyone can create a plan" ON public.generated_plans;
DROP POLICY IF EXISTS "Public plans are viewable by everyone" ON public.generated_plans;

-- Policy: Everyone can read exercises (needed for the generator to work)
CREATE POLICY "Public exercises are viewable by everyone" 
ON public.exercises FOR SELECT 
USING (true);

-- Policy: Guests can create plans
CREATE POLICY "Anyone can create a plan" 
ON public.generated_plans FOR INSERT 
WITH CHECK (true);

-- Policy: Guests can read plans (scoped for MVP)
CREATE POLICY "Public plans are viewable by everyone" 
ON public.generated_plans FOR SELECT 
USING (true);

-- =============================================================================
-- 5. SEED DATA (RAG RESEARCH)
-- Includes "Base 12" + "Expansion Pack 20" (Total: 32 Exercises)
-- =============================================================================

INSERT INTO public.exercises 
(readable_id, name, target_muscle, secondary_muscles, equipment, difficulty_tier, science_note, science_source, video_url)
VALUES 
-- === CHEST & PUSH ===
(1, 'Barbell Bench Press', 'Chest', ARRAY['Triceps', 'Front Delts'], ARRAY['Barbell', 'Bench'], 2, 
'Produces the unequivocally highest EMG signal for the sternocostal head (lower/mid pec) in a horizontal plane.', 'Biomechanical Analysis of Upper Body Resistance', 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjgwMXMxdDJsa2lzdDB2aDMzNnFib3l1YnpsMmdwb3Vkb3FnZ3V5eiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2oWWe3cwQE0snrfBz1/giphy.gif'),
(2, 'Incline Dumbbell Press', 'Upper Chest', ARRAY['Triceps', 'Front Delts'], ARRAY['Dumbbell', 'Incline Bench'], 2, 
'Inclination (30°-45°) adjusts the resistance vector to maximize EMG amplitude in the clavicular head of the pec.', 'Effect of Bench Inclinations on Pectoralis Major', 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjgwMXMxdDJsa2lzdDB2aDMzNnFib3l1YnpsMmdwb3Vkb3FnZ3V5eiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2oWWe3cwQE0snrfBz1/giphy.gif'),
(28, 'Dip (Chest Version)', 'Chest', ARRAY['Triceps', 'Front Delts'], ARRAY['Bodyweight', 'Dip Station'], 2, 
'A forward lean shifts tension to the lower pectorals; often called the "upper body squat" for its mass building potential.', 'Journal of Strength and Conditioning Research', 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjgwMXMxdDJsa2lzdDB2aDMzNnFib3l1YnpsMmdwb3Vkb3FnZ3V5eiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2oWWe3cwQE0snrfBz1/giphy.gif'),

-- === BACK & PULL ===
(6, 'Pull Up', 'Lats', ARRAY['Biceps', 'Rear Delts'], ARRAY['Pull-up Bar'], 2, 
'LD recruitment is robustly stable across different grip types (pronated, neutral, supinated) and widths when intensity is controlled.', 'Electromyographic Analysis of Pulling Mechanics', 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjgwMXMxdDJsa2lzdDB2aDMzNnFib3l1YnpsMmdwb3Vkb3FnZ3V5eiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2oWWe3cwQE0snrfBz1/giphy.gif'),
(13, 'Bent Over Barbell Row', 'Mid Back', ARRAY['Lats', 'Biceps', 'Rear Delts'], ARRAY['Barbell'], 2, 
'Allows for heavy loading of the trapezius and rhomboids; torso angle determines lat vs. upper back bias.', 'Journal of Strength and Conditioning Research', 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjgwMXMxdDJsa2lzdDB2aDMzNnFib3l1YnpsMmdwb3Vkb3FnZ3V5eiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2oWWe3cwQE0snrfBz1/giphy.gif'),
(14, 'Lat Pulldown (Wide Grip)', 'Lats', ARRAY['Biceps', 'Rear Delts'], ARRAY['Cable', 'Machine'], 1, 
'A scalable vertical pull that isolates the latissimus dorsi with less stability demand than a pull-up.', 'NSCA Essentials of Strength Training', 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjgwMXMxdDJsa2lzdDB2aDMzNnFib3l1YnpsMmdwb3Vkb3FnZ3V5eiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2oWWe3cwQE0snrfBz1/giphy.gif'),
(7, 'Seated Cable Row', 'Mid Back', ARRAY['Lats', 'Biceps', 'Rhomboids'], ARRAY['Cable', 'Bench'], 1, 
'This horizontal pulling movement uniquely generates the highest myoelectric activity in the scapular retractors.', 'Variations in muscle activation levels', 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjgwMXMxdDJsa2lzdDB2aDMzNnFib3l1YnpsMmdwb3Vkb3FnZ3V5eiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2oWWe3cwQE0snrfBz1/giphy.gif'),
(16, 'T-Bar Row', 'Mid Back', ARRAY['Lats', 'Biceps'], ARRAY['Machine', 'Barbell'], 2, 
'Chest-supported variations minimize lower back strain while allowing maximal output on the retractors.', 'Biomechanics of Rowing Exercises', 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjgwMXMxdDJsa2lzdDB2aDMzNnFib3l1YnpsMmdwb3Vkb3FnZ3V5eiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2oWWe3cwQE0snrfBz1/giphy.gif'),

-- === LEGS (QUADS/GLUTES/HAMS) ===
(3, 'Barbell Squat', 'Glutes', ARRAY['Quads', 'Hamstrings', 'Lower Back'], ARRAY['Barbell', 'Rack'], 3, 
'A traditional back squat with a wider stance is proven to result in substantially higher Gluteus Maximus activation.', 'A Biomechanical Review of the Squat', 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjgwMXMxdDJsa2lzdDB2aDMzNnFib3l1YnpsMmdwb3Vkb3FnZ3V5eiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2oWWe3cwQE0snrfBz1/giphy.gif'),
(17, 'Leg Press', 'Quads', ARRAY['Glutes'], ARRAY['Machine'], 1, 
'Provides high stability, allowing for maximal motor unit recruitment in the quadriceps without spinal loading.', 'Medicine & Science in Sports & Exercise', 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjgwMXMxdDJsa2lzdDB2aDMzNnFib3l1YnpsMmdwb3Vkb3FnZ3V5eiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2oWWe3cwQE0snrfBz1/giphy.gif'),
(18, 'Bulgarian Split Squat', 'Glutes', ARRAY['Quads', 'Adductors'], ARRAY['Dumbbell', 'Bench'], 3, 
'Unilateral loading fixes imbalances and places extreme stretch-mediated tension on the glute max.', 'European Journal of Applied Physiology', 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjgwMXMxdDJsa2lzdDB2aDMzNnFib3l1YnpsMmdwb3Vkb3FnZ3V5eiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2oWWe3cwQE0snrfBz1/giphy.gif'),
(22, 'Goblet Squat', 'Quads', ARRAY['Glutes', 'Core'], ARRAY['Dumbbell'], 1, 
'Anterior loading forces an upright torso, maximizing quad activation while teaching proper squat mechanics.', 'Strength and Conditioning Journal', 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjgwMXMxdDJsa2lzdDB2aDMzNnFib3l1YnpsMmdwb3Vkb3FnZ3V5eiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2oWWe3cwQE0snrfBz1/giphy.gif'),
(11, 'Leg Extension', 'Quads', ARRAY[]::TEXT[], ARRAY['Machine'], 1, 
'Single-joint exercise that overcomes biarticular inhibition, maximizing activation and hypertrophy of the Rectus Femoris muscle.', 'Comparative Biomechanics of Lower Body Training', 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjgwMXMxdDJsa2lzdDB2aDMzNnFib3l1YnpsMmdwb3Vkb3FnZ3V5eiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2oWWe3cwQE0snrfBz1/giphy.gif'),
(4, 'Romanian Deadlift', 'Hamstrings', ARRAY['Glutes', 'Lower Back'], ARRAY['Barbell'], 2, 
'A hip-dominant exercise that maximally loads the hamstrings at long muscle lengths, crucial for proximal adaptation.', 'Comparative Biomechanics of Lower Body Training', 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjgwMXMxdDJsa2lzdDB2aDMzNnFib3l1YnpsMmdwb3Vkb3FnZ3V5eiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2oWWe3cwQE0snrfBz1/giphy.gif'),
(12, 'Leg Curl', 'Hamstrings', ARRAY[]::TEXT[], ARRAY['Machine'], 1, 
'A knee-dominant action that isolates knee flexion, generating maximal tension at shorter muscle lengths targeting distal hamstrings.', 'Regional Differences in Muscle Activation', 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjgwMXMxdDJsa2lzdDB2aDMzNnFib3l1YnpsMmdwb3Vkb3FnZ3V5eiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2oWWe3cwQE0snrfBz1/giphy.gif'),
(19, 'Walking Lunge', 'Glutes', ARRAY['Quads', 'Hamstrings'], ARRAY['Dumbbell', 'Bodyweight'], 2, 
'Dynamic unilateral movement that increases metabolic demand and stabilizer recruitment compared to static lunges.', 'Journal of Sports Sciences', 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjgwMXMxdDJsa2lzdDB2aDMzNnFib3l1YnpsMmdwb3Vkb3FnZ3V5eiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2oWWe3cwQE0snrfBz1/giphy.gif'),

-- === SHOULDERS ===
(10, 'Overhead Press', 'Front Delts', ARRAY['Triceps', 'Upper Chest'], ARRAY['Barbell'], 2, 
'As a vertical pressing movement, it is typically highly front delt dominant, but provides high tension while the shoulder is stretched.', 'The Best And Worst Shoulder Exercises Analysis', 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjgwMXMxdDJsa2lzdDB2aDMzNnFib3l1YnpsMmdwb3Vkb3FnZ3V5eiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2oWWe3cwQE0snrfBz1/giphy.gif'),
(32, 'Arnold Press', 'Front Delts', ARRAY['Side Delts', 'Triceps'], ARRAY['Dumbbell'], 2, 
'The rotation increases the range of motion and time under tension for the anterior deltoid.', 'Journal of Strength and Conditioning Research', 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjgwMXMxdDJsa2lzdDB2aDMzNnFib3l1YnpsMmdwb3Vkb3FnZ3V5eiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2oWWe3cwQE0snrfBz1/giphy.gif'),
(5, 'Lateral Raise', 'Side Delts', ARRAY['Traps'], ARRAY['Dumbbell'], 1, 
'Standard dumbbell execution has zero tension at the bottom of the movement, with peak tension achieved only at the top.', 'Biomechanics of the Shoulder Complex', 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjgwMXMxdDJsa2lzdDB2aDMzNnFib3l1YnpsMmdwb3Vkb3FnZ3V5eiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2oWWe3cwQE0snrfBz1/giphy.gif'),
(31, 'Upright Row', 'Side Delts', ARRAY['Traps'], ARRAY['Barbell', 'Cable'], 2, 
'Significantly activates the lateral deltoid; wide grip is recommended to minimize shoulder impingement risk.', 'Strength and Conditioning Journal', 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjgwMXMxdDJsa2lzdDB2aDMzNnFib3l1YnpsMmdwb3Vkb3FnZ3V5eiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2oWWe3cwQE0snrfBz1/giphy.gif'),
(15, 'Face Pull', 'Rear Delts', ARRAY['Rotator Cuff', 'Traps'], ARRAY['Cable'], 1, 
'Critical for shoulder health; targets the external rotators and rear deltoids to offset pressing volume.', 'Journal of Physical Therapy Science', 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjgwMXMxdDJsa2lzdDB2aDMzNnFib3l1YnpsMmdwb3Vkb3FnZ3V5eiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2oWWe3cwQE0snrfBz1/giphy.gif'),
(30, 'Reverse Pec Deck', 'Rear Delts', ARRAY['Rhomboids'], ARRAY['Machine'], 1, 
'Isolates the rear deltoids with high stability, preventing momentum cheating common in dumbbell variations.', 'Journal of Strength and Conditioning Research', 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjgwMXMxdDJsa2lzdDB2aDMzNnFib3l1YnpsMmdwb3Vkb3FnZ3V5eiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2oWWe3cwQE0snrfBz1/giphy.gif'),

-- === ARMS (BICEPS/TRICEPS) ===
(9, 'Bicep Curl', 'Biceps', ARRAY['Forearms'], ARRAY['Dumbbell'], 1, 
'Preacher curls increase tension in the stretched position, leading to significantly greater distal elbow flexor thickness than incline curls.', 'Distinct muscle growth adaptations', 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjgwMXMxdDJsa2lzdDB2aDMzNnFib3l1YnpsMmdwb3Vkb3FnZ3V5eiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2oWWe3cwQE0snrfBz1/giphy.gif'),
(23, 'Hammer Curl', 'Biceps', ARRAY['Forearms'], ARRAY['Dumbbell'], 1, 
'Targets the Brachialis (muscle under the bicep) and Brachioradialis, adding width to the arm.', 'Journal of Sports Science & Medicine', 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjgwMXMxdDJsa2lzdDB2aDMzNnFib3l1YnpsMmdwb3Vkb3FnZ3V5eiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2oWWe3cwQE0snrfBz1/giphy.gif'),
(24, 'Incline Dumbbell Curl', 'Biceps', ARRAY[]::TEXT[], ARRAY['Dumbbell', 'Incline Bench'], 2, 
'Places the bicep long head in extreme extension behind the body, maximizing stretch-mediated hypertrophy.', 'Journal of Sports Science & Medicine', 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjgwMXMxdDJsa2lzdDB2aDMzNnFib3l1YnpsMmdwb3Vkb3FnZ3V5eiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2oWWe3cwQE0snrfBz1/giphy.gif'),
(25, 'Concentration Curl', 'Biceps', ARRAY[]::TEXT[], ARRAY['Dumbbell'], 1, 
'Eliminates body sway (momentum), resulting in some of the highest recorded EMG activation for the biceps.', 'ACE Study: Biceps Activation', 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjgwMXMxdDJsa2lzdDB2aDMzNnFib3l1YnpsMmdwb3Vkb3FnZ3V5eiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2oWWe3cwQE0snrfBz1/giphy.gif'),
(8, 'Tricep Pushdown', 'Triceps', ARRAY[]::TEXT[], ARRAY['Cable'], 1, 
'Provides strong, mid-range neural recruitment (75% MVIC for long head) and is ideally suited for high volume isolation work.', 'Biomechanical Analysis of Specificity', 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjgwMXMxdDJsa2lzdDB2aDMzNnFib3l1YnpsMmdwb3Vkb3FnZ3V5eiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2oWWe3cwQE0snrfBz1/giphy.gif'),
(26, 'Skull Crusher', 'Triceps', ARRAY[]::TEXT[], ARRAY['Barbell', 'EZ Bar'], 2, 
'Targets the long head of the triceps by loading the muscle in a stretched position overhead.', 'Journal of Strength and Conditioning Research', 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjgwMXMxdDJsa2lzdDB2aDMzNnFib3l1YnpsMmdwb3Vkb3FnZ3V5eiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2oWWe3cwQE0snrfBz1/giphy.gif'),
(27, 'Tricep Overhead Extension', 'Triceps', ARRAY[]::TEXT[], ARRAY['Dumbbell', 'Cable'], 2, 
'Maximally stretches the long head of the triceps, which is essential for complete tricep development.', 'Journal of Strength and Conditioning Research', 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjgwMXMxdDJsa2lzdDB2aDMzNnFib3l1YnpsMmdwb3Vkb3FnZ3V5eiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2oWWe3cwQE0snrfBz1/giphy.gif'),
(29, 'Dip (Tricep Version)', 'Triceps', ARRAY['Chest', 'Front Delts'], ARRAY['Bodyweight', 'Dip Station'], 2, 
'Keeping the torso upright reduces chest involvement and places maximal load on the triceps heads.', 'Journal of Strength and Conditioning Research', 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjgwMXMxdDJsa2lzdDB2aDMzNnFib3l1YnpsMmdwb3Vkb3FnZ3V5eiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2oWWe3cwQE0snrfBz1/giphy.gif'),

-- === CALVES ===
(20, 'Standing Calf Raise', 'Calves', ARRAY[]::TEXT[], ARRAY['Machine', 'Dumbbell'], 1, 
'Targets the Gastrocnemius (outer calf) which requires straight-knee loading to be fully activated.', 'Journal of Applied Biomechanics', 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjgwMXMxdDJsa2lzdDB2aDMzNnFib3l1YnpsMmdwb3Vkb3FnZ3V5eiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2oWWe3cwQE0snrfBz1/giphy.gif'),
(21, 'Seated Calf Raise', 'Calves', ARRAY[]::TEXT[], ARRAY['Machine', 'Dumbbell'], 1, 
'Targets the Soleus (deep calf muscle) by keeping the knee bent, deactivating the Gastrocnemius.', 'Journal of Applied Biomechanics', 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjgwMXMxdDJsa2lzdDB2aDMzNnFib3l1YnpsMmdwb3Vkb3FnZ3V5eiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2oWWe3cwQE0snrfBz1/giphy.gif')

ON CONFLICT (readable_id) DO UPDATE SET
    name = EXCLUDED.name,
    target_muscle = EXCLUDED.target_muscle,
    science_note = EXCLUDED.science_note;
