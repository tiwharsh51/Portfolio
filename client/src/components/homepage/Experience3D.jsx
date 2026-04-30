import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import api from '../../utils/api';

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const fetchExp = async () => {
      try {
        const { data } = await api.get('/experience');
        setExperiences(data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchExp();
  }, []);

  if (!experiences.length) return null;

  return (
    <section id="experience" className="section-padding relative overflow-hidden bg-surface" ref={containerRef}>
      <div className="mesh-bg top-[-20%] left-[-20%] bg-accent/10" />
      <div className="w-full max-w-[1400px] mx-auto px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mb-20"
        >
          <h2 className="text-5xl md:text-8xl font-black text-heading mb-10 tracking-tighter leading-[0.95]">
            Experience <span className="text-gradient">Continuum.</span>
          </h2>
          <p className="text-main text-xl md:text-2xl leading-relaxed font-light">
             A linear progression of technical mastery and strategic leadership documented across the digital landscape.
          </p>
        </motion.div>

        <div className="relative">
          {/* Subtle Vertical Line */}
          <motion.div 
            style={{ scaleY }}
            className="absolute left-[30px] md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-glass origin-top hidden md:block"
          />

          <div className="space-y-20">
            {experiences.map((exp, index) => (
              <ExperienceItem key={exp._id} exp={exp} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ExperienceItem = ({ exp, index }) => {
  const isEven = index % 2 === 0;
  
  return (
    <div className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-12 md:gap-0 ${isEven ? 'md:flex-row-reverse' : ''}`}>
      {/* Content Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="w-full md:w-[42%] group"
      >
        <div 
          className="p-10 glass-card card-rounded flowing-border group-hover:border-primary/30 transition-all duration-700"
        >
          <div className="mb-6">
             <span className="text-primary font-bold text-xs uppercase tracking-[0.3em] mb-4 block">{exp.startDate} &mdash; {exp.endDate}</span>
             <h4 className="text-4xl font-heading text-heading italic tracking-tight mb-2 group-hover:text-primary transition-colors">{exp.role}</h4>
             <p className="text-lg font-bold text-dim uppercase tracking-widest">{exp.company}</p>
          </div>
          
          <p className="text-dim text-lg font-normal leading-relaxed mb-8 group-hover:text-main transition-colors">{exp.description}</p>
          
          <div className="flex flex-wrap gap-4">
            {exp.techStack?.map((tech, i) => (
              <span 
                key={i} 
                className="text-xs font-bold text-dim uppercase tracking-[0.2em] border border-glass-border px-4 py-2 tag-rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Point on Line */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-surface border border-glass-border items-center justify-center z-20">
        <div className="w-1.5 h-1.5 rounded-full bg-heading group-hover:scale-150 transition-transform"></div>
      </div>

      {/* Numerical Index */}
      <div className="hidden md:block w-[42%] text-right">
         <span className="text-[120px] font-heading italic font-bold text-heading opacity-5 select-none leading-none">0{index + 1}</span>
      </div>
    </div>
  );
};

export default Experience;
