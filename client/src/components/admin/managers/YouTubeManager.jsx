import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';
import { toast } from 'react-toastify';

const YouTubeManager = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ videoId: '', title: '', description: '', order: 0 });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data } = await api.get('/youtube');
      setVideos(data.data);
    } catch (error) {
      toast.error('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'videoId') {
      value = extractVideoId(value);
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const videoData = {
        ...formData,
        thumbnailUrl: `https://img.youtube.com/vi/${formData.videoId}/hqdefault.jpg`
      };
      const { data } = await api.post('/youtube', videoData);
      setVideos([...videos, data.data].sort((a, b) => a.order - b.order));
      setFormData({ videoId: '', title: '', description: '', order: videos.length + 1 });
      toast.success('YouTube video added successfully');
    } catch (error) {
      toast.error('Failed to add video');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this video?')) return;
    try {
      await api.delete(`/youtube/${id}`);
      setVideos(videos.filter(v => v._id !== id));
      toast.success('Video removed');
    } catch (error) {
      toast.error('Failed to remove video');
    }
  };

  if (loading) return <div className="p-10 text-red-500 animate-pulse">Loading YouTube Content...</div>;

  return (
    <div className="max-w-6xl pb-20">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-white tracking-tight">YouTube Integration</h2>
        <p className="text-gray-400 mt-1">Curate your video content and tutorials directly from YouTube.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Form Column */}
        <div className="lg:col-span-4">
          <form onSubmit={handleSubmit} className="glassmorphism p-8 rounded-3xl space-y-6 sticky top-24 border border-white/5 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-2">
              <span className="text-2xl">📽️</span>
              <h3 className="text-xl font-bold text-red-500">New Video</h3>
            </div>
            
            <div className="space-y-4">
              {formData.videoId && (
                <div className="aspect-video rounded-xl overflow-hidden bg-black shadow-lg mb-4 border border-white/10">
                  <img 
                    src={`https://img.youtube.com/vi/${formData.videoId}/hqdefault.jpg`} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">YouTube URL or Video ID</label>
                <input 
                  type="text" 
                  name="videoId" 
                  value={formData.videoId} 
                  onChange={handleChange} 
                  required 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-red-500 transition-all font-mono text-sm" 
                  placeholder="https://youtu.be/..." 
                />
                <p className="text-[10px] text-gray-500 mt-1 italic">* Paste link or 11-char ID</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Video Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  required 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-red-500 transition-all font-bold" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Brief Description</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-red-500 h-24 resize-none transition-all leading-relaxed"
                ></textarea>
              </div>
            </div>

            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-xl shadow-red-500/20 active:scale-[0.98]">
              Link Video
            </button>
          </form>
        </div>

        {/* List Column */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.length === 0 ? (
              <div className="md:col-span-2 py-40 glassmorphism rounded-3xl text-center border-dashed border-white/10">
                <p className="text-gray-500">No videos linked yet.</p>
              </div>
            ) : (
              videos.map(video => (
                <div key={video._id} className="glassmorphism rounded-3xl overflow-hidden flex flex-col group border border-white/5 hover:border-red-500/20 transition-all shadow-xl">
                  <div className="aspect-video relative overflow-hidden">
                    <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-2xl transition-transform group-hover:scale-125">
                        <span className="text-xl text-white">▶️</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h4 className="font-black text-white text-lg line-clamp-1 mb-2 tracking-tight group-hover:text-red-500 transition-colors">{video.title}</h4>
                    <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed font-light mb-4">{video.description}</p>
                    <div className="mt-auto flex justify-between items-center border-t border-white/5 pt-4">
                      <code className="text-[10px] text-gray-500 font-mono tracking-tighter">REF: {video.videoId}</code>
                      <button 
                        onClick={() => handleDelete(video._id)} 
                        className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        Delete
                      </button>
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

export default YouTubeManager;
