import mongoose from 'mongoose';

const YouTubeVideoSchema = new mongoose.Schema({
  videoId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  thumbnailUrl: { type: String, required: true },
  order: { type: Number, default: 0 }
});

export default mongoose.model('YouTubeVideo', YouTubeVideoSchema);
