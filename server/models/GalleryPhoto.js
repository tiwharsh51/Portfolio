import mongoose from 'mongoose';

const GalleryPhotoSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  caption: { type: String, default: '' },
  category: { type: String, default: 'All' },
  order: { type: Number, default: 0 }
});

export default mongoose.model('GalleryPhoto', GalleryPhotoSchema);
