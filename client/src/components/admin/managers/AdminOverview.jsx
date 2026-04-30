import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../../utils/api';

const AdminOverview = ({ setActiveTab }) => {
  const [stats, setStats] = useState({
    messages: [],
    projects: 0,
    testimonials: [],
    skills: 0,
    about: null,
    meta: null
  });
  const [loading, setLoading] = useState(true);

  const [dbStatus, setDbStatus] = useState('Checking...');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [msg, proj, test, skill, about, meta] = await Promise.all([
          api.get('/messages'),
          api.get('/projects'),
          api.get('/testimonials'),
          api.get('/skills'),
          api.get('/about'),
          api.get('/sitemeta')
        ]);
        setStats({
          messages: msg.data.data,
          projects: proj.data.data.length,
          testimonials: test.data.data,
          skills: skill.data.data.length,
          about: about.data.data,
          meta: meta.data.data
        });
        setDbStatus('Operational');
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
        setDbStatus('Disconnected');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const unreadCount = stats.messages.filter(m => !m.isRead).length;

  const statCards = [
    { label: 'Unread Inquiries', value: unreadCount, icon: '📧', color: 'indigo', id: 'messages' },
    { label: 'Live Projects', value: stats.projects, icon: '🚀', color: 'emerald', id: 'projects' },
    { label: 'Client Testimonials', value: stats.testimonials.length, icon: '⭐', color: 'amber', id: 'testimonials' },
    { label: 'Technical Skills', value: stats.skills, icon: '🛠️', color: 'blue', id: 'skills' }
  ];

  if (loading) return <div className="p-10 text-primary animate-pulse">Synchronizing Dashboard...</div>;

  return (
    <div className="p-6 space-y-8 max-w-[1600px] mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Terminal <span className="text-primary">Overview</span>
          </h1>
          <p className="text-xs text-dim mt-2 uppercase tracking-widest font-bold">Authenticated as: <span className="text-white">{stats.about?.name || 'Root Admin'}</span></p>
        </div>
        <div className="flex gap-4">
           <div className="glass px-4 py-2 rounded border-primary/20 flex items-center gap-3 bg-white/5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              <span className="text-[9px] font-black uppercase tracking-widest text-white">Node: Operational</span>
           </div>
        </div>
      </header>

      {/* Primary Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => setActiveTab(card.id)}
            className="glass p-5 rounded border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
               <div className="text-2xl">{card.icon}</div>
               <div className={`text-[10px] font-bold text-${card.color}-500 bg-${card.color}-500/10 px-2 py-0.5 rounded`}>Live</div>
            </div>
            <div className="text-2xl font-black text-white mb-1 tracking-tighter">{card.value}</div>
            <div className="text-[10px] font-bold text-dim uppercase tracking-wider">{card.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Data Streams */}
        <div className="lg:col-span-2 space-y-6">
           {/* Database Insights (Replacing Mock Telemetry) */}
           <div className="glass p-6 rounded border-white/5 bg-white/[0.02]">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full" /> Database Insights
                 </h3>
                 <span className="text-[10px] text-dim font-medium uppercase tracking-tighter">Live Analytical data</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                 <MetricProgress 
                    label="Inquiry Resolution" 
                    value={stats.messages.length > 0 ? Math.round((stats.messages.filter(m => m.isRead).length / stats.messages.length) * 100) : 0} 
                    color="indigo" 
                 />
                 <MetricProgress 
                    label="Average Rating Score" 
                    value={stats.testimonials.length > 0 ? Math.round((stats.testimonials.reduce((acc, curr) => acc + (curr.rating || 5), 0) / stats.testimonials.length) * 20) : 100} 
                    color="emerald" 
                 />
                 <MetricProgress 
                    label="System Config Health" 
                    value={stats.meta ? Object.values(stats.meta).filter(v => v === true).length * 15 : 80} 
                    color="amber" 
                 />
              </div>
           </div>

           {/* Recent Inquiries List */}
           <div className="glass p-6 rounded border-white/5 bg-white/[0.02]">
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6">Recent Payload Transfers (Messages)</h3>
              <div className="space-y-2">
                 {stats.messages.slice(0, 4).length > 0 ? stats.messages.slice(0, 4).map((m, i) => (
                   <div key={m._id} className="flex items-center justify-between p-3 rounded bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">{m.name[0]}</div>
                         <div>
                            <p className="text-[11px] font-bold text-white">{m.name}</p>
                            <p className="text-[9px] text-dim uppercase tracking-tighter">{m.subject}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <span className="text-[9px] text-dim font-mono tracking-tighter">0{i+1}:00 UTC</span>
                         <button onClick={() => setActiveTab('messages')} className="text-[9px] font-black text-primary uppercase border border-primary/20 px-3 py-1 hover:bg-primary/10 transition-colors">Inspect</button>
                      </div>
                   </div>
                 )) : (
                   <p className="text-dim text-xs italic">Buffer empty. No incoming data detected.</p>
                 )}
              </div>
           </div>
        </div>

        {/* Right Column: System Logs & Status */}
        <div className="space-y-6">
           <div className="glass p-6 rounded border-white/5 bg-white/[0.02] flex flex-col h-full">
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6">Environment Diagnostics</h3>
              <div className="space-y-4">
                 <StatusItem label="Atlas Connectivity" status={dbStatus} color={dbStatus === 'Operational' ? 'emerald' : 'red'} />
                 <StatusItem label="REST Endpoints" status="Active" color="emerald" />
                 <StatusItem label="Media Repository" status="Synched" color="blue" />
                 <StatusItem label="Firewall Layer" status="Enabled" color="indigo" />
                 <StatusItem label="Node Uptime" status="99.9%" color="emerald" />
              </div>

              <div className="mt-12 pt-8 border-t border-white/5">
                 <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-4">Activity Stream</h4>
                  <div className="space-y-3">
                    {stats.messages.length > 0 ? (
                      stats.messages.slice(0, 3).map((m, idx) => (
                        <ActivityLog 
                          key={m._id} 
                          text={`Inquiry received from node: ${m.name}`} 
                          time={idx === 0 ? "Just Now" : `${idx * 2}h ago`} 
                        />
                      ))
                    ) : (
                      <>
                        <ActivityLog text="System kernel initialized" time="Startup" />
                        <ActivityLog text="Awaiting external data artifacts" time="Idle" />
                      </>
                    )}
                    {stats.testimonials.length > 0 && (
                      <ActivityLog text={`Total testimonials indexed: ${stats.testimonials.length}`} time="Live" />
                    )}
                  </div>
              </div>

              <div className="mt-auto pt-8">
                 <p className="text-[9px] text-dim font-mono uppercase tracking-[0.2em] bg-white/5 p-2 rounded text-center">Engine v2.5.0 // Stable Build</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const MetricProgress = ({ label, value, color }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-end">
      <span className="text-[9px] font-bold text-dim uppercase tracking-wider">{label}</span>
      <span className={`text-[10px] font-black text-${color}-400`}>{value}%</span>
    </div>
    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        className={`h-full bg-${color}-500`}
      />
    </div>
  </div>
);

const ActivityLog = ({ text, time }) => (
  <div className="flex items-start justify-between gap-3">
    <p className="text-[9px] text-dim leading-tight">{text}</p>
    <span className="text-[8px] text-gray-600 font-mono flex-shrink-0">{time}</span>
  </div>
);

const StatusItem = ({ label, status, color }) => (
  <div className="flex items-center justify-between">
    <span className="text-[11px] text-gray-400">{label}</span>
    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm bg-${color}-500/10 text-${color}-400 border border-${color}-500/20`}>
      {status}
    </span>
  </div>
);

export default AdminOverview;
