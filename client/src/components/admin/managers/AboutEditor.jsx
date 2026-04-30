import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';
import { toast } from 'react-toastify';
import ImageUpload from '../ImageUpload';

const AboutEditor = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    bio: '',
    profilePhotoUrl: '',
    resumeUrl: '',
    yearsOfExperience: 0,
    projectsCompleted: 0,
    happyClients: 0
  });

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const { data } = await api.get('/about');
      if (data.data) setFormData(data.data);
    } catch (error) {
      toast.error('Failed to load about data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/about', formData);
      toast.success('About section saved successfully!');
    } catch (error) {
      toast.error('Failed to save about section');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-indigo-500 animate-pulse">Loading About Editor...</div>;

  return (
    <div className="max-w-4xl pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">About Me</h2>
          <p className="text-gray-400 mt-1">Personal branding and professional summary.</p>
        </div>
        <button 
          type="submit" 
          onClick={handleSubmit} 
          disabled={saving} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/20"
        >
          {saving ? 'Saving...' : 'Update Profile'}
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="glassmorphism p-6 rounded-3xl border border-white/5 text-center">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-2 border-indigo-500/30 animate-pulse"></div>
                <div className="absolute inset-2 rounded-full overflow-hidden border border-white/10 flex items-center justify-center">
                  {formData.profilePhotoUrl ? (
                    <img src={formData.profilePhotoUrl} alt="Profile" className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full bg-black/40 flex items-center justify-center text-3xl grayscale">👤</div>
                  )}
                </div>
              </div>
              <ImageUpload 
                label="Change Profile Photo" 
                onUploadSuccess={(url) => setFormData(prev => ({...prev, profilePhotoUrl: url}))} 
              />
            </div>

            <div className="glassmorphism p-6 rounded-3xl border border-white/5 space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-white/5 pb-2">Documents</h3>
              <ImageUpload 
                label="Upload New Resume (PDF/Image)" 
                onUploadSuccess={(url) => setFormData(prev => ({...prev, resumeUrl: url}))} 
              />
              <div className="pt-2">
                <label className="block text-[10px] text-gray-500 mb-1 uppercase font-bold">Resume Link</label>
                <input 
                  type="text" 
                  name="resumeUrl" 
                  value={formData.resumeUrl || ''} 
                  onChange={handleChange} 
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-indigo-500 font-mono" 
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <div className="glassmorphism p-8 rounded-3xl border border-white/5 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name || ''} 
                    onChange={handleChange} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all text-white font-bold" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Professional Tagline</label>
                  <input 
                    type="text" 
                    name="tagline" 
                    value={formData.tagline || ''} 
                    onChange={handleChange} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all" 
                    placeholder="e.g. Creative Full-Stack Developer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Detailed Biography (HTML support)</label>
                <textarea 
                  name="bio" 
                  value={formData.bio || ''} 
                  onChange={handleChange} 
                  className="w-full h-80 p-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-indigo-500 text-gray-200 font-mono text-sm leading-relaxed transition-all"
                  placeholder="<p>Describe your journey, skills, and passion...</p>"
                />
              </div>
            </div>

            <div className="glassmorphism p-8 rounded-3xl border border-white/5">
              <h3 className="text-lg font-bold text-indigo-400 mb-6 flex items-center gap-2">
                <span>📈</span> Performance Counters
              </h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                  <label className="block text-[10px] text-gray-500 mb-2 uppercase font-black">Experience</label>
                  <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience || 0} onChange={handleChange} className="w-full bg-transparent text-center text-2xl font-black text-white outline-none" />
                  <span className="text-[10px] text-indigo-400">Years</span>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                  <label className="block text-[10px] text-gray-500 mb-2 uppercase font-black">Projects</label>
                  <input type="number" name="projectsCompleted" value={formData.projectsCompleted || 0} onChange={handleChange} className="w-full bg-transparent text-center text-2xl font-black text-white outline-none" />
                  <span className="text-[10px] text-amber-400">Completed</span>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                  <label className="block text-[10px] text-gray-500 mb-2 uppercase font-black">Clients</label>
                  <input type="number" name="happyClients" value={formData.happyClients || 0} onChange={handleChange} className="w-full bg-transparent text-center text-2xl font-black text-white outline-none" />
                  <span className="text-[10px] text-emerald-400">Happy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AboutEditor;
