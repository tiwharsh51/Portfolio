import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import Button from './common/Button';

const PreviewBanner = () => {
  const { previewTheme, setTheme, cancelPreview } = useContext(ThemeContext);

  if (!previewTheme) return null;

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] glass px-8 py-4 rounded-full border-primary shadow-2xl flex items-center gap-8 backdrop-blur-3xl"
    >
       <div className="flex flex-col border-r border-white/10 pr-8">
          <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-0.5">Preview Mode Active</span>
          <span className="text-xs font-bold text-[var(--heading)]">Testing theme architecture</span>
       </div>
       <div className="flex gap-3">
          <Button
            onClick={cancelPreview}
            className="px-5 py-2 rounded-xl bg-white/5 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10"
          >
            Cancel
          </Button>
          <Button
            onClick={() => setTheme(previewTheme)}
            className="px-5 py-2 rounded-xl bg-primary text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
          >
            Apply Permanently
          </Button>
       </div>
    </motion.div>
  );
};

export default PreviewBanner;
