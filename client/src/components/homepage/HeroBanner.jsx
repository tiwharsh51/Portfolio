import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';

const HeroBanner = () => {
  const [heroData, setHeroData] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const { data } = await api.get('/hero');
        setHeroData(data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchHero();
  }, []);

  useEffect(() => {
    if (heroData?.slides?.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroData.slides.length);
      }, (heroData.autoSlideInterval || 5) * 1000);
      return () => clearInterval(timer);
    }
  }, [heroData]);

  if (!heroData || !heroData.slides?.length) return null;

  const slide = heroData.slides[currentSlide];

  return (
    <section className="relative h-screen min-h-[900px] w-full overflow-hidden bg-surface flex items-center">
      {/* Visual Enhancements */}
      <div className="hero-glow" />
      <div className="mesh-bg top-[-10%] right-[-10%] bg-primary" />
      <div className="mesh-bg bottom-[-10%] left-[-10%] bg-secondary" />

      {/* Background Slideshow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
           <img 
             src={slide.imageUrl || 'https://via.placeholder.com/1920x1080'} 
             alt="Slide Background" 
             className="w-full h-full object-cover opacity-20 transition-all duration-1000" 
           />
           <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/90 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-5xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="h-[1px] w-12 bg-primary" />
            <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">Status: Open for Innovation</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl md:text-9xl font-heading font-black text-heading mb-10 tracking-tighter leading-[0.85]"
          >
            {slide.caption.split(' ').map((word, i) => (
              <span key={i} className="inline-block mr-6">
                {i % 2 === 1 ? <span className="text-gradient">{word}</span> : word}
              </span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-dim max-w-3xl mb-16 leading-relaxed font-light"
          >
            {slide.subCaption}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap gap-8"
          >
            <a href="#projects" className="btn-primary btn-rounded group">
              Explore Portfolio
              <svg className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </a>
            <a href="#contact" className="btn-secondary btn-rounded">
              Direct Frequency
            </a>
          </motion.div>
        </div>
      </div>

      {/* Floating Visual Element (Right Side) */}
      <div className="hidden lg:block absolute right-[10%] top-1/2 -translate-y-1/2 w-1/3 aspect-square relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
          className="w-full h-full glass flex items-center justify-center relative overflow-hidden image-elite-hover card-rounded"
        >
          {/* Animated Tech Orbs */}
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          </div>
          <div className="relative text-main font-mono text-xs space-y-4 opacity-40">
             <div className="flex gap-4"><code>const</code> <code className="text-primary">developer</code> <code>=</code> <code>{'{'}</code></div>
             <div className="pl-6"><code>skill:</code> <code className="text-secondary">'MERN Specialist'</code>,</div>
             <div className="pl-6"><code>focus:</code> <code className="text-secondary">'High Performance'</code>,</div>
             <div className="pl-6"><code>impact:</code> <code className="text-secondary">'Scalable Solutions'</code></div>
             <div><code>{'}'}</code></div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] font-bold uppercase tracking-widest text-dim">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary/50 to-transparent" />
      </motion.div>
    </section>
  );
};

export default HeroBanner;
