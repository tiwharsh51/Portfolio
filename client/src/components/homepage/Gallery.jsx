import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const { data } = await api.get('/gallery');
        setPhotos(data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPhotos();
  }, []);

  const resolveUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/800x800';
    if (url.startsWith('http')) return url;
    const baseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
    return `${baseUrl}/${url.replace(/\\/g, '/')}`;
  };

  if (!photos.length) return null;

  return (
    <section id="gallery" className="section-padding bg-surface relative overflow-hidden">
      <div className="mesh-bg top-[-10%] left-[-10%] bg-primary/5" />
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-32">
          <div className="max-w-3xl">
            <h2 className="text-5xl md:text-8xl font-black text-heading mb-8 tracking-tighter leading-[0.95]">
               Visual <span className="text-gradient">Echoes.</span>
            </h2>
            <p className="text-main text-xl md:text-2xl leading-relaxed font-light">
               Capturing moments of design clarity and technical implementation through a lens of precision.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {photos.map((photo, index) => (
            <motion.div
              key={photo._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelected(photo)}
              className="relative aspect-square overflow-hidden cursor-zoom-in group glassmorphism border border-glass-border image-elite-hover card-rounded"
            >
              <img 
                src={resolveUrl(photo.imageUrl)} 
                alt={photo.caption} 
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 card-rounded" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                <p className="text-white text-sm font-bold tracking-tight">{photo.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
          >
            <motion.img 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={resolveUrl(selected.imageUrl)} 
              className="max-w-full max-h-full shadow-2xl section-rounded"
            />
            <button className="absolute top-10 right-10 text-white text-3xl">✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
