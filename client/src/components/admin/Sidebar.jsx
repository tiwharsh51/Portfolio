import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const Sidebar = ({ activeModule, setActiveModule, isExpanded, setIsExpanded, isMobileOpen }) => {
  const { admin, logout } = useContext(AuthContext);
  const [meta, setMeta] = useState(null);

  const fetchMeta = async () => {
    try {
      const { data } = await api.get('/sitemeta');
      if (data.success) setMeta(data.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchMeta();
  }, []);

  const toggleVisibility = async (field, currentValue) => {
    try {
      const { data } = await api.put('/sitemeta', { [field]: !currentValue });
      if (data.success) {
        setMeta(data.data);
        toast.info(`${field.replace('show', '')} Visibility Synchronized`);
      }
    } catch (err) {
      toast.error('Sync Error');
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination || !meta) return;
    
    const items = Array.from(meta.sectionOrder || ['hero', 'projects', 'about', 'skills', 'experience', 'gallery', 'testimonials', 'youtube']);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    try {
      const { data } = await api.put('/sitemeta', { sectionOrder: items });
      if (data.success) {
        setMeta(data.data);
        toast.success('Section Hierarchy Updated');
      }
    } catch (err) { toast.error('Hierarchy Sync Failed'); }
  };

  // Memoized navigation items to prevent unnecessary re-calculations
  const { orderedManagementItems, engagementItems } = React.useMemo(() => {
    const baseNavItems = [
      { id: 'navbar', label: 'Navigation', icon: '🧭' },
      { id: 'hero', label: 'Hero / Banner', icon: '🖼️', toggle: 'showHero' },
      { id: 'about', label: 'About Me', icon: '👤', toggle: 'showAbout' },
      { id: 'skills', label: 'Skills Graph', icon: '🛠️', toggle: 'showSkills' },
      { id: 'experience', label: 'Work History', icon: '💼', toggle: 'showExperience' },
      { id: 'education', label: 'Education', icon: '🎓', toggle: 'showEducation' },
      { id: 'projects', label: 'Portfolios', icon: '🚀', toggle: 'showProjects' },
      { id: 'gallery', label: 'Media Gallery', icon: '📸', toggle: 'showGallery' },
      { id: 'youtube', label: 'Videos', icon: '▶️', toggle: 'showVideos' },
      { id: 'testimonials', label: 'Reviews', icon: '⭐', toggle: 'showTestimonials' },
    ];

    const ordered = (meta?.sectionOrder || ['hero', 'projects', 'about', 'skills', 'experience', 'gallery', 'testimonials', 'youtube'])
      .map(id => baseNavItems.find(item => item.id === id))
      .filter(Boolean);

    const engagement = [
      { id: 'messages', label: 'Inquiries', icon: '✉️' },
      { id: 'settings', label: 'Settings', icon: '⚙️' },
      { id: 'themes', label: 'Themes', icon: '🎨' },
    ];

    return { orderedManagementItems: ordered, engagementItems: engagement };
  }, [meta?.sectionOrder]);

  return (
    <motion.aside 
      initial={false}
      animate={{ 
        width: isExpanded ? 260 : 80,
        x: isMobileOpen ? 0 : (window.innerWidth < 1024 ? -260 : 0)
      }}
      className={`h-screen fixed left-0 top-0 bg-adminMain/95 backdrop-blur-xl border-r border-white/5 flex flex-col z-[30] shadow-2xl transition-all duration-300 lg:translate-x-0 ${isMobileOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full lg:translate-x-0'}`}
      style={{ width: (window.innerWidth < 1024 && isMobileOpen) ? '260px' : undefined }}
    >
      <div className={`p-6 border-b border-white/5 flex items-center ${isExpanded ? 'justify-between' : 'justify-center'}`}>
        <AnimatePresence mode="wait">
          {(isExpanded || isMobileOpen) ? (
            <motion.div 
              key="expanded-logo"
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-sm">💎</span>
              </div>
              <div>
                <h1 className="text-sm font-black text-white tracking-tighter leading-none">ADMIN</h1>
                <p className="text-[8px] text-indigo-400 font-bold tracking-[0.2em] mt-0.5 uppercase whitespace-nowrap">Control Node</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="collapsed-logo"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg"
            >
              <span className="text-sm">💎</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {isExpanded && !isMobileOpen && (
           <button 
             onClick={() => setIsExpanded(false)}
             className="hidden lg:block text-gray-500 hover:text-white p-1 hover:bg-white/5 rounded transition-all"
             title="Collapse Sidebar"
           >
             <span className="text-sm">«</span>
           </button>
        )}
        {!isExpanded && !isMobileOpen && (
           <button 
             onClick={() => setIsExpanded(true)}
             className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-indigo-600 rounded-full items-center justify-center text-[10px] shadow-xl border border-white/10 hover:scale-110 transition-transform"
             title="Expand Sidebar"
           >
             »
           </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-6 custom-scrollbar px-3">
        <ul className="space-y-1">
          {navItems.map((item, idx) => (
            item.type === 'divider' ? (
              (isExpanded || isMobileOpen) && (
                <li key={`div-${idx}`} className="pt-6 pb-2 px-4">
                  <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{item.label}</span>
                </li>
              )
            ) : (
              <li key={item.id} className="relative group/item">
                <button
                  onClick={() => setActiveModule(item.id)}
                  className={`w-full flex items-center ${(isExpanded || isMobileOpen) ? 'gap-4 px-4' : 'justify-center px-0'} py-3 rounded-xl transition-all duration-300 group ${
                    activeModule === item.id 
                      ? 'bg-indigo-600/20 text-white border-l-4 border-indigo-500 shadow-inner' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
                  }`}
                >
                  <span className={`text-xl transition-transform duration-300 group-hover:scale-110 ${activeModule === item.id ? 'grayscale-0' : 'grayscale'}`}>
                    {item.icon}
                  </span>
                  <AnimatePresence>
                    {(isExpanded || isMobileOpen) && (
                      <motion.span 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="text-xs font-bold tracking-tight whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>

                {item.toggle && meta && (isExpanded || isMobileOpen) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleVisibility(item.toggle, meta[item.toggle]);
                    }}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 w-7 h-3.5 rounded-full transition-all border ${
                      meta[item.toggle] ? 'bg-indigo-500 border-indigo-500' : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <motion.div 
                      animate={{ x: meta[item.toggle] ? 14 : 0 }} 
                      className="w-2.5 h-2.5 bg-white rounded-full m-0.5 shadow-sm" 
                    />
                  </button>
                )}
              </li>
            )
          ))}
        </ul>
      </div>

      <div className={`p-4 border-t border-white/5 bg-adminMain/50 ${( !isExpanded && !isMobileOpen ) ? 'flex flex-col items-center' : ''}`}>
        {(isExpanded || isMobileOpen) && (
           <div className="flex items-center gap-3 mb-6 bg-white/5 p-3 rounded-2xl border border-white/5">
             <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-sm font-bold text-indigo-400 border border-indigo-500/20">
               {admin?.email?.charAt(0).toUpperCase()}
             </div>
             <div className="overflow-hidden">
               <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">System Admin</p>
               <p className="text-[10px] text-gray-300 font-medium truncate">{admin?.email}</p>
             </div>
           </div>
        )}
        <button
          onClick={logout}
          className={`flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-3 rounded-xl transition-all duration-300 text-[10px] font-black uppercase tracking-widest border border-red-500/20 ${(isExpanded || isMobileOpen) ? 'w-full' : 'w-10 h-10'}`}
        >
          {(isExpanded || isMobileOpen) ? <span>🚪 Exit Session</span> : <span>🚪</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
