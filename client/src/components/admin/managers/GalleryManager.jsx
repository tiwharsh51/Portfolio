import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';
import { toast } from 'react-toastify';
import ImageUpload from '../ImageUpload';

const GalleryManager = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ imageUrl: '', caption: '', category: 'General', order: 0 });

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const { data } = await api.get('/gallery');
      setPhotos(data.data);
    } catch (error) {
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (photo) => {
    setEditingId(photo._id);
    setFormData({
      imageUrl: photo.imageUrl,
      caption: photo.caption || '',
      category: photo.category || 'General',
      order: photo.order || 0
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearForm = () => {
    setEditingId(null);
    setFormData({ imageUrl: '', caption: '', category: 'General', order: photos.length + 1 });
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { data } = await api.put(`/gallery/${editingId}`, formData);
        setPhotos(photos.map(p => p._id === editingId ? data.data : p).sort((a, b) => a.order - b.order));
        toast.success('Gallery item updated');
      } else {
        const { data } = await api.post('/gallery', formData);
        setPhotos([...photos, data.data].sort((a, b) => a.order - b.order));
        toast.success('Photo added to gallery');
      }
      clearForm();
    } catch (error) {
      toast.error(editingId ? 'Failed to update photo' : 'Failed to add photo');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this photo?')) return;
    try {
      await api.delete(`/gallery/${id}`);
      setPhotos(photos.filter(p => p._id !== id));
      toast.success('Photo removed');
    } catch (error) {
      toast.error('Failed to remove photo');
    }
  };

  if (loading) return <div className="p-10 text-indigo-500 animate-pulse">Loading gallery...</div>;

  return (
    <div className="max-w-6xl pb-20">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-white">Gallery & Portfolio Photos</h2>
        <p className="text-gray-400 mt-1">Showcase your workspace, team, and professional moments.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form */}
        <div className="lg:col-span-4">
          <form onSubmit={handleSubmit} className="glassmorphism p-8 rounded-2xl space-y-6 sticky top-24 border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-2">
              <h3 className={`text-xl font-bold ${editingId ? 'text-amber-400' : 'text-indigo-400'}`}>
                {editingId ? 'Edit Photo' : 'Upload Photo'}
              </h3>
              {editingId && (
                <button 
                  type="button" 
                  onClick={clearForm}
                  className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                >
                  Cancel Edit
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="aspect-video rounded-xl overflow-hidden bg-black/40 border border-white/5 mb-4">
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">Preview</div>
                )}
              </div>

              <ImageUpload 
                label="Choose Photo" 
                onUploadSuccess={(url) => setFormData(prev => ({...prev, imageUrl: url}))} 
              />

              <div>
                <label className="block text-xs text-gray-500 mb-1 uppercase font-bold">Or enter Image URL</label>
                <input 
                  type="text" 
                  name="imageUrl" 
                  value={formData.imageUrl} 
                  onChange={handleChange} 
                  required 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Caption</label>
                <input 
                  type="text" 
                  name="caption" 
                  value={formData.caption} 
                  onChange={handleChange} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all" 
                  placeholder="e.g. Working on the new project"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange} 
                  className="w-full bg-adminMain border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all cursor-pointer appearance-none"
                >
                  <option value="General">General</option>
                  <option value="Workspace">Workspace</option>
                  <option value="Team">Team</option>
                  <option value="Events">Events</option>
                </select>
              </div>
            </div>

            <button type="submit" className={`w-full ${editingId ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'} text-white py-4 rounded-xl font-bold transition-all shadow-xl`}>
              {editingId ? 'Save Changes' : 'Add to Gallery'}
            </button>
          </form>
        </div>

        {/* Grid */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {photos.map(photo => (
              <div key={photo._id} className="relative group aspect-square rounded-2xl overflow-hidden glassmorphism border border-white/5 shadow-lg">
                <img src={photo.imageUrl} alt={photo.caption} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
                  <p className="text-sm font-bold text-white truncate">{photo.caption}</p>
                  <p className="text-xs text-indigo-400 font-medium mt-1">{photo.category}</p>
                  <div className="flex gap-2 mt-4">
                    <button 
                      onClick={() => handleEdit(photo)} 
                      className="flex-1 bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-white text-[10px] uppercase font-bold py-2 rounded-lg transition-all border border-amber-500/20"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(photo._id)} 
                      className="flex-1 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white text-[10px] uppercase font-bold py-2 rounded-lg transition-all border border-red-500/20"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {photos.length === 0 && (
            <div className="text-center py-32 glassmorphism rounded-3xl border-dashed border-white/10 text-gray-500">
              No photos in your gallery yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryManager;
