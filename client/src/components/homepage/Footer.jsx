import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const Footer = () => {
  const [siteMeta, setSiteMeta] = useState(null);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const { data } = await api.get('/sitemeta');
        setSiteMeta(data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMeta();
  }, []);

  return (
    <footer className="bg-surface py-24 relative overflow-hidden border-t border-glass-border">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-16">
          
          <div className="max-w-sm">
            <span className="text-2xl font-bold text-heading tracking-tighter uppercase mb-6 block">
              {siteMeta?.siteTitle || 'Portfolio'}<span className="text-primary">.</span>
            </span>
            <p className="text-dim text-sm leading-relaxed mb-8">
              {siteMeta?.metaDescription || 'Engineering high-performance digital products with a focus on visual excellence and technical mastery.'}
            </p>
            <div className="text-xs font-bold text-dim uppercase tracking-widest opacity-60">
               &copy; {new Date().getFullYear()} {siteMeta?.copyrightName || 'All Rights Reserved'}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
             <div>
                <h4 className="text-heading font-bold text-xs uppercase tracking-widest mb-6">Navigation</h4>
                <ul className="space-y-4 text-dim text-xs font-medium uppercase tracking-wider">
                   <li><a href="#projects" className="hover:text-primary transition-colors">Work</a></li>
                   <li><a href="#about" className="hover:text-primary transition-colors">Narrative</a></li>
                   <li><a href="#skills" className="hover:text-primary transition-colors">Arsenal</a></li>
                   <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
                </ul>
             </div>
             <div>
                <h4 className="text-heading font-bold text-xs uppercase tracking-widest mb-6">System</h4>
                <ul className="space-y-4 text-dim text-xs font-medium uppercase tracking-wider">
                   <li><a href="/admin/login" className="hover:text-primary transition-colors">Admin Access</a></li>
                   <li><a href="/sitemap.xml" className="hover:text-primary transition-colors">Sitemap</a></li>
                </ul>
             </div>
             {siteMeta?.footerText && (
               <div className="col-span-2 md:col-span-1">
                  <h4 className="text-heading font-bold text-xs uppercase tracking-widest mb-6">Deployment</h4>
                  <p className="text-dim text-xs font-mono uppercase tracking-[0.2em] leading-loose">
                     {siteMeta.footerText}
                  </p>
               </div>
             )}
          </div>
        </div>

        {/* Footer bottom strip removed as requested */}
      </div>
      
      {/* Background Ornament */}
      <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
    </footer>
  );
};

export default Footer;
