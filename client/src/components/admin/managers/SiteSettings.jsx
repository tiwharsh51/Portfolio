import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';
import { toast } from 'react-toastify';
import ImageUpload from '../ImageUpload';

const SiteSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    siteTitle: '',
    faviconUrl: '',
    primaryColor: '#6366f1',
    accentColor: '#f59e0b',
    metaDescription: '',
    googleMapsApiKey: '',
    maintenanceMode: false,
    contactFormEnabled: true,
    footerText: '',
    copyrightName: '',
    phoneNumber: '',
    linkedinUrl: '',
    githubUrl: '',
    youtubeChannelName: '',
    youtubeChannelUrl: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/sitemeta');
      if (data.data) {
        setFormData(data.data);
      }
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      return toast.warning('Please fill both password fields');
    }
    setSaving(true);
    try {
      await api.put('/auth/update-password', passwordData);
      toast.success('Admin password updated successfully');
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/sitemeta', formData);
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-indigo-500 animate-pulse">Loading System Settings...</div>;

  return (
    <div className="max-w-6xl pb-20">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-white tracking-tight">System Settings</h2>
        <p className="text-gray-400 mt-1">Configure global site parameters and security credentials.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-8">
            <div className="glassmorphism p-8 rounded-3xl border border-white/5 shadow-2xl space-y-6">
              <h3 className="text-lg font-bold text-indigo-400 border-b border-white/10 pb-4 mb-2 flex items-center gap-2">
                <span>🌐</span> Global Meta
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Website Title</label>
                <input 
                  type="text" 
                  name="siteTitle" 
                  value={formData.siteTitle} 
                  onChange={handleChange} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all text-white font-bold" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Meta Description (SEO)</label>
                <textarea 
                  name="metaDescription" 
                  value={formData.metaDescription} 
                  onChange={handleChange} 
                  rows="4" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all text-sm leading-relaxed"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Favicon / Site Icon</label>
                <div className="flex items-center gap-6 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="w-16 h-16 rounded-xl bg-black/40 flex items-center justify-center overflow-hidden border border-white/10 shrink-0 shadow-inner">
                    {formData.faviconUrl ? <img src={formData.faviconUrl} className="w-full h-full object-contain" alt="Favicon" /> : <span className="text-3xl">🌍</span>}
                  </div>
                  <div className="flex-1">
                    <ImageUpload 
                      label="Replace Icon" 
                      onUploadSuccess={(url) => setFormData(prev => ({...prev, faviconUrl: url}))} 
                    />
                  </div>
                </div>
                <input 
                  type="text" 
                  name="faviconUrl" 
                  value={formData.faviconUrl} 
                  onChange={handleChange} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mt-4 outline-none focus:border-indigo-500 transition-all text-[10px] font-mono text-gray-500" 
                  placeholder="Manual URL entry..."
                />
              </div>
            </div>

            <div className="glassmorphism p-8 rounded-3xl border border-white/5 shadow-2xl space-y-6">
              <h3 className="text-lg font-bold text-gray-300 border-b border-white/10 pb-4 mb-2 flex items-center gap-2">
                <span>📝</span> Footer Branding
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Footer Tagline</label>
                  <input 
                    type="text" 
                    name="footerText" 
                    value={formData.footerText} 
                    onChange={handleChange} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Copyright Holder</label>
                  <input 
                    type="text" 
                    name="copyrightName" 
                    value={formData.copyrightName} 
                    onChange={handleChange} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all" 
                  />
                </div>
              </div>
            </div>

            <div className="glassmorphism p-8 rounded-3xl border border-white/5 shadow-2xl space-y-6">
              <h3 className="text-lg font-bold text-emerald-400 border-b border-white/10 pb-4 mb-2 flex items-center gap-2">
                <span>📱</span> Social Connectivity
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">WhatsApp Number</label>
                  <input 
                    type="text" 
                    name="phoneNumber" 
                    value={formData.phoneNumber} 
                    onChange={handleChange} 
                    placeholder="e.g. 919876543210"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 transition-all font-mono" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">LinkedIn URL</label>
                  <input 
                    type="text" 
                    name="linkedinUrl" 
                    value={formData.linkedinUrl} 
                    onChange={handleChange} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 transition-all font-mono" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">GitHub URL</label>
                  <input 
                    type="text" 
                    name="githubUrl" 
                    value={formData.githubUrl} 
                    onChange={handleChange} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 transition-all font-mono" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">YouTube Channel Name</label>
                  <input 
                    type="text" 
                    name="youtubeChannelName" 
                    value={formData.youtubeChannelName} 
                    onChange={handleChange} 
                    placeholder="e.g. Code Mastery"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">YouTube Channel URL</label>
                  <input 
                    type="text" 
                    name="youtubeChannelUrl" 
                    value={formData.youtubeChannelUrl} 
                    onChange={handleChange} 
                    placeholder="https://youtube.com/@..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 transition-all font-mono" 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <div className="glassmorphism p-8 rounded-3xl border border-white/5 shadow-2xl space-y-6">
              <h3 className="text-lg font-bold text-amber-400 border-b border-white/10 pb-4 mb-2 flex items-center gap-2">
                <span>🎨</span> Aesthetics & API
              </h3>
              <div className="flex gap-6">
                <div className="flex-1">
                  <label className="block text-[10px] uppercase font-black text-gray-500 mb-2 tracking-widest">Primary Color</label>
                  <div className="flex items-center gap-3">
                    <input type="color" name="primaryColor" value={formData.primaryColor} onChange={handleChange} className="w-12 h-12 bg-transparent rounded-xl cursor-pointer border-none p-0 overflow-hidden" />
                    <code className="text-xs text-gray-400 uppercase">{formData.primaryColor}</code>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] uppercase font-black text-gray-500 mb-2 tracking-widest">Accent Color</label>
                  <div className="flex items-center gap-3">
                    <input type="color" name="accentColor" value={formData.accentColor} onChange={handleChange} className="w-12 h-12 bg-transparent rounded-xl cursor-pointer border-none p-0 overflow-hidden" />
                    <code className="text-xs text-gray-400 uppercase">{formData.accentColor}</code>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Google Maps API Key</label>
                <input 
                  type="password" 
                  name="googleMapsApiKey" 
                  value={formData.googleMapsApiKey} 
                  onChange={handleChange} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-amber-500 transition-all font-mono" 
                  placeholder="AIzaSy..."
                />
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🛠️</span>
                    <div>
                      <p className="text-sm font-bold text-white">Maintenance Mode</p>
                      <p className="text-[10px] text-gray-500">Lock the site for visitors</p>
                    </div>
                  </div>
                  <input type="checkbox" id="maintenanceMode" name="maintenanceMode" checked={formData.maintenanceMode} onChange={handleChange} className="w-6 h-6 accent-amber-500 cursor-pointer" />
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📧</span>
                    <div>
                      <p className="text-sm font-bold text-white">Contact Form</p>
                      <p className="text-[10px] text-gray-500">Accept messages from users</p>
                    </div>
                  </div>
                  <input type="checkbox" id="contactFormEnabled" name="contactFormEnabled" checked={formData.contactFormEnabled} onChange={handleChange} className="w-6 h-6 accent-emerald-500 cursor-pointer" />
                </div>
              </div>
            </div>

            <div className="glassmorphism p-8 rounded-3xl border border-white/5 shadow-2xl space-y-6">
              <h3 className="text-lg font-bold text-red-400 border-b border-white/10 pb-4 mb-2 flex items-center gap-2">
                <span>🔐</span> Access Security
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Current Password</label>
                  <input 
                    type="password" 
                    value={passwordData.currentPassword} 
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-red-500 transition-all" 
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
                  <input 
                    type="password" 
                    value={passwordData.newPassword} 
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all" 
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <button 
                type="button" 
                onClick={handlePasswordUpdate}
                disabled={saving}
                className="w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border border-red-500/20 active:scale-[0.98]"
              >
                Reset Admin Credentials
              </button>
            </div>
          </div>
        </div>
        
        <div className="sticky bottom-8 flex justify-center pt-10 pb-10 z-10 pointer-events-none">
          <button 
            type="submit" 
            disabled={saving} 
            className="pointer-events-auto bg-indigo-600 hover:bg-indigo-700 text-white px-16 py-5 rounded-3xl font-black uppercase tracking-[0.2em] disabled:opacity-50 transition-all shadow-2xl shadow-indigo-500/40 active:scale-95"
          >
            {saving ? 'Updating System...' : 'Synchronize Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SiteSettings;
