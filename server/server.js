import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import connectDB from './config/db.js';

// Route files
import authRoutes from './routes/auth.js';
import navbarRoutes from './routes/navbar.js';
import heroRoutes from './routes/hero.js';
import aboutRoutes from './routes/about.js';
import skillsRoutes from './routes/skills.js';
import experienceRoutes from './routes/experience.js';
import educationRoutes from './routes/education.js';
import galleryRoutes from './routes/gallery.js';
import youtubeRoutes from './routes/youtube.js';
import messagesRoutes from './routes/messages.js';
import projectsRoutes from './routes/projects.js';
import testimonialsRoutes from './routes/testimonials.js';
import sitemetaRoutes from './routes/sitemeta.js';
import uploadRoutes from './routes/upload.js';

// Connect to database
connectDB();

const app = express();

// Global Middleware
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow images from this server to be loaded in the browser
}));
// CORS: allow only origins defined in environment (allow localhost for dev)
const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:5173'].filter(Boolean);
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: This origin is not allowed'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files with absolute path
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// In production, serve the built client (Vite build output)
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (process.env.NODE_ENV === 'production' && fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/navbar', navbarRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/youtube', youtubeRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/sitemeta', sitemetaRoutes);
app.use('/api/upload', uploadRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
