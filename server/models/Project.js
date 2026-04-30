import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  liveUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  techStack: [{ type: String }],
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
});

export default mongoose.model('Project', ProjectSchema);
