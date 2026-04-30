import mongoose from 'mongoose';

const HeroSchema = new mongoose.Schema({
  slides: [{
    imageUrl: { type: String, required: true },
    caption: { type: String, required: true },
    subCaption: { type: String, default: '' },
    ctaText: { type: String, default: 'View Work' },
    ctaLink: { type: String, default: '#projects' },
    order: { type: Number, default: 0 }
  }],
  autoSlideInterval: { type: Number, default: 4 }
});

export default mongoose.model('Hero', HeroSchema);
