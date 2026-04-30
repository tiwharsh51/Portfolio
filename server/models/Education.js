import mongoose from 'mongoose';

const EducationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  field: { type: String, required: true },
  startYear: { type: String, required: true },
  endYear: { type: String, required: true },
  grade: { type: String, default: '' },
  logoUrl: { type: String, default: '' },
  certificateUrl: { type: String, default: '' },
  type: { 
    type: String, 
    enum: ['Degree', 'Certification', 'Course'],
    default: 'Degree'
  },
  order: { type: Number, default: 0 }
});

export default mongoose.model('Education', EducationSchema);
