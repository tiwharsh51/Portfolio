import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import api from '../../utils/api';
import { ThemeContext } from '../../context/ThemeContext';
import Button from '../common/Button';

const Navbar = () => {
  const [navData, setNavData] = useState(null);
  const [aboutData, setAboutData] = useState(null);
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isPreviewing, cancelPreview } = useContext(ThemeContext);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setHidden(true);
      setMobileMenuOpen(false);
    } else {
      setHidden(false);
    }
    setScrolled(latest > 50);
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [nav, about] = await Promise.all([
          api.get('/navbar'),
          api.get('/about')
        ]);
        setNavData(nav.data.data);
        setAboutData(about.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const resolveUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/100x100';
    if (url.startsWith('http')) return url;
    const baseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
    return `${baseUrl}/${url.replace(/\\/g, '/')}`;
  };

  const navLinks = [
    { name: 'Work', href: '#projects' },
    { name: 'Narrative', href: '#about' },
    { name: 'Arsenal', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Echoes', href: '#testimonials' }
  ];

  return (
    <>
      <AnimatePresence>
        {isPreviewing && (
          <motion.div 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-0 left-0 w-full z-[1001] bg-primary text-black py-2 px-6 flex justify-between items-center shadow-2xl"
          >
             <span className="text-[10px] font-black uppercase tracking-[0.5em]">Identity Preview Node Active</span>
             <Button
               onClick={cancelPreview}
               className="bg-black/10 hover:bg-black/20 px-4 py-1 btn-rounded text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border-none"
             >
               Discard Preview
             </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.nav
        variants={{
          visible: { y: isPreviewing ? 40 : 0 },
          hidden: { y: "-150%" }
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl transition-all duration-500 ${isPreviewing ? 'top-12' : 'top-6'}`}
      >
        <div 
          className={`flex items-center justify-between px-8 py-4 glass transition-all card-rounded ${
            scrolled ? 'bg-surface/80 shadow-2xl border-glass-border' : 'bg-transparent border-transparent'
          }`}
        >
          <a href="#" className="flex items-center gap-4 group">
            <div className="relative">
              <div className="w-10 h-10 overflow-hidden border-2 border-primary/20 group-hover:border-primary transition-all rounded-full">
                <img 
                  src={resolveUrl(aboutData?.profilePhotoUrl)} 
                  alt="Admin" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-surface rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] leading-none mb-1">
                Welcome Back
              </span>
              <span className="text-sm font-black text-heading tracking-tighter uppercase leading-none">
                {aboutData?.name?.split(' ')[0] || 'Admin'}<span className="text-primary">.</span>
              </span>
            </div>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-xs font-bold text-dim hover:text-heading uppercase tracking-[0.2em] transition-all relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-primary transition-all duration-500 group-hover:w-full"></span>
              </a>
            ))}
            
            <a 
              href="#contact" 
              className="px-6 py-2 bg-heading text-surface text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl shadow-black/5 btn-rounded"
            >
              Contact
            </a>
          </div>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-heading w-10 h-10 flex items-center justify-center bg-glass-bg border border-glass-border btn-rounded"
          >
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {mobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </>
                )}
             </svg>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 md:hidden bg-surface/95 backdrop-blur-2xl flex flex-col items-center justify-center p-10"
          >
             <div className="flex flex-col items-center gap-12 text-center w-full">
                <div className="flex flex-col items-center gap-4 mb-8">
                   <div 
                     className="w-24 h-24 overflow-hidden border-4 border-primary/20 shadow-2xl rounded-full"
                   >
                      <img src={resolveUrl(aboutData?.profilePhotoUrl)} alt="Admin" className="w-full h-full object-cover rounded-full" />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-1">Portfolio of</span>
                      <h3 className="text-3xl font-black text-heading tracking-tighter uppercase">{aboutData?.name || 'Admin'}</h3>
                   </div>
                </div>

                <div className="flex flex-col gap-8 w-full max-w-xs">
                   {navLinks.map((link) => (
                     <a 
                       key={link.name} 
                       href={link.href} 
                       onClick={() => setMobileMenuOpen(false)}
                       className="text-2xl font-bold text-heading tracking-tighter hover:text-primary transition-colors border-b border-glass-border pb-4"
                     >
                       {link.name}
                     </a>
                   ))}
                   <a 
                     href="#contact" 
                     onClick={() => setMobileMenuOpen(false)}
                     className="btn-primary w-full py-4 btn-rounded"
                   >
                     Initiate Contact
                   </a>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default React.memo(Navbar);
