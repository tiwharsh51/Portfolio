import mongoose from 'mongoose';

const NavbarSchema = new mongoose.Schema({
  brandName: { type: String, default: 'My Portfolio' },
  logoUrl: { type: String, default: '' },
  links: [{
    label: String,
    href: String,
    order: Number,
    _id: false
  }],
  showSocials: { type: Boolean, default: true },
  socialLinks: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
    youtube: { type: String, default: '' }
  }
});

export default mongoose.model('Navbar', NavbarSchema);
