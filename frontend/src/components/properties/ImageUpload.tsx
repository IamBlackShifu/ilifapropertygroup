'use client';

import { useState, useRef } from 'react';
import { filesAPI } from '@/lib/api/properties';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ images, onImagesChange, maxImages = 10 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    // Check total images limit
    if (images.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Validate files
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    try {
      setUploading(true);
      setUploadProgress('Uploading images...');

      let uploadedUrls: string[] = [];

      if (validFiles.length === 1) {
        // Upload single image
        const response = await filesAPI.uploadPropertyImage(validFiles[0]);
        uploadedUrls = [response.data.imageUrl];
      } else {
        // Upload multiple images
        const response = await filesAPI.uploadPropertyImages(validFiles);
        uploadedUrls = response.data.imageUrls;
      }

      onImagesChange([...images, ...uploadedUrls]);
      setUploadProgress(`${uploadedUrls.length} image(s) uploaded successfully`);
      
      // Clear success message after 2 seconds
      setTimeout(() => setUploadProgress(''), 2000);
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(error.response?.data?.message || 'Failed to upload images');
      setUploadProgress('');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = async (imageUrl: string) => {
    if (!confirm('Remove this image?')) return;

    try {
      await filesAPI.deleteFile(imageUrl);
      onImagesChange(images.filter(img => img !== imageUrl));
    } catch (error) {
      console.error('Delete error:', error);
      // Still remove from UI even if server delete fails
      onImagesChange(images.filter(img => img !== imageUrl));
    }
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className={`inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg cursor-pointer hover:bg-primary-700 ${
            uploading || images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Uploading...
            </>
          ) : (
            <>
              📸 Upload Images
            </>
          )}
        </label>
        <p className="text-sm text-gray-600 mt-2">
          {images.length}/{maxImages} images • Max 5MB per image • JPG, PNG, WebP
        </p>
        {uploadProgress && (
          <p className="text-sm text-green-600 mt-1">{uploadProgress}</p>
        )}
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <div
              key={imageUrl}
              className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden"
            >
              {/* Image */}
              <img
                src={imageUrl}
                alt={`Property image ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Primary Badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-primary-600 text-white px-2 py-1 text-xs rounded">
                  Primary
                </div>
              )}

              {/* Order Badge */}
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 text-xs rounded">
                {index + 1}
              </div>

              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                {/* Move Left */}
                {index > 0 && (
                  <button
                    onClick={() => handleReorder(index, index - 1)}
                    className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100"
                    title="Move left"
                  >
                    ←
                  </button>
                )}

                {/* Delete */}
                <button
                  onClick={() => handleRemoveImage(imageUrl)}
                  className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                  title="Remove image"
                >
                  🗑️
                </button>

                {/* Move Right */}
                {index < images.length - 1 && (
                  <button
                    onClick={() => handleReorder(index, index + 1)}
                    className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100"
                    title="Move right"
                  >
                    →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-600 mt-2">No images uploaded yet</p>
          <p className="text-gray-500 text-sm">Click the button above to add images</p>
        </div>
      )}
    </div>
  );
}
