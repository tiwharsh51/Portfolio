import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import SectionHeader from '../common/SectionHeader';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchProj = async () => {
      try {
        const { data } = await api.get('/projects');
        setProjects(data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProj();
  }, []);

  const categories = ['All', ...new Set(projects.flatMap(p => p.techStack))];
  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.techStack.includes(filter));

  if (!projects.length) return null;

  return (
    <section id="projects" className="section-padding bg-surface relative overflow-hidden">
      <div className="mesh-bg top-0 right-0 bg-secondary/10" />
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-16">
          <SectionHeader 
            title="Selected Artifacts." 
            subtitle="A curated collection of digital products where engineering meets elegance." 
            className="mb-0 max-w-3xl"
          />
          
          <div className="flex flex-wrap gap-3">
            {categories.slice(0, 5).map(cat => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  filter === cat 
                    ? 'bg-primary text-white shadow-[0_0_20px_-5px_var(--primary)] border-none' 
                    : 'bg-glass-bg text-dim hover:text-heading border border-glass-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <ProjectCard key={project._id} project={project} index={idx} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({ project, index }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative group col-span-1"
    >
      <div 
        className="relative aspect-video overflow-hidden bg-glass-bg border border-glass-border shadow-2xl image-elite-hover card-rounded"
      >
         {/* Glow effect on hover */}
         <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
         
         <img 
           src={project.imageUrl || 'https://via.placeholder.com/800x500'} 
           alt={project.title} 
           className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 group-hover:rotate-1 img-rounded" 
         />

         {/* Link Overlay */}
         <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
            <a 
              href={project.liveUrl} 
              target="_blank" 
              rel="noreferrer"
              className="w-16 h-16 rounded-full bg-heading flex items-center justify-center text-surface shadow-2xl hover:scale-110 transition-transform border-none"
            >
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                 <line x1="7" y1="17" x2="17" y2="7"></line>
                 <polyline points="7 7 17 7 17 17"></polyline>
               </svg>
            </a>
         </div>
      </div>

      <div className="mt-8">
         <div className="flex flex-wrap gap-4 mb-4">
            {project.techStack?.slice(0, 3).map((tech, i) => (
              <span key={i} className="text-xs font-bold text-primary uppercase tracking-[0.2em]">{tech}</span>
            ))}
         </div>
         <h3 className="text-2xl md:text-3xl font-bold text-heading mb-4 group-hover:text-primary transition-colors">{project.title}</h3>
         <p className="text-dim text-lg leading-relaxed line-clamp-2 max-w-xl">{project.description}</p>
      </div>
    </motion.div>
  );
};

export default Projects;
