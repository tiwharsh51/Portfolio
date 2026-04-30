import mongoose from 'mongoose';

const AboutSchema = new mongoose.Schema({
  name: { type: String, default: 'Your Name' },
  tagline: { type: String, default: 'A little about me' },
  bio: { type: String, default: '<p>Welcome to my portfolio.</p>' }, // HTML from rich text editor
  profilePhotoUrl: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
  yearsOfExperience: { type: Number, default: 0 },
  projectsCompleted: { type: Number, default: 0 },
  happyClients: { type: Number, default: 0 }
});

export default mongoose.model('About', AboutSchema);
