import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';
import { toast } from 'react-toastify';

const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', role: '', company: '', comment: '', rating: 5, avatarUrl: '' });

  const [headerData, setHeaderData] = useState({ 
    testimonialsTitle: '', 
    testimonialsSubtitle: '',
    enablePublicReviews: false 
  });
  const [headerLoading, setHeaderLoading] = useState(false);

  useEffect(() => {
    fetchTestimonials();
    fetchHeader();
  }, []);

  const fetchHeader = async () => {
    try {
      const { data } = await api.get('/sitemeta');
      if (data.success) {
        setHeaderData({
          testimonialsTitle: data.data.testimonialsTitle || 'Trusted Voices.',
          testimonialsSubtitle: data.data.testimonialsSubtitle || '',
          enablePublicReviews: data.data.enablePublicReviews || false
        });
      }
    } catch (error) { console.error("Failed to load header meta"); }
  };

  const handleHeaderSubmit = async () => {
    setHeaderLoading(true);
    try {
      await api.put('/sitemeta', headerData);
      toast.success('System configuration updated');
    } catch (error) {
      toast.error('Sync failed');
    } finally {
      setHeaderLoading(false);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const { data } = await api.get('/testimonials');
      setTestimonials(data.data);
    } catch (error) {
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (t) => {
    setEditingId(t._id);
    setFormData({
      name: t.name,
      role: t.role || '',
      company: t.company || '',
      comment: t.comment,
      rating: t.rating || 5,
      avatarUrl: t.avatarUrl || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearForm = () => {
    setEditingId(null);
    setFormData({ name: '', role: '', company: '', comment: '', rating: 5, avatarUrl: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'rating' ? parseInt(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { data } = await api.put(`/testimonials/${editingId}`, formData);
        setTestimonials(testimonials.map(t => t._id === editingId ? data.data : t));
        toast.success('Testimonial updated');
      } else {
        const { data } = await api.post('/testimonials', formData);
        setTestimonials([...testimonials, data.data]);
        toast.success('Testimonial added');
      }
      clearForm();
    } catch (error) {
      toast.error(editingId ? 'Failed to update testimonial' : 'Failed to add testimonial');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      await api.delete(`/testimonials/${id}`);
      setTestimonials(testimonials.filter(t => t._id !== id));
      toast.success('Testimonial removed');
    } catch (error) {
      toast.error('Failed to remove testimonial');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl space-y-10">
      <header className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-white tracking-tight italic">Testimonials <span className="text-primary">Manager</span></h2>
      </header>

      {/* Section Header Configuration */}
      <div className="glass p-8 rounded border-white/5 bg-white/[0.02]">
        <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6">Section Header Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-dim uppercase tracking-widest mb-2">Section Title</label>
              <input 
                type="text" 
                value={headerData.testimonialsTitle} 
                onChange={(e) => setHeaderData({...headerData, testimonialsTitle: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 outline-none text-white focus:border-primary/50 transition-colors"
                placeholder="Trusted Voices."
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-dim uppercase tracking-widest mb-2">Section Subtitle</label>
              <textarea 
                value={headerData.testimonialsSubtitle} 
                onChange={(e) => setHeaderData({...headerData, testimonialsSubtitle: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 outline-none text-white focus:border-primary/50 transition-colors h-20 resize-none"
                placeholder="What clients say..."
              />
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded border border-white/5">
               <input 
                 type="checkbox" 
                 id="enableReviews"
                 checked={headerData.enablePublicReviews}
                 onChange={(e) => setHeaderData({...headerData, enablePublicReviews: e.target.checked})}
                 className="w-4 h-4 accent-primary"
               />
               <label htmlFor="enableReviews" className="text-[10px] font-black text-white uppercase tracking-widest cursor-pointer">Allow Public Review Submissions</label>
            </div>
          </div>
          <div className="pb-1">
             <button 
              onClick={handleHeaderSubmit}
              disabled={headerLoading}
              className="bg-primary hover:bg-blue-700 text-[10px] font-black uppercase tracking-widest text-white px-8 py-4 transition-all disabled:opacity-50"
             >
               {headerLoading ? 'Syncing...' : 'Update Header Artifact'}
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="glass p-6 rounded border-white/5 bg-white/[0.02] space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-2">
              <h3 className={`text-lg font-semibold ${editingId ? 'text-amber-400' : 'text-yellow-400'}`}>
                {editingId ? 'Edit Review' : 'Add Review'}
              </h3>
              {editingId && (
                <button 
                  type="button" 
                  onClick={clearForm}
                  className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
            <div>
              <label className="block text-xs mb-1 font-bold text-dim uppercase tracking-tighter">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 outline-none text-white" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs mb-1 font-bold text-dim uppercase tracking-tighter">Role</label>
                <input type="text" name="role" value={formData.role} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 outline-none text-white" />
              </div>
              <div>
                <label className="block text-xs mb-1 font-bold text-dim uppercase tracking-tighter">Company</label>
                <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 outline-none text-white" />
              </div>
            </div>
            <div>
              <label className="block text-xs mb-1 font-bold text-dim uppercase tracking-tighter">Comment</label>
              <textarea name="comment" value={formData.comment} onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 outline-none h-24 text-white resize-none"></textarea>
            </div>
            <div>
              <label className="block text-xs mb-1 font-bold text-dim uppercase tracking-tighter">Rating (1-5)</label>
              <input type="number" min="1" max="5" name="rating" value={formData.rating} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 outline-none text-white" />
            </div>
            <div>
              <label className="block text-xs mb-1 font-bold text-dim uppercase tracking-tighter">Photo/Gravatar URL</label>
              <input type="text" name="avatarUrl" value={formData.avatarUrl} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 outline-none text-white" />
            </div>
            <button type="submit" className={`w-full ${editingId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-primary hover:bg-blue-700'} py-4 rounded text-white font-black uppercase tracking-widest text-[10px] transition`}>
              {editingId ? 'Save Changes' : 'Add Testimonial'}
            </button>
          </form>
        </div>
        <div className="lg:col-span-2 space-y-4">
          {testimonials.map(t => (
            <div key={t._id} className="glass p-5 rounded border border-white/5 relative group hover:border-primary/20 transition-all bg-white/[0.01]">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded bg-white/5 flex items-center justify-center text-2xl overflow-hidden border border-white/5">
                  {t.avatarUrl ? <img src={t.avatarUrl} className="w-full h-full object-cover" /> : '👤'}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white">{t.name}</h4>
                        {t.isPublic && <span className="text-[7px] font-black bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1.5 py-0.5 rounded uppercase tracking-[0.2em]">Public Submission</span>}
                      </div>
                      <div className="text-[10px] text-primary font-bold uppercase tracking-widest">{t.role} {t.company && `@ ${t.company}`}</div>
                    </div>
                    <div className="flex text-yellow-500">
                      {'★'.repeat(t.rating)}{'☆'.repeat(5-t.rating)}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mt-2 italic">"{t.comment}"</p>
                </div>
              </div>
               <div className="absolute top-4 right-4 flex gap-2">
                 <button onClick={() => handleEdit(t)} className="text-amber-500 opacity-0 group-hover:opacity-100 transition p-2" title="Edit">✏️</button>
                 <button onClick={() => handleDelete(t._id)} className="text-red-500 opacity-0 group-hover:opacity-100 transition p-2" title="Delete">🗑️</button>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsManager;
