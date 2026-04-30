import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please add a name'] },
  email: { 
    type: String, 
    required: [true, 'Please add an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  subject: { type: String, required: [true, 'Please add a subject'] },
  message: { type: String, required: [true, 'Please add a message'] },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Message', MessageSchema);
