import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';
import { toast } from 'react-toastify';
import ImageUpload from '../ImageUpload';

const EducationEditor = () => {
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    field: '',
    startYear: '',
    endYear: '',
    grade: '',
    logoUrl: '',
    certificateUrl: '',
    type: 'Degree',
    order: 0
  });

  useEffect(() => {
    fetchEducations();
  }, []);

  const fetchEducations = async () => {
    try {
      const { data } = await api.get('/education');
      setEducations(data.data);
    } catch (error) {
      toast.error('Failed to load education data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (edu) => {
    setEditingId(edu._id);
    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field,
      startYear: edu.startYear,
      endYear: edu.endYear,
      grade: edu.grade || '',
      logoUrl: edu.logoUrl || '',
      certificateUrl: edu.certificateUrl || '',
      type: edu.type || 'Degree',
      order: edu.order || 0
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearForm = () => {
    setEditingId(null);
    setFormData({
      institution: '',
      degree: '',
      field: '',
      startYear: '',
      endYear: '',
      grade: '',
      logoUrl: '',
      certificateUrl: '',
      type: 'Degree',
      order: educations.length + 1
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { data } = await api.put(`/education/${editingId}`, formData);
        setEducations(educations.map(edu => edu._id === editingId ? data.data : edu).sort((a, b) => a.order - b.order));
        toast.success('Education record updated');
      } else {
        const { data } = await api.post('/education', formData);
        setEducations([...educations, data.data].sort((a, b) => a.order - b.order));
        toast.success('Education entry added');
      }
      clearForm();
    } catch (error) {
      toast.error(editingId ? 'Failed to update education' : 'Failed to add education');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    try {
      await api.delete(`/education/${id}`);
      setEducations(educations.filter(edu => edu._id !== id));
      toast.success('Education deleted');
    } catch (error) {
      toast.error('Failed to delete education');
    }
  };

  if (loading) return <div className="p-10 text-amber-500 animate-pulse">Loading Education Records...</div>;

  return (
    <div className="max-w-6xl pb-20">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-white tracking-tight">Academic Background</h2>
        <p className="text-gray-400 mt-1">Degrees, certifications, and specialized courses.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Form */}
        <div className="lg:col-span-4">
          <form onSubmit={handleSubmit} className="glassmorphism p-8 rounded-3xl space-y-6 sticky top-24 border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-2">
              <h3 className={`text-xl font-bold ${editingId ? 'text-amber-500' : 'text-amber-400'}`}>
                {editingId ? 'Edit Qualification' : 'New Qualification'}
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
                  {formData.logoUrl ? <img src={formData.logoUrl} className="w-full h-full object-contain" alt="Logo" /> : <span className="text-xl">🎓</span>}
                </div>
                <div className="flex-1">
                  <ImageUpload 
                    label="Inst. Logo" 
                    onUploadSuccess={(url) => setFormData({...formData, logoUrl: url})} 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Institution Name</label>
                <input type="text" name="institution" value={formData.institution} onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-amber-500 transition-all font-bold" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Degree / Certificate Title</label>
                <input type="text" name="degree" value={formData.degree} onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-amber-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Field of Study</label>
                <input type="text" name="field" value={formData.field} onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-amber-500 transition-all" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Start Year</label>
                  <input type="text" name="startYear" value={formData.startYear} onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-amber-500 font-mono" placeholder="2018" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">End Year</label>
                  <input type="text" name="endYear" value={formData.endYear} onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-amber-500 font-mono" placeholder="2022" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Grade / CGPA</label>
                  <input type="text" name="grade" value={formData.grade} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-amber-500 font-bold" placeholder="8.5/10" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-adminMain border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-amber-500 transition-all cursor-pointer appearance-none">
                    <option value="Degree">Degree</option>
                    <option value="Certification">Certification</option>
                    <option value="Course">Course</option>
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" className={`w-full ${editingId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-amber-600 hover:bg-amber-700'} text-white py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-xl shadow-amber-500/20 active:scale-[0.98]`}>
              {editingId ? 'Update Record' : 'Add Record'}
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-8">
          {educations.length === 0 ? (
            <div className="py-40 glassmorphism rounded-3xl text-center border-dashed border-white/10">
              <p className="text-gray-500">No education history recorded.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {educations.map(edu => (
                <div key={edu._id} className="glassmorphism p-8 rounded-3xl relative group hover:bg-white/10 transition-all border border-white/5 hover:border-amber-500/20 shadow-xl">
                  <div className="flex gap-5 items-center mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 p-2 flex items-center justify-center flex-shrink-0 border border-white/10">
                      {edu.logoUrl ? <img src={edu.logoUrl} className="w-full h-full object-contain" alt="Logo" /> : <span className="text-2xl">🎓</span>}
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white leading-tight tracking-tight">{edu.degree}</h4>
                      <div className="text-xs text-amber-500 font-bold uppercase tracking-widest mt-1">{edu.institution}</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="opacity-50">Field:</span>
                      <span className="font-medium text-gray-300">{edu.field}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="text-gray-500">{edu.startYear} — {edu.endYear}</div>
                      <div className="bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-lg border border-amber-500/20 font-black">{edu.grade}</div>
                    </div>
                    <div className="pt-4 border-t border-white/5 flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-white/5 rounded-full text-gray-500 border border-white/5">
                        {edu.type}
                      </span>
                    </div>
                  </div>
                  
                  <div className="absolute top-6 right-6 flex gap-2">
                    <button 
                      onClick={() => handleEdit(edu)} 
                      className="bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white w-10 h-10 rounded-xl flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                      title="Edit Qualification"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDelete(edu._id)} 
                      className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white w-10 h-10 rounded-xl flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                      title="Delete Entry"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EducationEditor;
