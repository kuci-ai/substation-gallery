import { useState, useEffect } from 'react';

// Valid prefix_shortform combinations based on naming convention
const VALID_COMBINATIONS = {
  'gen_logo': 'General',
  'sc_substationoverview': 'Substation Condition',
  'sc_signboard': 'Substation Condition',
  'sc_switchgear': 'Substation Condition',
  'sc_switchgearnameplate': 'Substation Condition',
  'sc_transformer': 'Substation Condition',
  'sc_transformernameplate': 'Substation Condition',
  'sc_lvdb': 'Substation Condition',
  'sc_lvdbnameplate': 'Substation Condition',
  'sc_battery': 'Substation Condition',
  'sc_batterynameplate': 'Substation Condition',
  'sc_fireext': 'Substation Condition',
  'sc_efi': 'Substation Condition',
  'sc_sf6': 'Substation Condition',
  'stk_normal': 'Sticker',
  'stk_defect': 'Sticker',
  'vi_switchgear': 'Visual Defect',
  'vi_cablepilc': 'Visual Defect',
  'vi_ptx': 'Visual Defect',
  'vi_ltx': 'Visual Defect',
  'vi_lvdb': 'Visual Defect',
  'vi_linkbox': 'Visual Defect',
  'vi_efi': 'Visual Defect',
  'vi_earthing': 'Visual Defect',
  'vi_signboard': 'Visual Defect',
  'vi_fireext': 'Visual Defect',
  'vi_batterycharger': 'Visual Defect',
  'vi_rubbermat': 'Visual Defect',
  'vi_trenching': 'Visual Defect',
  'vi_louver': 'Visual Defect',
  'vi_exhaustfan': 'Visual Defect',
  'vi_lighting': 'Visual Defect',
  'vi_substation': 'Visual Defect',
  'vi_aircond': 'Visual Defect',
  'vi_hpole': 'Visual Defect',
  'vi_firefighting': 'Visual Defect',
  'mi_pmsticker': 'Maintenance Info',
  'mi_rmsticker': 'Maintenance Info',
  'mi_oltt': 'Maintenance Info',
  'ts_cbm': 'Test Sheet',
  'ts_vitest': 'Test Sheet',
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  const isValidNamingFormat = (filename: string): boolean => {
    const filenameLower = filename.toLowerCase();
    const nameWithoutExt = filenameLower.replace(/\.(jpg|jpeg|png|tif|tiff|pdf)$/i, '');
    const parts = nameWithoutExt.split(/[_\s]+/); // Split on underscore OR whitespace
    
    if (parts.length < 2) return false;
    
    const prefix = parts[0].trim();
    const shortform = parts[1].trim();
    const prefixShortformCombo = `${prefix}_${shortform}`;
    
    return VALID_COMBINATIONS.hasOwnProperty(prefixShortformCombo);
  };

  const parseImageFilename = (filename: string) => {
    const filenameLower = filename.toLowerCase();
    const nameWithoutExt = filenameLower.replace(/\.(jpg|jpeg|png|tif|tiff|pdf)$/i, '');
    const parts = nameWithoutExt.split(/[_\s]+/); // Split on underscore OR whitespace

    const prefix = parts[0]?.trim() || '';
    const itemType = parts[1]?.trim() || '';
    const prefixItemCombo = `${prefix}_${itemType}`;
    const isValidFormat = VALID_COMBINATIONS.hasOwnProperty(prefixItemCombo);
    const category = isValidFormat ? VALID_COMBINATIONS[prefixItemCombo as keyof typeof VALID_COMBINATIONS] : 'Uncategorized';

    return {
      category,
      itemType,
      location: parts[2]?.trim() || '',
      dateTaken: parts[3]?.trim() || '',
      sequence: parts[4]?.trim() || '',
      prefix,
    };
  };

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
        invalidFiles.push(`${file.name} - Invalid naming format (must follow prefix_shortform)`);
        return;
      }
      
      validFiles.push(file);
    });
    
    if (invalidFiles.length > 0) {
      alert(`The following files were rejected:\n\n${invalidFiles.join('\n')}\n\nValid format examples:\n- vi_switchgear_image.jpg\n- sc_transformer_location_date.jpg\n- ts_cbm_test.pdf`);
    }
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    
    try {
      const newImages = selectedFiles.map((file, index) => {
        const parsedInfo = parseImageFilename(file.name);
        
        // Create a preview URL for the image
        const previewUrl = URL.createObjectURL(file);
        
        return {
          id: `img-${Date.now()}-${index}`,
          filename: file.name,
          fileSize: file.size,
          mimeType: file.type,
          category: parsedInfo.category,
          itemType: parsedInfo.itemType,
          location: parsedInfo.location,
          dateTaken: parsedInfo.dateTaken,
          sequence: parsedInfo.sequence,
          previewUrl: previewUrl,
          uploadedAt: new Date().toISOString(),
        };
      });

      // Store in localStorage
      const existingImages = JSON.parse(localStorage.getItem('uploaded_images') || '[]');
      const updatedImages = [...existingImages, ...newImages];
      localStorage.setItem('uploaded_images', JSON.stringify(updatedImages));
      
      setUploadedImages(updatedImages);
      setSelectedFiles([]);
      
      alert(`Successfully uploaded ${newImages.length} file(s)!`);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Load existing images on component mount
  useEffect(() => {
    const existingImages = JSON.parse(localStorage.getItem('uploaded_images') || '[]');
    setUploadedImages(existingImages);
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo/Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-600 rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Substation Gallery</h1>
            <p className="text-slate-300">Professional Image Management System</p>
          </div>

          {/* Login Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-white mb-2">Welcome Back</h2>
              <p className="text-slate-300">Sign in to access your image gallery</p>
            </div>
            
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input 
                    type="password" 
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded" />
                  <span className="ml-2 text-sm text-slate-300">Remember me</span>
                </label>
                <a href="#" className="text-sm text-teal-400 hover:text-teal-300 transition-colors">
                  Forgot password?
                </a>
              </div>
              
              <button 
                onClick={() => setIsLoggedIn(true)}
                className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-lg"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm">
                Don't have an account? 
                <a href="#" className="text-teal-400 hover:text-teal-300 ml-1 transition-colors">
                  Sign up here
                </a>
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="text-slate-400">
              <div className="text-2xl mb-2">📁</div>
              <p className="text-sm">Organized Gallery</p>
            </div>
            <div className="text-slate-400">
              <div className="text-2xl mb-2">🔒</div>
              <p className="text-sm">Secure Storage</p>
            </div>
            <div className="text-slate-400">
              <div className="text-2xl mb-2">⚡</div>
              <p className="text-sm">Fast Upload</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 shadow-xl border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-teal-600 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Substation Gallery</h1>
                <p className="text-sm text-slate-300">Professional Image Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-slate-300">Welcome back</p>
                <p className="text-xs text-slate-400">admin@substation.com</p>
              </div>
              <button
                onClick={() => setIsLoggedIn(false)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Upload Images</h2>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
            <p className="text-slate-600 mb-2">Click to select files</p>
            <p className="text-sm text-slate-500 mb-4">Images (jpg, png, tif) or Test Sheets (pdf only)</p>
            <p className="text-xs text-slate-400 mb-2">Filename format: prefix_shortform_[location]_[date]_[sequence].ext</p>
            <p className="text-xs text-slate-400 mb-4">Examples: vi_switchgear_image.jpg, sc_transformer_location_date.jpg</p>
            
            <input
              type="file"
              accept="image/*,application/pdf"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="file-input"
            />
            <label
              htmlFor="file-input"
              className="inline-block bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-6 py-3 rounded-lg font-medium cursor-pointer transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 shadow-lg"
            >
              Select Files
            </label>
            
            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold text-slate-700 mb-2">Selected Files ({selectedFiles.length})</h3>
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-slate-700">{file.name}</p>
                        <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <button
                        onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={handleUpload}
                  disabled={uploading}
                  className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} File${selectedFiles.length > 1 ? 's' : ''}`}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Gallery ({uploadedImages.length})</h2>
          
          {uploadedImages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500">No images uploaded yet</p>
              <p className="text-slate-400 text-sm mt-1">Upload some images to get started</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(
                uploadedImages.reduce((acc, image) => {
                  const category = image.category || 'Uncategorized';
                  if (!acc[category]) {
                    acc[category] = [];
                  }
                  acc[category].push(image);
                  return acc;
                }, {} as Record<string, any[]>)
              ).map(([category, images]) => (
                <div key={category} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-slate-800">{category}</h3>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        category === 'General' ? 'bg-blue-100 text-blue-800' :
                        category === 'Substation Condition' ? 'bg-green-100 text-green-800' :
                        category === 'Sticker' ? 'bg-yellow-100 text-yellow-800' :
                        category === 'Visual Defect' ? 'bg-red-100 text-red-800' :
                        category === 'Maintenance Info' ? 'bg-purple-100 text-purple-800' :
                        category === 'Test Sheet' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {images.length} image{images.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        if (!confirm(`Delete all ${images.length} images in ${category}?`)) return;
                        const updatedImages = uploadedImages.filter(img => img.category !== category);
                        setUploadedImages(updatedImages);
                        localStorage.setItem('uploaded_images', JSON.stringify(updatedImages));
                      }}
                      className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                    >
                      Delete All
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image) => (
                      <div key={image.id} className="bg-slate-50 rounded-lg overflow-hidden border border-slate-200 hover:shadow-md transition-shadow">
                        <div className="aspect-square relative overflow-hidden bg-slate-100">
                          {image.mimeType === 'application/pdf' ? (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-orange-50">
                              <div className="text-orange-600 text-4xl mb-2">📄</div>
                              <span className="text-sm font-medium text-orange-800">PDF Document</span>
                            </div>
                          ) : (
                            <img
                              src={image.previewUrl}
                              alt={image.filename}
                              className="w-full h-full object-cover"
                            />
                          )}
                          <button
                            onClick={() => {
                              const updatedImages = uploadedImages.filter(img => img.id !== image.id);
                              setUploadedImages(updatedImages);
                              localStorage.setItem('uploaded_images', JSON.stringify(updatedImages));
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-md opacity-0 hover:opacity-100 transition-opacity hover:bg-red-600"
                            title="Delete image"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-semibold text-slate-800 truncate mb-1" title={image.filename}>
                            {image.filename}
                          </p>
                          <div className="flex flex-wrap gap-1 text-xs text-slate-500">
                            {image.itemType && (
                              <span className="bg-slate-100 px-2 py-0.5 rounded">
                                {image.itemType}
                              </span>
                            )}
                            {image.location && (
                              <span className="bg-slate-100 px-2 py-0.5 rounded">
                                {image.location}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-2">
                            {(image.fileSize / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
