import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';

const YouTubeSection = () => {
  const [videos, setVideos] = useState([]);
  const [channelMeta, setChannelMeta] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [videoRes, metaRes] = await Promise.all([
          api.get('/youtube'),
          api.get('/sitemeta')
        ]);
        setVideos(videoRes.data.data);
        setChannelMeta(metaRes.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  if (!videos.length) return null;

  return (
    <section id="youtube" className="section-padding bg-surface relative overflow-hidden">
      <div className="mesh-bg top-0 right-0 bg-red-600/5" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-8 block">Content Stream</span>
          <h2 className="text-5xl md:text-8xl font-black text-heading mb-10 tracking-tighter">
             Video <span className="text-gradient">Chronicles.</span>
          </h2>
          <p className="text-main text-xl md:text-2xl mb-12 font-light">Insights, tutorials, and behind-the-scenes from the digital lab.</p>
          {channelMeta?.youtubeChannelUrl && (
            <a 
              href={channelMeta.youtubeChannelUrl} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-white font-bold uppercase tracking-widest text-xs border border-primary/20 px-6 py-2 rounded-full hover:bg-primary transition-all"
            >
              Visit Channel
            </a>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video, index) => (
            <motion.div
              key={video._id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass overflow-hidden group cursor-pointer border-glass-border flowing-border card-rounded"
              onClick={() => window.open(`https://www.youtube.com/watch?v=${video.videoId}`, '_blank')}
            >
              <div className="relative aspect-video overflow-hidden card-rounded">
                <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 card-rounded" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <span className="text-white text-2xl ml-1">▶</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-lg font-bold text-heading mb-2 line-clamp-2 group-hover:text-primary transition-colors">{video.title}</h4>
                <p className="text-dim text-xs line-clamp-2">{video.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default YouTubeSection;
