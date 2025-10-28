/*
  # Create images table for bulk upload application

  1. New Tables
    - `images`
      - `id` (uuid, primary key) - Unique identifier for each image
      - `filename` (text, not null) - Original filename for display purposes
      - `storage_path` (text, not null) - Path to the image in Supabase Storage
      - `file_size` (integer) - Size of the file in bytes
      - `mime_type` (text) - MIME type of the image
      - `uploaded_by` (uuid) - Reference to auth.users
      - `created_at` (timestamptz) - Upload timestamp
      - `sort_order` (integer) - For custom sorting if needed

  2. Security
    - Enable RLS on `images` table
    - Add policy for authenticated users to upload their own images
    - Add policy for authenticated users to view their own images
    - Add policy for authenticated users to delete their own images

  3. Indexes
    - Index on filename for sorting performance
    - Index on uploaded_by for filtering user images
*/

CREATE TABLE IF NOT EXISTS images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  storage_path text NOT NULL UNIQUE,
  file_size integer,
  mime_type text,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  sort_order integer DEFAULT 0
);

-- Create index for filename sorting
CREATE INDEX IF NOT EXISTS idx_images_filename ON images(filename);
CREATE INDEX IF NOT EXISTS idx_images_uploaded_by ON images(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_images_created_at ON images(created_at DESC);

-- Enable Row Level Security
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own images
CREATE POLICY "Users can upload own images"
  ON images
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

-- Policy: Users can view their own images
CREATE POLICY "Users can view own images"
  ON images
  FOR SELECT
  TO authenticated
  USING (auth.uid() = uploaded_by);

-- Policy: Users can update their own images
CREATE POLICY "Users can update own images"
  ON images
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = uploaded_by)
  WITH CHECK (auth.uid() = uploaded_by);

-- Policy: Users can delete their own images
CREATE POLICY "Users can delete own images"
  ON images
  FOR DELETE
  TO authenticated
  USING (auth.uid() = uploaded_by);