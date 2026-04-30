import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';
import { toast } from 'react-toastify';
import ImageUpload from '../ImageUpload';

const NavbarManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    brandName: '',
    logoUrl: '',
    links: [],
    showSocials: true,
    socialLinks: { github: '', linkedin: '', twitter: '', instagram: '', youtube: '' }
  });

  useEffect(() => {
    fetchNavbar();
  }, []);

  const fetchNavbar = async () => {
    try {
      const { data } = await api.get('/navbar');
      if (data.data) setFormData(data.data);
    } catch (error) {
      toast.error('Failed to load navbar config');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('socialLinks.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [field]: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleAddLink = () => {
    setFormData(prev => ({
      ...prev,
      links: [...prev.links, { label: '', href: '', order: prev.links.length }]
    }));
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...formData.links];
    newLinks[index][field] = value;
    setFormData(prev => ({ ...prev, links: newLinks }));
  };

  const handleRemoveLink = (index) => {
    const newLinks = formData.links.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, links: newLinks }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/navbar', formData);
      toast.success('Navbar settings updated!');
    } catch (error) {
      toast.error('Failed to update navbar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-indigo-500 animate-pulse">Loading Navigation Config...</div>;

  return (
    <div className="max-w-5xl pb-20">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Navigation System</h2>
          <p className="text-gray-400 mt-1">Configure your brand presence and global links.</p>
        </div>
        <button 
          type="submit" 
          onClick={handleSubmit} 
          disabled={saving} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest disabled:opacity-50 transition-all shadow-xl shadow-indigo-500/20"
        >
          {saving ? 'Processing...' : 'Apply Global Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Identity Section */}
        <div className="lg:col-span-5 space-y-8">
          <div className="glassmorphism p-8 rounded-3xl border border-white/5 shadow-2xl">
            <h3 className="text-lg font-bold text-indigo-400 mb-6 flex items-center gap-2">
              <span>🆔</span> Brand Identity
            </h3>
            <div className="space-y-6">
              <div className="flex items-center gap-6 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="w-16 h-16 rounded-xl bg-black/40 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                  {formData.logoUrl ? <img src={formData.logoUrl} className="w-full h-full object-contain" alt="Logo" /> : <span className="text-2xl">⚡</span>}
                </div>
                <div className="flex-1">
                  <ImageUpload 
                    label="Upload Brand Logo" 
                    onUploadSuccess={(url) => setFormData({...formData, logoUrl: url})} 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Brand Name / Display Text</label>
                <input 
                  type="text" 
                  name="brandName" 
                  value={formData.brandName} 
                  onChange={handleChange} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all text-xl font-black text-white" 
                  placeholder="e.g. PORTFOLIO"
                />
              </div>
            </div>
          </div>

          <div className="glassmorphism p-8 rounded-3xl border border-white/5 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-indigo-400 flex items-center gap-2">
                <span>🌐</span> Social Presence
              </h3>
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                <input 
                  type="checkbox" 
                  id="showSocials" 
                  name="showSocials" 
                  checked={formData.showSocials} 
                  onChange={handleChange} 
                  className="w-4 h-4 accent-indigo-500"
                />
                <label htmlFor="showSocials" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest cursor-pointer">Visible</label>
              </div>
            </div>
            <div className="space-y-4">
              {Object.keys(formData.socialLinks).map(platform => (
                <div key={platform} className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-xs uppercase font-black">{platform}</span>
                  <input 
                    type="text" 
                    name={`socialLinks.${platform}`} 
                    value={formData.socialLinks[platform]} 
                    onChange={handleChange} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-24 pr-4 py-3 outline-none focus:border-indigo-500 transition-all text-sm font-mono" 
                    placeholder={`${platform} profile link`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="lg:col-span-7">
          <div className="glassmorphism p-8 rounded-3xl border border-white/5 shadow-2xl h-full">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold text-indigo-400 flex items-center gap-2">
                <span>🔗</span> Navigation Links
              </h3>
              <button 
                type="button" 
                onClick={handleAddLink} 
                className="bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border border-indigo-500/20"
              >
                + Add Link
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.links.length === 0 && (
                <div className="text-center py-20 bg-white/5 rounded-2xl border-dashed border-white/10 text-gray-500 italic">
                  No links added to the navbar yet.
                </div>
              )}
              {formData.links.map((link, index) => (
                <div key={index} className="flex gap-4 items-center bg-white/5 p-4 rounded-2xl border border-white/5 group transition-all hover:bg-white/10">
                  <div className="flex-1 space-y-2">
                    <input 
                      type="text" 
                      placeholder="Display Label (e.g. Portfolio)" 
                      value={link.label} 
                      onChange={(e) => handleLinkChange(index, 'label', e.target.value)} 
                      className="w-full bg-transparent border-b border-white/10 px-0 py-1 outline-none focus:border-indigo-500 font-bold text-white transition-all" 
                    />
                    <select 
                      value={link.href} 
                      onChange={(e) => handleLinkChange(index, 'href', e.target.value)} 
                      className="w-full bg-transparent border-none px-0 py-1 outline-none text-xs text-indigo-400 font-mono cursor-pointer" 
                    >
                      <option value="" className="bg-adminBg text-gray-400">Select Section Link...</option>
                      <option value="#projects" className="bg-adminBg">#projects (Featured Work)</option>
                      <option value="#about" className="bg-adminBg">#about (Narrative/Bio)</option>
                      <option value="#skills" className="bg-adminBg">#skills (Technical Arsenal)</option>
                      <option value="#experience" className="bg-adminBg">#experience (Timeline)</option>
                      <option value="#testimonials" className="bg-adminBg">#testimonials (Echoes)</option>
                      <option value="#contact" className="bg-adminBg">#contact (Contact Form)</option>
                      <option value="/" className="bg-adminBg">/ (Home Page)</option>
                      <option value="/admin/login" className="bg-adminBg">/admin/login (System Access)</option>
                    </select>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveLink(index)} 
                    className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:bg-red-500 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarManager;
