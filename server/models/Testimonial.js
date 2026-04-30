import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, default: 'Verified User' },
  company: { type: String, default: 'Community Member' },
  photoUrl: { type: String, default: '' },
  text: { type: String, default: 'No written comment provided.' },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  order: { type: Number, default: 0 },
  email: { type: String },
  isPublic: { type: Boolean, default: false }
});

export default mongoose.model('Testimonial', TestimonialSchema);
