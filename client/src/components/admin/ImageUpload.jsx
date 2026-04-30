import React, { useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const ImageUpload = ({ onUploadSuccess, label = "Upload Image" }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const { data } = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (data.success) {
        onUploadSuccess(data.url);
        toast.success('Image uploaded successfully!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload image. Make sure Cloudinary is configured.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-2">
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <div className="flex items-center gap-4">
        <label className={`
          flex items-center justify-center px-4 py-2 rounded-lg border border-dashed border-white/20 
          hover:border-indigo-500 hover:bg-white/5 transition-all cursor-pointer text-sm font-medium
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}>
          <span>{uploading ? '⌛ Uploading...' : '📁 Choose File'}</span>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
            disabled={uploading}
          />
        </label>
        <span className="text-xs text-gray-500">Max size 5MB</span>
      </div>
    </div>
  );
};

export default ImageUpload;
