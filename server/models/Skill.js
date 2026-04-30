import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'Other'],
    required: true
  },
  level: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Expert'],
    default: 'Intermediate'
  },
  icon: { type: String, default: '' }, // emoji or URL
  connections: [{ type: String }],     // related skill names (for graph lines)
  order: { type: Number, default: 0 }
});

export default mongoose.model('Skill', SkillSchema);
