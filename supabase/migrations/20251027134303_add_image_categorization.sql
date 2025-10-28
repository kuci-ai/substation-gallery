/*
  # Add image categorization support

  1. Schema Changes
    - Add `category` column to images table for storing the category prefix
    - Add `item_type` column for storing the specific item shortform
    - Add `location` column for storing location info from filename
    - Add `date_taken` column for storing date from filename
    - Add `sequence` column for storing sequence number from filename

  2. Indexes
    - Add index on category for fast filtering
    - Add index on item_type for searching specific items
    - Add composite index on category and filename for sorted views

  3. Notes
    - Category will be auto-detected from filename prefix (gen_, sc_, stk_, vi_, mi_, ts_)
    - Item type will be extracted from the filename pattern
    - This enables automatic organization into folders based on prefix
*/

-- Add new columns to images table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'images' AND column_name = 'category'
  ) THEN
    ALTER TABLE images ADD COLUMN category text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'images' AND column_name = 'item_type'
  ) THEN
    ALTER TABLE images ADD COLUMN item_type text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'images' AND column_name = 'location'
  ) THEN
    ALTER TABLE images ADD COLUMN location text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'images' AND column_name = 'date_taken'
  ) THEN
    ALTER TABLE images ADD COLUMN date_taken text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'images' AND column_name = 'sequence'
  ) THEN
    ALTER TABLE images ADD COLUMN sequence text;
  END IF;
END $$;

-- Create indexes for category filtering
CREATE INDEX IF NOT EXISTS idx_images_category ON images(category);
CREATE INDEX IF NOT EXISTS idx_images_item_type ON images(item_type);
CREATE INDEX IF NOT EXISTS idx_images_category_filename ON images(category, filename);