import React, { useState, lazy, Suspense } from 'react';
import Sidebar from '../components/admin/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { toast } from 'react-toastify';
import useSiteMeta from '../hooks/useSiteMeta';

// Lazy Loaded Managers for Production Performance
const SiteSettings = lazy(() => import('../components/admin/managers/SiteSettings'));
const MessagesInbox = lazy(() => import('../components/admin/managers/MessagesInbox'));
const AboutEditor = lazy(() => import('../components/admin/managers/AboutEditor'));
const SkillsEditor = lazy(() => import('../components/admin/managers/SkillsEditor'));
const ExperienceEditor = lazy(() => import('../components/admin/managers/ExperienceEditor'));
const EducationEditor = lazy(() => import('../components/admin/managers/EducationEditor'));
const ProjectsManager = lazy(() => import('../components/admin/managers/ProjectsManager'));
const GalleryManager = lazy(() => import('../components/admin/managers/GalleryManager'));
const YouTubeManager = lazy(() => import('../components/admin/managers/YouTubeManager'));
const NavbarManager = lazy(() => import('../components/admin/managers/NavbarManager'));
const BannerManager = lazy(() => import('../components/admin/managers/BannerManager'));
const TestimonialsManager = lazy(() => import('../components/admin/managers/TestimonialsManager'));
const AdminOverview = lazy(() => import('../components/admin/managers/AdminOverview'));
const ThemeSettings = lazy(() => import('../components/admin/managers/ThemeSettings'));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  componentDidCatch(error, errorInfo) { console.error("Admin Module Error:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 glassmorphism rounded-xl border-red-500/50 text-center">
          <h2 className="text-xl font-bold text-red-400 mb-2">Technical Fault Detected</h2>
          <p className="text-gray-400 mb-4 text-sm">The module stream was interrupted. Please re-synchronize the session.</p>
          <button onClick={() => window.location.reload()} className="bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 px-6 py-2 rounded text-xs uppercase font-black tracking-widest hover:bg-indigo-600 hover:text-white transition-all">Re-Sync Terminal</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const AdminDashboard = () => {
  const [activeModule, setActiveModule] = useState('overview');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { siteMeta, refreshMeta } = useSiteMeta();
  const [isToggling, setIsToggling] = useState(false);
  const [adminData, setAdminData] = useState(null);

  React.useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const { data } = await api.get('/about');
      if (data.success) setAdminData(data.data);
    } catch (err) { console.error("Admin data fetch failed"); }
  };

  const toggleSwitch = async () => {
    setIsToggling(true);
    try {
      const nextState = !siteMeta?.maintenanceMode;
      const { data } = await api.put('/sitemeta', { maintenanceMode: nextState });
      if (data.success) {
        refreshMeta();
        toast.info(nextState ? "🔴 PORTFOLIO LOCKED: DATA STREAM STOPPED" : "🟢 PORTFOLIO LIVE: DATA STREAM RESTORED");
      }
    } catch (err) {
      toast.error("Critical System Error: Toggle Failed");
    } finally {
      setIsToggling(false);
    }
  };

  const renderModule = () => {
    const modules = {
      overview: <AdminOverview setActiveTab={setActiveModule} />,
      navbar: <NavbarManager />,
      hero: <BannerManager />,
      about: <AboutEditor />,
      skills: <SkillsEditor />,
      experience: <ExperienceEditor />,
      education: <EducationEditor />,
      gallery: <GalleryManager />,
      youtube: <YouTubeManager />,
      messages: <MessagesInbox />,
      projects: <ProjectsManager />,
      testimonials: <TestimonialsManager />,
      themes: <ThemeSettings />,
      settings: <SiteSettings />,
    };

    return (
      <Suspense fallback={<div className="p-10 text-primary animate-pulse font-black uppercase tracking-[0.2em] text-[10px]">Synchronizing Module Data...</div>}>
        {modules[activeModule] || <AdminOverview setActiveTab={setActiveModule} />}
      </Suspense>
    );
  };

  return (
    <div className="flex min-h-screen bg-adminMain text-gray-200 font-body relative">
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[15] lg:hidden"
          />
        )}
      </AnimatePresence>

      <Sidebar 
        activeModule={activeModule} 
        setActiveModule={(mod) => { setActiveModule(mod); setIsMobileMenuOpen(false); }} 
        isExpanded={isSidebarExpanded} 
        setIsExpanded={setIsSidebarExpanded}
        isMobileOpen={isMobileMenuOpen}
      />
      
      <main className={`flex-1 transition-all duration-300 w-full ${isSidebarExpanded ? 'lg:ml-[260px]' : 'lg:ml-[80px]'} ml-0`}>
        <header className="bg-adminBg/80 backdrop-blur-md sticky top-0 z-40 border-b border-white/5 px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsMobileMenuOpen(true)}
               className="lg:hidden w-10 h-10 rounded bg-white/5 flex items-center justify-center border border-white/10"
             >
               <span className="text-xl">☰</span>
             </button>
             <h2 className="text-sm lg:text-lg font-medium text-white capitalize truncate max-w-[150px] lg:max-w-none">
               {activeModule.replace('-', ' ')}
             </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isMaintenance ? 'text-red-500' : 'text-emerald-500'}`}>
                {isMaintenance ? 'Visibility: Locked' : 'Visibility: Live'}
              </span>
              <button 
                onClick={toggleSwitch}
                disabled={isToggling}
                className={`relative w-12 h-6 rounded-full transition-all duration-500 ${
                  isMaintenance ? 'bg-red-500/20 border-red-500' : 'bg-emerald-500/20 border-emerald-500'
                } border cursor-pointer p-0.5`}
              >
                <motion.div 
                  animate={{ x: isMaintenance ? 24 : 0 }}
                  className={`w-4.5 h-4.5 rounded-full ${isMaintenance ? 'bg-red-500' : 'bg-emerald-500'}`}
                />
              </button>
            </div>
            <div className="h-4 w-[1px] bg-white/10" />
            
            {/* Persistent Admin Profile Header */}
            <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setActiveModule('about')}>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-white uppercase tracking-tighter leading-none">{adminData?.name || 'Admin'}</span>
                <span className="text-[8px] text-primary font-bold uppercase tracking-widest leading-none mt-1">Identity Node</span>
              </div>
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 group-hover:border-primary transition-colors">
                <img 
                  src={adminData?.profilePhotoUrl ? (adminData.profilePhotoUrl.startsWith('http') ? adminData.profilePhotoUrl : `${process.env.REACT_APP_API_URL?.replace('/api', '')}/${adminData.profilePhotoUrl}`) : 'https://via.placeholder.com/100'} 
                  alt="Admin" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="h-4 w-[1px] bg-white/10" />
            <button 
              onClick={() => window.open('/', '_blank')}
              className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all"
            >
              Preview Hub
            </button>
          </div>
        </header>
        
        <motion.div 
          key={activeModule}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-4"
        >
          <ErrorBoundary key={activeModule}>
            {renderModule()}
          </ErrorBoundary>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;
