import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import Input from '../common/Input';
import Button from '../common/Button';

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/messages', formData);
      toast.success('Transmission successful. I will respond shortly.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Transmission failed. System error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-surface relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-primary font-bold text-xs uppercase tracking-[0.4em] mb-6 block">Communication</span>
            <h2 className="text-4xl md:text-7xl font-bold text-heading mb-10 tracking-tighter leading-none">
              Initiate <br /> <span className="text-gradient">Contact.</span>
            </h2>
            <p className="text-dim text-lg leading-relaxed max-w-md mb-12">
               Have a technical challenge or a product vision? Let's discuss how we can engineer a solution together.
            </p>
            
            <div className="space-y-10">
               {/* Social Nodes */}
               <div className="grid grid-cols-1 gap-6">
                   {siteMeta?.phoneNumber && (
                    <a 
                      href={`https://wa.me/${siteMeta.phoneNumber}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-6 group glass p-4 border-glass-border hover:border-emerald-500/30 transition-all btn-rounded"
                    >
                       <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.41-8.412"/></svg>
                       </div>
                       <div>
                          <p className="text-[10px] font-bold text-dim uppercase tracking-widest mb-1">WhatsApp</p>
                          <p className="text-heading font-bold tracking-tight">Direct Messaging Node</p>
                       </div>
                    </a>
                  )}

                  {siteMeta?.linkedinUrl && (
                    <a 
                      href={siteMeta.linkedinUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-6 group glass p-4 border-glass-border hover:border-blue-500/30 transition-all btn-rounded"
                    >
                       <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                       </div>
                       <div>
                          <p className="text-[10px] font-bold text-dim uppercase tracking-widest mb-1">LinkedIn</p>
                          <p className="text-heading font-bold tracking-tight">Professional Network</p>
                       </div>
                    </a>
                  )}

                  {siteMeta?.githubUrl && (
                    <a 
                      href={siteMeta.githubUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-6 group glass p-4 border-glass-border hover:border-white/20 transition-all btn-rounded"
                    >
                       <div className="w-12 h-12 rounded-xl bg-glass-bg flex items-center justify-center text-heading group-hover:scale-110 transition-transform">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                       </div>
                       <div>
                          <p className="text-[10px] font-bold text-dim uppercase tracking-widest mb-1">GitHub</p>
                          <p className="text-heading font-bold tracking-tight">Technical Repository</p>
                       </div>
                    </a>
                  )}
               </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <form 
              onSubmit={handleSubmit} 
              className="glass p-10 md:p-14 space-y-8 border-primary/10 card-rounded"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Input
                  label="Identity"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your Name"
                  className="w-full bg-glass-bg border border-glass-border px-6 py-4 outline-none focus:border-primary/50 transition-all text-heading font-medium btn-rounded"
                />
                <Input
                  label="Digital Address"
                  id="email"
                  as="input"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Email"
                  className="w-full bg-glass-bg border border-glass-border px-6 py-4 outline-none focus:border-primary/50 transition-all text-heading font-medium btn-rounded"
                />
              </div>
              
              <Input
                label="Purpose"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="Subject"
                className="w-full bg-glass-bg border border-glass-border px-6 py-4 outline-none focus:border-primary/50 transition-all text-heading font-medium btn-rounded"
              />

              <Input
                label="Message Payload"
                id="message"
                as="textarea"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Tell me about your project..."
                className="w-full bg-glass-bg border border-glass-border px-6 py-5 outline-none focus:border-primary/50 transition-all text-heading font-medium h-40 resize-none btn-rounded"
              />
              
              <Button
                type="submit"
                as="button"
                disabled={loading}
                className="btn-primary w-full py-5 text-xs uppercase tracking-[0.4em] font-black btn-rounded"
              >
                {loading ? 'Transmitting...' : 'Send Signal'}
              </Button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ContactForm;
