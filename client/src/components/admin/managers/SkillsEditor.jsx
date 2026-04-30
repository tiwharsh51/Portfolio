import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';
import { toast } from 'react-toastify';
import ImageUpload from '../ImageUpload';

const SkillsEditor = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', category: 'Frontend', level: 'Intermediate', icon: '', connections: '', order: 0 });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const { data } = await api.get('/skills');
      setSkills(data.data);
    } catch (error) {
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (skill) => {
    setEditingId(skill._id);
    setFormData({
      title: skill.title,
      category: skill.category || 'Frontend',
      level: skill.level || 'Intermediate',
      icon: skill.icon || '',
      connections: skill.connections ? skill.connections.join(', ') : '',
      order: skill.order || 0
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearForm = () => {
    setEditingId(null);
    setFormData({ title: '', category: 'Frontend', level: 'Intermediate', icon: '', connections: '', order: skills.length });
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        connections: formData.connections ? formData.connections.split(',').map(c => c.trim()).filter(c => c !== '') : []
      };

      if (editingId) {
        const { data } = await api.put(`/skills/${editingId}`, dataToSubmit);
        setSkills(skills.map(s => s._id === editingId ? data.data : s).sort((a, b) => a.order - b.order));
        toast.success('Skill updated successfully');
      } else {
        const { data } = await api.post('/skills', dataToSubmit);
        setSkills([...skills, data.data].sort((a, b) => a.order - b.order));
        toast.success('Skill added successfully');
      }
      clearForm();
    } catch (error) {
      toast.error(editingId ? 'Failed to update skill' : 'Failed to add skill');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this skill?')) return;
    try {
      await api.delete(`/skills/${id}`);
      setSkills(skills.filter(s => s._id !== id));
      toast.success('Skill removed');
    } catch (error) {
      toast.error('Failed to delete skill');
    }
  };

  if (loading) return <div className="p-10 text-indigo-500 animate-pulse">Loading Skills...</div>;

  return (
    <div className="max-w-6xl pb-20">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-white tracking-tight">Skills & Expertise</h2>
        <p className="text-gray-400 mt-1">Manage your technical stack and visual icons.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-4">
          <form onSubmit={handleSubmit} className="glassmorphism p-8 rounded-3xl space-y-6 sticky top-24 border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-2">
              <h3 className={`text-xl font-bold ${editingId ? 'text-amber-400' : 'text-indigo-400'}`}>
                {editingId ? 'Edit Capability' : 'New Capability'}
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
                <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                  {formData.icon ? (
                    formData.icon.startsWith('http') ? (
                      <img src={formData.icon} className="w-full h-full object-contain" alt="Icon" />
                    ) : (
                      <span className="text-2xl">{formData.icon}</span>
                    )
                  ) : (
                    <span className="text-xl">🛠️</span>
                  )}
                </div>
                <div className="flex-1">
                  <ImageUpload 
                    label="Skill Icon" 
                    onUploadSuccess={(url) => setFormData({...formData, icon: url})} 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Skill Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  required 
                  placeholder="e.g. React.js"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all font-bold" 
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
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Tools">Tools</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Proficiency</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Beginner', 'Intermediate', 'Expert'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setFormData({ ...formData, level: lvl })}
                      className={`px-2 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        formData.level === lvl 
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                          : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Icon URL / Emoji (Fallback)</label>
                <input 
                  type="text" 
                  name="icon" 
                  value={formData.icon} 
                  onChange={handleChange} 
                  placeholder="e.g. ⚛️ or SiReact"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all font-mono text-xs" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Related Skills</label>
                <input 
                  type="text" 
                  name="connections" 
                  value={formData.connections} 
                  onChange={handleChange} 
                  placeholder="Node.js, Redux, Next.js" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all" 
                />
                <p className="text-[10px] text-gray-500 mt-1 italic">* Comma separated list</p>
              </div>
            </div>

            <button type="submit" className={`w-full ${editingId ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'} py-4 rounded-xl text-white font-black uppercase tracking-widest transition-all shadow-xl active:scale-[0.98]`}>
              {editingId ? 'Save Changes' : 'Add Skill'}
            </button>
          </form>
        </div>

        {/* Right Column: List */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((skill) => (
              <div 
                key={skill._id} 
                className="glassmorphism p-6 rounded-3xl flex justify-between items-center group hover:bg-white/10 transition-all border border-white/5 hover:border-indigo-500/30 shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-all border border-white/5 overflow-hidden">
                    {skill.icon ? (
                      skill.icon.startsWith('http') ? (
                        <img src={skill.icon} className="w-full h-full object-contain" alt={skill.title} />
                      ) : (
                        <span>{skill.icon}</span>
                      )
                    ) : (
                      '🛠️'
                    )}
                  </div>
                  <div>
                    <h4 className="font-black text-white text-lg tracking-tight">{skill.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-tighter">
                        {skill.category}
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg border uppercase tracking-tighter ${
                        skill.level === 'Expert' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        skill.level === 'Intermediate' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {skill.level}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(skill)} 
                    className="bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white w-10 h-10 rounded-xl flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                    title="Edit Skill"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleDelete(skill._id)} 
                    className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white w-10 h-10 rounded-xl flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                    title="Delete Skill"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          {skills.length === 0 && (
            <div className="text-center py-40 glassmorphism rounded-3xl border-dashed border-white/10 text-gray-500">
              No skills found. Let's build your stack!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillsEditor;
