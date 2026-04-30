import React from 'react';
import { motion } from 'framer-motion';

/**
 * GlassCard: A reusable glassmorphism container.
 * Maintains the premium look across the dashboard and site.
 */
const GlassCard = ({ children, className = '', hoverEffect = false, ...props }) => {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -5, backgroundColor: 'rgba(255, 255, 255, 0.05)' } : {}}
      className={`glass rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-md transition-all ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
