import React from 'react';
import { motion } from 'framer-motion';

/**
 * SectionHeader: Standardized header for homepage sections.
 * Ensures consistent spacing, typography, and animations.
 */
const SectionHeader = ({ title, subtitle, align = 'left', className = '' }) => {
  const isCenter = align === 'center';
  
  return (
    <div className={`mb-12 ${isCenter ? 'text-center mx-auto max-w-3xl' : ''} ${className}`}>
      <motion.div
        initial={{ opacity: 0, x: isCenter ? 0 : -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
          {title.split(' ').map((word, i) => (
            <span key={i} className={i === title.split(' ').length - 1 ? 'text-primary' : ''}>
              {word}{' '}
            </span>
          ))}
        </h2>
        {subtitle && (
          <p className="text-gray-400 text-lg leading-relaxed font-medium">
            {subtitle}
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default SectionHeader;
