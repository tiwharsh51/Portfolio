import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';
import { toast } from 'react-toastify';
import ImageUpload from '../ImageUpload';

const ExperienceEditor = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    startDate: '',
    endDate: 'Present',
    isCurrent: false,
    description: '',
    logoUrl: '',
    techStack: '',
    order: 0
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const { data } = await api.get('/experience');
      setExperiences(data.data);
    } catch (error) {
      toast.error('Failed to load experience data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (exp) => {
    setEditingId(exp._id);
    setFormData({
      company: exp.company,
      role: exp.role,
      startDate: exp.startDate,
      endDate: exp.endDate || 'Present',
      isCurrent: exp.endDate === 'Present' || exp.isCurrent || false,
      description: exp.description,
      logoUrl: exp.logoUrl || '',
      techStack: exp.techStack ? exp.techStack.join(', ') : '',
      order: exp.order || 0
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearForm = () => {
    setEditingId(null);
    setFormData({
      company: '',
      role: '',
      startDate: '',
      endDate: 'Present',
      isCurrent: false,
      description: '',
      logoUrl: '',
      techStack: '',
      order: experiences.length + 1
    });
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
    try {
      const dataToSubmit = {
        ...formData,
        techStack: formData.techStack ? formData.techStack.split(',').map(item => item.trim()).filter(item => item !== '') : []
      };

      if (editingId) {
        const { data } = await api.put(`/experience/${editingId}`, dataToSubmit);
        setExperiences(experiences.map(exp => exp._id === editingId ? data.data : exp).sort((a, b) => a.order - b.order));
        toast.success('Experience updated successfully');
      } else {
        const { data } = await api.post('/experience', dataToSubmit);
        setExperiences([...experiences, data.data].sort((a, b) => a.order - b.order));
        toast.success('Experience added successfully');
      }
      
      clearForm();
    } catch (error) {
      toast.error(editingId ? 'Failed to update experience' : 'Failed to add experience');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this experience entry?')) return;
    try {
      await api.delete(`/experience/${id}`);
      setExperiences(experiences.filter(exp => exp._id !== id));
      toast.success('Experience removed');
    } catch (error) {
      toast.error('Failed to delete experience');
    }
  };

  if (loading) return <div className="p-10 text-indigo-500 animate-pulse">Loading Experience History...</div>;

  return (
    <div className="max-w-6xl pb-20">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-white tracking-tight">Professional Journey</h2>
        <p className="text-gray-400 mt-1">Timeline of your corporate and freelance experience.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Form */}
        <div className="lg:col-span-4">
          <form onSubmit={handleSubmit} className="glassmorphism p-8 rounded-3xl space-y-6 sticky top-24 border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-2">
              <h3 className={`text-xl font-bold ${editingId ? 'text-amber-400' : 'text-indigo-400'}`}>
                {editingId ? 'Edit Milestone' : 'Add Milestone'}
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
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center overflow-hidden border border-white/10">
                  {formData.logoUrl ? <img src={formData.logoUrl} className="w-full h-full object-contain" alt="Logo" /> : <span className="text-xl">🏢</span>}
                </div>
                <div className="flex-1">
                  <ImageUpload 
                    label="Company Logo" 
                    onUploadSuccess={(url) => setFormData({...formData, logoUrl: url})} 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Company / Organization</label>
                <input type="text" name="company" value={formData.company} onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all font-bold" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Job Role / Position</label>
                <input type="text" name="role" value={formData.role} onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">From</label>
                  <input type="text" name="startDate" value={formData.startDate} onChange={handleChange} placeholder="Jan 2022" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-sm font-mono" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">To</label>
                  <input type="text" name="endDate" value={formData.endDate} onChange={handleChange} disabled={formData.isCurrent} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 disabled:opacity-30 text-sm font-mono" />
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <input type="checkbox" id="isCurrent" name="isCurrent" checked={formData.isCurrent} onChange={handleChange} className="w-5 h-5 accent-indigo-500 rounded" />
                <label htmlFor="isCurrent" className="text-sm font-medium text-gray-300 cursor-pointer">Currently Working Here</label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Key Responsibilities</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 h-32 resize-none transition-all leading-relaxed" placeholder="Describe your impact and achievements..."></textarea>
              </div>
            </div>

            <button type="submit" className={`w-full ${editingId ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'} text-white py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-xl active:scale-[0.98]`}>
              {editingId ? 'Update History' : 'Save Experience'}
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-8 space-y-6">
          {experiences.length === 0 ? (
            <div className="py-40 glassmorphism rounded-3xl text-center border-dashed border-white/10">
              <p className="text-gray-500">Your professional timeline is empty.</p>
            </div>
          ) : (
            experiences.map(exp => (
              <div key={exp._id} className="glassmorphism p-8 rounded-3xl flex flex-col md:flex-row gap-6 items-start relative group border border-white/5 hover:border-indigo-500/20 transition-all shadow-xl">
                <div className="w-16 h-16 rounded-2xl bg-white/5 p-3 flex-shrink-0 border border-white/10">
                  {exp.logoUrl ? (
                    <img src={exp.logoUrl} alt={exp.company} className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">🏢</div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                    <div>
                      <h4 className="text-2xl font-black text-white tracking-tight">{exp.role}</h4>
                      <div className="text-indigo-400 font-bold uppercase tracking-widest text-[10px] mt-1">{exp.company}</div>
                    </div>
                    <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-gray-400">
                      {exp.startDate} — {exp.endDate}
                    </div>
                  </div>
                  <p className="text-gray-400 mt-4 text-sm leading-relaxed font-light italic border-l-2 border-indigo-500/30 pl-4">
                    {exp.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-6">
                    {exp.techStack?.map((tech, i) => (
                      <span key={i} className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg text-indigo-300 font-bold uppercase tracking-tighter">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="absolute top-6 right-6 flex gap-2">
                  <button 
                    onClick={() => handleEdit(exp)} 
                    className="bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white w-10 h-10 rounded-xl flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                    title="Edit Milestone"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleDelete(exp._id)} 
                    className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white w-10 h-10 rounded-xl flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                    title="Delete Milestone"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ExperienceEditor;
