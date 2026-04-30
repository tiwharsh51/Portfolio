import React, { useContext, useState } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const themes = [
  { id: 'theme-midnight', name: 'Midnight Pro', industry: 'Developers / Engineers', desc: 'Futuristic, coding-focused, high trust.', colors: ['#0B0F19', '#3B82F6', '#8B5CF6'] },
  { id: 'theme-minimal', name: 'Minimal Light', industry: 'Corporate / Freshers', desc: 'Clean, ATS-friendly, recruiter-safe.', colors: ['#FFFFFF', '#2563EB', '#64748B'] },
  { id: 'theme-sunset', name: 'Sunset Gradient', industry: 'Designers / Creators', desc: 'Creative, bold but controlled energy.', colors: ['#0F172A', '#F97316', '#EC4899'] },
  { id: 'theme-glass', name: 'Glass Blue', industry: 'SaaS / Product Dev', desc: 'Modern SaaS, smooth, clean aesthetics.', colors: ['#0A192F', '#38BDF8', '#1e293b'] },
  { id: 'theme-royal', name: 'Royal Purple', industry: 'Personal Brand', desc: 'Premium, elegant, and standout branding.', colors: ['#1E1B4B', '#7C3AED', '#4F46E5'] },
  { id: 'theme-ocean', name: 'Ocean Teal', industry: 'Data Science', desc: 'Calm, intelligent, and analytical focus.', colors: ['#042F2E', '#14B8A6', '#0EA5E9'] },
  { id: 'theme-frost', name: 'Frost White', industry: 'UI/UX Designers', desc: 'Clean, design-focused, minimal layout.', colors: ['#F8FAFC', '#6366F1', '#CBD5F5'] },
  { id: 'theme-mono', name: 'Mono Black', industry: 'Cybersecurity', desc: 'Terminal vibe, secure, highly technical.', colors: ['#000000', '#22C55E', '#111827'] },
  { id: 'theme-pastel', name: 'Soft Pastel', industry: 'Students / Beginners', desc: 'Friendly, approachable, and soft feel.', colors: ['#FEFCE8', '#A78BFA', '#FBCFE8'] },
  { id: 'theme-neon', name: 'Neon Tech', industry: 'AI / Startups', desc: 'High-tech, futuristic energy and speed.', colors: ['#020617', '#22D3EE', '#A21CAF'] },
  { id: 'theme-earthy', name: 'Earthy Brown', industry: 'NGO / Eco', desc: 'Natural, grounded, and eco-friendly vibe.', colors: ['#1C1917', '#A16207', '#65A30D'] },
  { id: 'theme-steel', name: 'Steel Gray', industry: 'Enterprise', desc: 'Corporate, serious, and stable presence.', colors: ['#111827', '#6B7280', '#9CA3AF'] },
  { id: 'theme-candy', name: 'Candy Gradient', industry: 'Creative Portfolio', desc: 'Vibrant, artistic, and playful design.', colors: ['#1E293B', '#06B6D4', '#F472B6'] },
  { id: 'theme-indigo', name: 'Indigo Night', industry: 'Freelancers', desc: 'Trust and creativity in perfect balance.', colors: ['#0F172A', '#6366F1', '#22D3EE'] },
  { id: 'theme-green', name: 'Tech Green', industry: 'Competitive Coders', desc: 'Code terminal, performance-focused look.', colors: ['#020617', '#22C55E', '#4ADE80'] }
];

const ThemeSettings = () => {
  const { theme: activeTheme, setTheme, setPreviewTheme, cancelPreview } = useContext(ThemeContext);
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedTheme, setSelectedTheme] = useState(null);

  const handleSelect = (id) => {
    setSelectedTheme(id);
    setPreviewTheme(id);
  };

  const handleSave = async () => {
    if (selectedTheme) {
      await setTheme(selectedTheme);
      setSelectedTheme(null);
      toast.success('Theme Applied Successfully');
    }
  };

  return (
    <div className="max-w-7xl pb-40">
      <header className="mb-16">
        <span className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Engineered Aesthetics</span>
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">Identity <span className="text-gradient">Discovery.</span></h2>
        <p className="text-gray-400 mt-6 text-lg font-light max-w-2xl leading-relaxed">
          The visual skin of your portfolio is a strategic choice. Select an industry-standard theme to preview, then save to deploy globally.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {themes.slice(0, visibleCount).map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleSelect(t.id)}
              className={`glass p-6 card-rounded border-2 transition-all duration-500 relative overflow-hidden group cursor-pointer ${
                (selectedTheme || activeTheme) === t.id 
                  ? 'border-primary shadow-2xl flowing-border' 
                  : 'border-white/5 hover:border-white/20'
              }`}
            >
              {/* Active Tick */}
              <div className={`absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 z-10 ${
                (selectedTheme || activeTheme) === t.id ? 'bg-primary text-black scale-100' : 'bg-white/5 text-transparent scale-0'
              }`}>
                 <span className="font-bold text-sm">✓</span>
              </div>

              {/* Viewport Preview */}
              <div className="w-full aspect-video rounded-2xl mb-8 overflow-hidden relative border border-white/10 shadow-2xl bg-[#0a0a0a]">
                  <div className="absolute inset-0 z-0" style={{ backgroundColor: t.colors[0] }} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center z-1">
                     <div className="w-24 h-4 rounded-full" style={{ background: `linear-gradient(to right, ${t.colors[1]}, ${t.colors[2]})` }} />
                     <div className="w-16 h-2 rounded-full bg-white/10" />
                     <div className="mt-4 w-12 h-5 rounded-lg shadow-lg" style={{ backgroundColor: t.colors[1] }} />
                  </div>
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-center mb-2">
                   <h3 className="text-xl font-black text-white">{t.name}</h3>
                   <div className="flex gap-1 bg-black/40 px-2 py-1 rounded-full border border-white/5">
                     {t.colors.map((c, i) => <div key={i} className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: c }} />)}
                   </div>
                </div>
                <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mb-3">{t.industry}</p>
                <p className="text-xs text-dim leading-relaxed font-medium mb-6">{t.desc}</p>
                
                <div className="flex items-center gap-4">
                    <button className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest btn-rounded transition-all ${
                      (selectedTheme || activeTheme) === t.id ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'bg-white/5 text-white hover:bg-white/10'
                    }`}>
                      { (selectedTheme || activeTheme) === t.id ? 'Preview Active' : 'Select to Preview' }
                    </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {visibleCount < themes.length && (
        <div className="mt-20 flex justify-center">
           <button 
             onClick={() => setVisibleCount(v => v + 3)}
             className="px-12 py-5 btn-rounded glass border-white/10 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-all flex items-center gap-4"
           >
              Discovery Catalog
              <span className="text-primary text-lg">↓</span>
           </button>
        </div>
      )}

      {/* Persistence Bar */}
      {selectedTheme && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] glass px-12 py-6 card-rounded border-primary shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex items-center gap-16 backdrop-blur-3xl w-max"
        >
           <div className="flex flex-col border-r border-white/10 pr-16 text-left">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">Configuration Pending</span>
              <span className="text-sm font-bold text-white italic">Deploy {themes.find(t => t.id === selectedTheme)?.name}?</span>
           </div>
           <div className="flex gap-6 items-center">
              <button 
                onClick={() => { setSelectedTheme(null); cancelPreview(); }} 
                className="text-xs font-bold text-dim hover:text-white transition-all uppercase tracking-widest border-none bg-transparent cursor-pointer"
              >
                Discard
              </button>
              <button 
                onClick={handleSave} 
                className="px-10 py-4 btn-rounded bg-primary text-black text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg border-none cursor-pointer"
              >
                Apply Globally
              </button>
           </div>
        </motion.div>
      )}
    </div>
  );
};

export default ThemeSettings;
