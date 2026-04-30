import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';
import { toast } from 'react-toastify';
import ImageUpload from '../ImageUpload';

const BannerManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    autoSlideInterval: 5,
    slides: []
  });

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      const { data } = await api.get('/hero');
      if (data.data) setFormData(data.data);
    } catch (error) {
      toast.error('Failed to load hero config');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlide = () => {
    setFormData(prev => ({
      ...prev,
      slides: [...prev.slides, { caption: '', subCaption: '', ctaText: '', ctaLink: '', imageUrl: '', order: prev.slides.length }]
    }));
  };

  const handleSlideChange = (index, field, value) => {
    setFormData(prev => {
      const newSlides = [...prev.slides];
      newSlides[index] = { ...newSlides[index], [field]: value };
      return { ...prev, slides: newSlides };
    });
  };

  const handleRemoveSlide = (index) => {
    const newSlides = formData.slides.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, slides: newSlides }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/hero', formData);
      toast.success('Hero banner updated');
    } catch (error) {
      toast.error('Failed to update hero');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-indigo-500 animate-pulse">Loading Hero Configuration...</div>;

  return (
    <div className="max-w-5xl pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Hero Banner</h2>
          <p className="text-gray-400 mt-1">Manage the visual sliders on your homepage.</p>
        </div>
        <button type="submit" onClick={handleSubmit} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/20">
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      <div className="glassmorphism p-6 rounded-2xl mb-10 flex items-center gap-6">
        <div className="bg-indigo-500/10 p-4 rounded-xl">
          <span className="text-2xl">⏱️</span>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Auto Slide Interval (Seconds)</label>
          <input 
            type="number" 
            value={formData.autoSlideInterval} 
            onChange={(e) => setFormData({...formData, autoSlideInterval: e.target.value})} 
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none w-32 focus:border-indigo-500 transition-colors" 
          />
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <h3 className="text-xl font-semibold text-white">Slider Content</h3>
          <button type="button" onClick={handleAddSlide} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg text-sm font-medium transition">
            <span>➕</span> Add New Slide
          </button>
        </div>

        {formData.slides.length === 0 && (
          <div className="text-center py-20 glassmorphism rounded-2xl border-dashed border-white/10">
            <p className="text-gray-500">No slides added yet. Click "Add New Slide" to begin.</p>
          </div>
        )}

        {formData.slides.map((slide, index) => (
          <div key={index} className="glassmorphism p-8 rounded-2xl relative group border border-white/5 hover:border-white/10 transition-all">
            <button 
              type="button" 
              onClick={() => handleRemoveSlide(index)} 
              className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
            >
              ✕
            </button>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 space-y-4">
                <div className="aspect-video rounded-xl overflow-hidden bg-black/40 border border-white/5 relative">
                  {slide.imageUrl ? (
                    <img src={slide.imageUrl} alt="Slide Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 text-sm p-4 text-center">
                      <span>Preview will appear here</span>
                    </div>
                  )}
                </div>
                <ImageUpload 
                  label="Change Slide Background" 
                  onUploadSuccess={(url) => handleSlideChange(index, 'imageUrl', url)} 
                />
                <div className="mt-4">
                  <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider font-bold">Or enter Image URL</label>
                  <input 
                    type="text" 
                    value={slide.imageUrl} 
                    onChange={(e) => handleSlideChange(index, 'imageUrl', e.target.value)} 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-indigo-500" 
                    placeholder="https://unsplash.com/..." 
                  />
                </div>
              </div>

              <div className="lg:col-span-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Headline Caption</label>
                    <input 
                      type="text" 
                      value={slide.caption} 
                      onChange={(e) => handleSlideChange(index, 'caption', e.target.value)} 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all text-lg font-bold" 
                      placeholder="e.g. Elevating Digital Experiences" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Sub-headline / Description</label>
                    <textarea 
                      value={slide.subCaption} 
                      onChange={(e) => handleSlideChange(index, 'subCaption', e.target.value)} 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all h-24 resize-none" 
                      placeholder="e.g. Specialized in building modern web applications with 3D visuals."
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Button Text</label>
                    <input 
                      type="text" 
                      value={slide.ctaText} 
                      onChange={(e) => handleSlideChange(index, 'ctaText', e.target.value)} 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all" 
                      placeholder="View Work" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Button Link</label>
                    <input 
                      type="text" 
                      value={slide.ctaLink} 
                      onChange={(e) => handleSlideChange(index, 'ctaLink', e.target.value)} 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all font-mono" 
                      placeholder="#projects" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BannerManager;
