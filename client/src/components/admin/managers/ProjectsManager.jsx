import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';
import { toast } from 'react-toastify';
import ImageUpload from '../ImageUpload';

const ProjectsManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    liveUrl: '',
    githubUrl: '',
    techStack: '',
    featured: false,
    order: 0
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data.data);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    setEditingId(project._id);
    setFormData({
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl,
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      techStack: project.techStack ? project.techStack.join(', ') : '',
      featured: project.featured || false,
      order: project.order || 0
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      liveUrl: '',
      githubUrl: '',
      techStack: '',
      featured: false,
      order: projects.length + 1
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
        const { data } = await api.put(`/projects/${editingId}`, dataToSubmit);
        setProjects(projects.map(p => p._id === editingId ? data.data : p).sort((a, b) => a.order - b.order));
        toast.success('Project updated successfully');
      } else {
        const { data } = await api.post('/projects', dataToSubmit);
        setProjects([...projects, data.data].sort((a, b) => a.order - b.order));
        toast.success('Project added successfully');
      }
      
      clearForm();
    } catch (error) {
      toast.error(editingId ? 'Failed to update project' : 'Failed to add project');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter(p => p._id !== id));
      toast.success('Project deleted');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  if (loading) return <div className="p-10 text-indigo-500 animate-pulse">Loading Projects...</div>;

  return (
    <div className="max-w-6xl pb-20">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-white">Project Portfolio</h2>
        <p className="text-gray-400 mt-1">Manage your development work and case studies.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Form Column */}
        <div className="lg:col-span-4">
          <form onSubmit={handleSubmit} className="glassmorphism p-8 rounded-3xl space-y-6 sticky top-24 border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-2">
              <h3 className={`text-xl font-bold ${editingId ? 'text-amber-400' : 'text-emerald-400'}`}>
                {editingId ? 'Edit Project' : 'New Showcase'}
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
              <div className="aspect-video rounded-xl overflow-hidden bg-black/40 border border-white/5 relative group">
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="Project Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 text-xs text-center p-4">
                    <span>Project Cover Preview</span>
                  </div>
                )}
              </div>

              <ImageUpload 
                label="Upload Project Cover" 
                onUploadSuccess={(url) => setFormData(prev => ({...prev, imageUrl: url}))} 
              />

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Project Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  required 
                  placeholder="e.g. AI Dashboard"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 transition-all font-bold" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Brief Description</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  required 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 h-24 resize-none transition-all"
                  placeholder="What makes this project special?"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1 text-xs">Live URL</label>
                  <input type="text" name="liveUrl" value={formData.liveUrl} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-emerald-500 font-mono text-xs" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1 text-xs">GitHub URL</label>
                  <input type="text" name="githubUrl" value={formData.githubUrl} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-emerald-500 font-mono text-xs" placeholder="https://..." />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Tech Stack</label>
                <input 
                  type="text" 
                  name="techStack" 
                  value={formData.techStack} 
                  onChange={handleChange} 
                  placeholder="React, Three.js, GSAP" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 transition-all font-mono text-sm" 
                />
                <p className="text-[10px] text-gray-500 mt-1">* Comma separated list</p>
              </div>

              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <input 
                  type="checkbox" 
                  id="featured" 
                  name="featured" 
                  checked={formData.featured} 
                  onChange={handleChange} 
                  className="w-5 h-5 accent-emerald-500 rounded"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-300 cursor-pointer">Mark as Featured</label>
              </div>
            </div>

            <button type="submit" className={`w-full ${editingId ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'} text-white py-4 rounded-xl font-bold transition-all shadow-xl`}>
              {editingId ? 'Save Changes' : 'Publish Project'}
            </button>
          </form>
        </div>

        {/* List Column */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.length === 0 ? (
              <div className="md:col-span-2 py-40 glassmorphism rounded-3xl text-center border-dashed border-white/10">
                <p className="text-gray-500">Your portfolio is empty. Add your first project!</p>
              </div>
            ) : (
              projects.map(project => (
                <div key={project._id} className="glassmorphism rounded-3xl overflow-hidden group relative border border-white/5 hover:border-emerald-500/20 transition-all shadow-xl">
                  <div className="h-52 w-full overflow-hidden relative">
                    <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-darkBg via-transparent to-transparent opacity-60"></div>
                    {project.featured && (
                      <span className="absolute top-4 left-4 bg-amber-400 text-black text-[10px] font-black px-3 py-1 rounded-full shadow-lg">FEATURED</span>
                    )}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button 
                        onClick={() => handleEdit(project)} 
                        className="bg-amber-500/80 hover:bg-amber-500 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm shadow-lg"
                        title="Edit Project"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDelete(project._id)} 
                        className="bg-red-500/80 hover:bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm shadow-lg"
                        title="Delete Project"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-black text-white mb-2 tracking-tight group-hover:text-emerald-400 transition-colors">{project.title}</h4>
                    <p className="text-gray-400 text-sm line-clamp-3 mb-4 leading-relaxed font-light">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.techStack?.map((tech, i) => (
                        <span key={i} className="text-[10px] bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-gray-300 font-mono">{tech}</span>
                      ))}
                    </div>
                    <div className="flex gap-6 border-t border-white/5 pt-4">
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-white transition-colors font-bold uppercase tracking-widest">
                          <span>🔗</span> Live
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-white transition-colors font-bold uppercase tracking-widest">
                          <span>📁</span> Code
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsManager;
