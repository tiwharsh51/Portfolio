import mongoose from 'mongoose';

const ExperienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, default: 'Present' },
  isCurrent: { type: Boolean, default: false },
  description: { type: String, required: true },
  logoUrl: { type: String, default: '' },
  techStack: [{ type: String }],
  order: { type: Number, default: 0 }
});

export default mongoose.model('Experience', ExperienceSchema);
