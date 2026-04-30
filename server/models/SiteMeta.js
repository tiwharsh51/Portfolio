import mongoose from 'mongoose';

const SiteMetaSchema = new mongoose.Schema({
  siteTitle: { type: String, default: 'My Portfolio' },
  faviconUrl: { type: String, default: '' },
  primaryColor: { type: String, default: '#6366f1' },
  accentColor: { type: String, default: '#f59e0b' },
  metaDescription: { type: String, default: 'Welcome to my portfolio' },
  googleMapsApiKey: { type: String, default: '' },
  maintenanceMode: { type: Boolean, default: false },
  contactFormEnabled: { type: Boolean, default: true },
  footerText: { type: String, default: 'All rights reserved.' },
  copyrightName: { type: String, default: 'Portfolio Owner' },
  phoneNumber: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  youtubeChannelName: { type: String, default: '' },
  youtubeChannelUrl: { type: String, default: '' },
  theme: { 
    type: String, 
    default: 'theme-midnight',
    enum: ['theme-midnight', 'theme-minimal', 'theme-sunset', 'theme-glass', 'theme-royal']
  },
  testimonialsTitle: { type: String, default: 'Trusted Voices.' },
  testimonialsSubtitle: { type: String, default: 'Honest feedback from collaborators and clients who have witnessed the impact of my technical contributions.' },
  enablePublicReviews: { type: Boolean, default: false },
  // Visibility Toggles
  showHero: { type: Boolean, default: true },
  showAbout: { type: Boolean, default: true },
  showSkills: { type: Boolean, default: true },
  showExperience: { type: Boolean, default: true },
  showEducation: { type: Boolean, default: true },
  showProjects: { type: Boolean, default: true },
  showGallery: { type: Boolean, default: true },
  showVideos: { type: Boolean, default: true },
  showTestimonials: { type: Boolean, default: true },
  sectionOrder: { 
    type: [String], 
    default: ['hero', 'projects', 'about', 'skills', 'experience', 'gallery', 'testimonials', 'youtube'] 
  }
});

export default mongoose.model('SiteMeta', SiteMetaSchema);
