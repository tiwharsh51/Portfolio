import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import SectionHeader from '../common/SectionHeader';
import Button from '../common/Button';

const About = () => {
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const { data } = await api.get('/about');
        setAboutData(data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAbout();
  }, []);

  const resolveUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/600x600';
    if (url.startsWith('http')) return url;
    // Fallback for local paths if not already absolute
    const baseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
    return `${baseUrl}/${url.replace(/\\/g, '/')}`;
  };

  if (!aboutData) return null;

  return (
    <section id="about" className="section-padding bg-surface relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="mesh-bg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary/20" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div 
              className="aspect-square overflow-hidden glass-card p-6 image-elite-hover card-rounded"
            >
              <img 
                src={resolveUrl(aboutData.profilePhotoUrl)} 
                alt="Profile" 
                className="w-full h-full object-cover transition-all duration-1000 img-rounded"
              />
            </div>
            
            {/* Experience Floating Badge */}
            <div className="absolute -bottom-12 -right-12 glass p-10 section-rounded shadow-2xl hidden md:block border border-glass-border">
               <p className="text-dim text-[10px] font-black uppercase tracking-[0.3em] mb-2">Years of Mastery</p>
               <h4 className="text-5xl font-black text-heading tracking-tighter">
                 {aboutData.yearsOfExperience}+ <span className="text-primary text-2xl">Exp.</span>
               </h4>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-primary font-black text-[10px] uppercase tracking-[0.5em] mb-8 block">{aboutData.title}</span>
            <h2 className="text-5xl md:text-8xl font-black text-heading mb-10 tracking-tighter leading-[0.95]">
              Engineering <span className="text-gradient">Narrative.</span>
            </h2>
            
            <div 
              className="text-main text-xl md:text-2xl leading-relaxed mb-16 max-w-xl prose prose-invert font-light"
              dangerouslySetInnerHTML={{ __html: aboutData.bio }}
            />

            <div className="grid grid-cols-2 gap-16 pt-12 border-t border-glass-border mb-16">
              <div>
                <h5 className="text-4xl font-black text-heading mb-2">{aboutData.projectsCompleted}+</h5>
                <p className="text-dim text-[10px] font-black uppercase tracking-[0.3em]">Deployments</p>
              </div>
              <div>
                <h5 className="text-4xl font-black text-heading mb-2">{aboutData.happyClients}+</h5>
                <p className="text-dim text-[10px] font-black uppercase tracking-[0.3em]">Collaborations</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-8 items-center">
                <Button
                  as="a"
                  href={resolveUrl(aboutData.resumeUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary btn-rounded"
                >
                 Download Dossier
               </Button>
               <a href="#contact" className="text-heading font-bold text-xs uppercase tracking-[0.3em] hover:text-primary transition-colors border-b border-glass-border pb-1">
                 Initiate Contact
               </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
