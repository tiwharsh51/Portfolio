import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';

const SkillsElite = () => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data } = await api.get('/skills');
        setSkills(data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSkills();
  }, []);

  const categories = [...new Set(skills.map(s => s.category))];

  // Helper to map enum level to percentage for the UI bar
  const getLevelPercent = (level) => {
    switch(level) {
      case 'Beginner': return 40;
      case 'Expert': return 100;
      case 'Intermediate':
      default: return 75;
    }
  };

  if (!skills.length) return null;

  return (
    <section id="skills" className="section-padding bg-surface relative overflow-hidden">
      {/* Background Glow */}
      <div className="mesh-bg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary/10" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-8xl font-black text-heading mb-8 tracking-tighter">
               Technical <span className="text-gradient">Arsenal.</span>
            </h2>
            <p className="text-main text-xl md:text-2xl leading-relaxed font-light">
               A comprehensive stack designed for building high-performance, scalable digital products.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <SkillCategory 
              key={cat} 
              category={cat} 
              skills={skills.filter(s => s.category === cat)} 
              index={idx} 
              getLevelPercent={getLevelPercent}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const SkillCategory = ({ category, skills, index, getLevelPercent }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="glass p-10 card-rounded flowing-border group hover:border-primary/30 transition-all duration-500"
    >
      <div className="mb-10">
         <span className="text-[12px] font-bold text-primary uppercase tracking-[0.3em] mb-4 block">Engineered for</span>
         <h3 className="text-2xl font-bold text-heading uppercase tracking-tight">{category}</h3>
      </div>

      <div className="space-y-8">
        {skills.map((skill, i) => (
          <div key={skill._id} className="group/item">
             <div className="flex justify-between items-center mb-4">
                <div className="px-4 py-2 border border-glass-border bg-glass-bg tag-rounded group-hover/item:border-primary/50 transition-all">
                  <span className="text-sm font-black text-heading uppercase tracking-widest">{skill.title}</span>
                </div>
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] opacity-60">{skill.level}</span>
             </div>
             <div className="h-[3px] w-full bg-glass relative overflow-hidden tag-rounded">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${getLevelPercent(skill.level)}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.5 + (i * 0.1), ease: "easeOut" }}
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_15px_-3px_var(--primary)]"
                />
             </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default SkillsElite;
