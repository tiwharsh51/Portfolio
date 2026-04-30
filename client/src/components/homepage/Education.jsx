import React from 'react';
import { motion } from 'framer-motion';

const FinalCTA = () => {
  return (
    <section id="education" className="section-padding bg-surface relative overflow-hidden">
      {/* Background Visuals */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/10 blur-[160px] rounded-full opacity-50" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="glass p-16 md:p-32 text-center border-primary/20"
          style={{ borderRadius: 'calc(var(--radius-card) * 1.5)' }}
        >
          <span className="text-primary font-bold text-[12px] uppercase tracking-[0.5em] mb-10 block">Available for New Projects</span>
          
          <h2 className="text-4xl md:text-8xl font-bold text-heading mb-12 tracking-tighter leading-none">
            Let’s build something <br/> <span className="text-gradient">impactful together.</span>
          </h2>
          
          <p className="text-main text-lg md:text-xl max-w-2xl mx-auto mb-16 leading-relaxed">
            Whether you have a fully-formed idea or just a spark of inspiration, I’m here to help you engineer a digital product that stands out.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <button className="btn-primary scale-110">
               Start a Conversation
            </button>
            <a href="#projects" className="text-heading font-bold text-xs uppercase tracking-[0.3em] hover:text-primary transition-colors border-b border-glass-border pb-1">
               Review Portfolio
            </a>
          </div>
        </motion.div>
      </div>

      <div className="mt-32 border-t border-glass-border pt-12 container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40">
         <span className="text-xs font-bold uppercase tracking-widest text-dim">&copy; 2026 Developer Portfolio</span>
         <div className="flex gap-8">
            <a href="#" className="text-xs font-bold uppercase tracking-widest text-dim hover:text-heading transition-colors">LinkedIn</a>
            <a href="#" className="text-xs font-bold uppercase tracking-widest text-dim hover:text-heading transition-colors">GitHub</a>
            <a href="#" className="text-xs font-bold uppercase tracking-widest text-dim hover:text-heading transition-colors">Twitter</a>
         </div>
      </div>
    </section>
  );
};

export default FinalCTA;
