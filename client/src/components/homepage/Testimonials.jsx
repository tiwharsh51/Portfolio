import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import ReviewForm from './ReviewForm';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [meta, setMeta] = useState(null);

  const fetchData = async () => {
    try {
      const [testRes, metaRes] = await Promise.all([
        api.get('/testimonials'),
        api.get('/sitemeta')
      ]);
      setTestimonials(testRes.data.data);
      if (metaRes.data.success) setMeta(metaRes.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [showAll, setShowAll] = useState(false);
  const displayedTestimonials = showAll ? testimonials : testimonials.slice(0, 3);

  return (
    <section id="testimonials" className="section-padding bg-surface relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-8xl font-black text-heading mb-8 tracking-tighter">
               {meta?.testimonialsTitle ? (
                 <>
                   {meta.testimonialsTitle.split(' ').slice(0, -1).join(' ')}{' '}
                   <span className="text-gradient">{meta.testimonialsTitle.split(' ').slice(-1)}</span>
                 </>
               ) : (
                 <>Trusted <span className="text-gradient">Voices.</span></>
               )}
            </h2>
            <p className="text-main text-xl md:text-2xl leading-relaxed font-light">
               {meta?.testimonialsSubtitle || 'Honest feedback from collaborators and clients who have witnessed the impact of my technical contributions.'}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedTestimonials.map((test, index) => (
            <motion.div
              key={test._id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass p-8 md:p-12 relative flex flex-col justify-between group card-rounded"
            >
              <div className="mb-10">
                 <div className="flex justify-between items-start mb-4">
                    <div className="text-5xl text-primary/10 font-serif leading-none">“</div>
                    <div className="flex text-amber-400 text-sm">
                      {'★'.repeat(test.rating || 5)}{'☆'.repeat(5 - (test.rating || 5))}
                    </div>
                 </div>
                 <p className="text-main text-base leading-relaxed italic">
                    {test.comment || test.text}
                 </p>
              </div>
              
              <div className="flex items-center gap-4 pt-8 border-t border-glass-border">
                <div className="w-14 h-14 rounded bg-white/5 overflow-hidden border border-white/5 group-hover:border-primary/50 transition-colors">
                  {test.photoUrl || test.avatarUrl ? (
                    <img src={test.photoUrl || test.avatarUrl} alt={test.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">👤</div>
                  )}
                </div>
                <div className="flex flex-col">
                  <h4 className="text-lg font-bold text-white">{test.name}</h4>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">
                    {test.role} {test.company && `@ ${test.company}`}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {testimonials.length > 3 && (
          <div className="mt-12 text-center">
            <button 
              onClick={() => setShowAll(!showAll)}
              className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 hover:text-primary transition-colors py-4 border-b border-white/10"
            >
              {showAll ? 'Collapse History' : `Analyze ${testimonials.length - 3} More Reviews`}
            </button>
          </div>
        )}

        {meta?.enablePublicReviews && (
          <ReviewForm onReviewSubmitted={fetchData} />
        )}
      </div>
    </section>
  );
};

export default Testimonials;
