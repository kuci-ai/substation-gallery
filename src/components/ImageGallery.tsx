import { useState, useEffect } from 'react';
import { Trash2, Image as ImageIcon, Filter, Folder, FileText, X } from 'lucide-react';
import { supabase, type Image } from '../lib/supabase';
import { CATEGORIES, getCategoryColor, type ImageCategory } from '../lib/imageParser';

export function ImageGallery() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ImageCategory | 'All'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'grouped'>('grouped');
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

  const fetchImages = async () => {
    try {
      setLoading(true);
      
      // Get images from localStorage
      const storedImages = localStorage.getItem('uploaded_images');
      const imagesData: Image[] = storedImages ? JSON.parse(storedImages) : [];
      
      // Filter by category if needed
      const filteredImages = selectedCategory === 'All' 
        ? imagesData 
        : imagesData.filter(img => img.category === selectedCategory);
      
      setImages(filteredImages);

      // Get image URLs from localStorage
      const urls: Record<string, string> = {};
      for (const image of filteredImages) {
        const storedUrl = localStorage.getItem(`file_${image.storage_path}`);
        if (storedUrl) {
          urls[image.id] = storedUrl;
        }
      }
      setImageUrls(urls);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [selectedCategory]);

  const deleteImage = async (image: Image) => {
    if (!confirm(`Delete "${image.filename}"?`)) return;

    try {
      // Remove from localStorage
      const storedImages = localStorage.getItem('uploaded_images');
      const imagesData: Image[] = storedImages ? JSON.parse(storedImages) : [];
      const updatedImages = imagesData.filter(img => img.id !== image.id);
      localStorage.setItem('uploaded_images', JSON.stringify(updatedImages));
      
      // Remove file from localStorage
      localStorage.removeItem(`file_${image.storage_path}`);

      setImages(prev => prev.filter(img => img.id !== image.id));
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error deleting image. Please try again.');
    }
  };

  const groupedImages = images.reduce((acc, image) => {
    const category = image.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(image);
    return acc;
  }, {} as Record<string, Image[]>);

  const categoryCounts = images.reduce((acc, image) => {
    const category = image.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  const renderImageCard = (image: Image) => {
    const isPdf = image.mime_type === 'application/pdf';

    return (
      <div
        key={image.id}
        className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-200"
      >
        <div className="aspect-square relative overflow-hidden bg-slate-100">
          {isPdf ? (
            <a
              href={imageUrls[image.id]}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-full flex flex-col items-center justify-center bg-orange-50 hover:bg-orange-100 transition-colors"
            >
              <FileText className="h-16 w-16 text-orange-600 mb-2" />
              <span className="text-sm font-medium text-orange-800">View PDF</span>
            </a>
          ) : (
            <img
              src={imageUrls[image.id]}
              alt={image.filename}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )}
          <button
            onClick={() => deleteImage(image)}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
            title="Delete image"
          >
            <X className="h-4 w-4" />
          </button>
          {image.category && (
            <div className="absolute top-2 left-2">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(image.category as ImageCategory)}`}>
                {image.category}
              </span>
            </div>
          )}
        </div>
        <div className="p-3">
          <p className="text-sm font-semibold text-slate-800 truncate mb-1" title={image.filename}>
            {image.filename}
          </p>
          <div className="flex flex-wrap gap-1 text-xs text-slate-500">
            {image.item_type && (
              <span className="bg-slate-100 px-2 py-0.5 rounded">
                {image.item_type}
              </span>
            )}
            {image.location && (
              <span className="bg-slate-100 px-2 py-0.5 rounded">
                {image.location}
              </span>
            )}
          </div>
          {image.file_size && (
            <p className="text-xs text-slate-400 mt-2">
              {(image.file_size / 1024).toFixed(1)} KB
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Gallery
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {images.length} image{images.length !== 1 ? 's' : ''} total
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'grouped' : 'grid')}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <Folder className="h-4 w-4" />
              {viewMode === 'grid' ? 'Group by Category' : 'Show All'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
          <Filter className="h-4 w-4 text-slate-500 flex-shrink-0" />
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'All'
                ? 'bg-teal-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All ({images.length})
          </button>
          {CATEGORIES.map((category) => {
            const count = categoryCounts[category] || 0;
            if (count === 0) return null;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {category} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {images.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <ImageIcon className="mx-auto h-16 w-16 text-slate-300 mb-3" />
          <p className="text-slate-500 text-lg">
            {selectedCategory === 'All'
              ? 'No images uploaded yet'
              : `No images in ${selectedCategory} category`
            }
          </p>
          <p className="text-slate-400 text-sm mt-1">
            {selectedCategory === 'All'
              ? 'Upload some images to get started'
              : 'Try selecting a different category or upload new images'
            }
          </p>
        </div>
      ) : viewMode === 'grouped' && selectedCategory === 'All' ? (
        <div className="space-y-8">
          {Object.entries(groupedImages).map(([category, categoryImages]) => (
            <div key={category} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-slate-800">{category}</h3>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${getCategoryColor(category as ImageCategory)}`}>
                    {categoryImages.length} image{categoryImages.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <button
                  onClick={async () => {
                    if (!confirm(`Delete all ${categoryImages.length} images in ${category}?`)) return;
                    for (const image of categoryImages) {
                      await deleteImage(image);
                    }
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md transition-colors"
                  title={`Delete all ${category} images`}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete All
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categoryImages.map(renderImageCard)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map(renderImageCard)}
          </div>
        </div>
      )}
    </div>
  );
}
