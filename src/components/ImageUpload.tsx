import { useState, useRef } from 'react';
import { Upload, X, Tag } from 'lucide-react';
import { supabase, type Image } from '../lib/supabase';
import { parseImageFilename, getCategoryColor, isValidFileType, isValidNamingFormat } from '../lib/imageParser';

interface ImageUploadProps {
  onUploadComplete: () => void;
}

export function ImageUpload({ onUploadComplete }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];
    
    files.forEach(file => {
      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';
      
      if (!isImage && !isPdf) {
        invalidFiles.push(`${file.name} - Invalid file type`);
        return;
      }
      
      if (!isValidNamingFormat(file.name)) {
        invalidFiles.push(`${file.name} - Invalid naming format (must follow {prefix}_{shortform})`);
        return;
      }
      
      if (isValidFileType(file.name)) {
        validFiles.push(file);
      } else {
        invalidFiles.push(`${file.name} - Invalid file type for category`);
      }
    });
    
    if (invalidFiles.length > 0) {
      alert(`The following files were rejected:\n\n${invalidFiles.join('\n')}\n\nValid format examples:\n- vi_switchgear_image.jpg\n- sc_transformer_location_date.jpg\n- ts_cbm_test.pdf`);
    }
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];
    
    files.forEach(file => {
      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';
      
      if (!isImage && !isPdf) {
        invalidFiles.push(`${file.name} - Invalid file type`);
        return;
      }
      
      if (!isValidNamingFormat(file.name)) {
        invalidFiles.push(`${file.name} - Invalid naming format (must follow {prefix}_{shortform})`);
        return;
      }
      
      if (isValidFileType(file.name)) {
        validFiles.push(file);
      } else {
        invalidFiles.push(`${file.name} - Invalid file type for category`);
      }
    });
    
    if (invalidFiles.length > 0) {
      alert(`The following files were rejected:\n\n${invalidFiles.join('\n')}\n\nValid format examples:\n- vi_switchgear_image.jpg\n- sc_transformer_location_date.jpg\n- ts_cbm_test.pdf`);
    }
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const getFileCategory = (filename: string) => {
    const parsed = parseImageFilename(filename);
    return parsed;
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);

    try {
      // Get existing images from localStorage
      const storedImages = localStorage.getItem('uploaded_images');
      const existingImages: Image[] = storedImages ? JSON.parse(storedImages) : [];
      const existingFilenames = new Set(existingImages.map(img => img.filename));
      
      const duplicates: string[] = [];
      const filesToUpload: File[] = [];

      for (const file of selectedFiles) {
        if (existingFilenames.has(file.name)) {
          duplicates.push(file.name);
        } else {
          filesToUpload.push(file);
        }
      }

      if (duplicates.length > 0) {
        alert(`The following files already exist and will be skipped:\n\n${duplicates.join('\n')}`);
      }

      if (filesToUpload.length === 0) {
        setUploading(false);
        setSelectedFiles([]);
        return;
      }

      const newImages: Image[] = [];

      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `mock-user/${fileName}`;

        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

        // Store file in localStorage
        const reader = new FileReader();
        reader.onload = () => {
          localStorage.setItem(`file_${filePath}`, reader.result as string);
        };
        reader.readAsDataURL(file);

        const parsedInfo = parseImageFilename(file.name);

        const newImage: Image = {
          id: `img-${Date.now()}-${i}`,
          filename: file.name,
          storage_path: filePath,
          file_size: file.size,
          mime_type: file.type,
          uploaded_by: 'mock-user',
          created_at: new Date().toISOString(),
          sort_order: 0,
          category: parsedInfo.category,
          item_type: parsedInfo.itemType,
          location: parsedInfo.location,
          date_taken: parsedInfo.dateTaken,
          sequence: parsedInfo.sequence,
        };

        newImages.push(newImage);
        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
      }

      // Update localStorage with new images
      const updatedImages = [...existingImages, ...newImages];
      localStorage.setItem('uploaded_images', JSON.stringify(updatedImages));

      setSelectedFiles([]);
      setUploadProgress({});
      onUploadComplete();
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="space-y-4">
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-teal-500 bg-teal-50 scale-105'
              : 'border-slate-300 hover:border-slate-400'
          }`}
        >
          <Upload className={`mx-auto h-12 w-12 mb-3 ${isDragging ? 'text-teal-500' : 'text-slate-400'}`} />
          <p className={`font-medium mb-1 ${isDragging ? 'text-teal-600' : 'text-slate-600'}`}>
            {isDragging ? 'Drop files here' : 'Click to select files'}
          </p>
          <p className="text-sm text-slate-500">Images (jpg, png, tif) or Test Sheets (pdf only)</p>
          <p className="text-xs text-slate-400 mt-1">Filename format: {prefix}_{shortform}_[location]_[date]_[sequence].ext</p>
          <p className="text-xs text-slate-400">Examples: vi_switchgear_image.jpg, sc_transformer_location_date.jpg</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-700">Selected Files ({selectedFiles.length})</h3>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-slate-50 p-3 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(getFileCategory(file.name).category)}`}>
                        {getFileCategory(file.name).category}
                      </span>
                      <p className="text-xs text-slate-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    {uploadProgress[file.name] !== undefined && (
                      <div className="mt-1 w-full bg-slate-200 rounded-full h-1.5">
                        <div
                          className="bg-teal-600 h-1.5 rounded-full transition-all"
                          style={{ width: `${uploadProgress[file.name]}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    disabled={uploading}
                    className="ml-3 p-1 hover:bg-slate-200 rounded disabled:opacity-50"
                  >
                    <X className="h-5 w-5 text-slate-500" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={uploadImages}
              disabled={uploading}
              className="w-full bg-teal-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} Image${selectedFiles.length > 1 ? 's' : ''}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
