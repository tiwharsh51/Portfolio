import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SiteMeta from './models/SiteMeta.js';
import Hero from './models/Hero.js';
import About from './models/About.js';
import Skill from './models/Skill.js';
import Experience from './models/Experience.js';
import Education from './models/Education.js';
import Project from './models/Project.js';
import YouTubeVideo from './models/YouTubeVideo.js';
import Testimonial from './models/Testimonial.js';
import Message from './models/Message.js';
import Navbar from './models/Navbar.js';
import GalleryPhoto from './models/GalleryPhoto.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for data seeding...');

    // Clear existing data
    await Promise.all([
      SiteMeta.deleteMany({}),
      Hero.deleteMany({}),
      About.deleteMany({}),
      Skill.deleteMany({}),
      Experience.deleteMany({}),
      Education.deleteMany({}),
      Project.deleteMany({}),
      YouTubeVideo.deleteMany({}),
      Testimonial.deleteMany({}),
      Navbar.deleteMany({}),
      GalleryPhoto.deleteMany({}),
      Message.deleteMany({})
    ]);

    console.log('Cleared existing data.');

    // 1. Site Meta
    await SiteMeta.create({
      siteTitle: 'Harsh | Full Stack Developer',
      primaryColor: '#6366f1',
      accentColor: '#f59e0b',
      metaDescription: 'Professional portfolio of Harsh, a Full Stack Developer specializing in MERN stack.',
      footerText: 'Built with ❤️ by Harsh',
      copyrightName: 'Harsh Portfolio',
      contactFormEnabled: true
    });

    // 2. Navbar
    await Navbar.create({
      logoText: 'HARSH',
      links: [
        { label: 'Home', href: '#home', order: 0 },
        { label: 'About', href: '#about', order: 1 },
        { label: 'Skills', href: '#skills', order: 2 },
        { label: 'Projects', href: '#projects', order: 3 },
        { label: 'Contact', href: '#contact', order: 4 }
      ]
    });

    // 3. Hero
    await Hero.create({
      slides: [
        {
          imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1920&q=80',
          caption: 'Innovating Through Code',
          subCaption: 'Full Stack Developer & UI/UX Enthusiast',
          ctaText: 'Explore Projects',
          ctaLink: '#projects',
          order: 0
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1920&q=80',
          caption: 'Building Modern Solutions',
          subCaption: 'Specializing in React, Node.js, and Cloud Technologies',
          ctaText: 'Get In Touch',
          ctaLink: '#contact',
          order: 1
        }
      ],
      autoSlideInterval: 5
    });

    // 4. About
    await About.create({
      name: 'Harsh',
      tagline: 'Passionate Developer & Problem Solver',
      bio: '<p>I am a highly motivated Full Stack Developer with a strong foundation in modern web technologies. I love building scalable applications and exploring new technologies.</p><p>With a keen eye for design and performance, I strive to create seamless user experiences that solve real-world problems.</p>',
      profilePhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      resumeUrl: '#',
      yearsOfExperience: 3,
      projectsCompleted: 25,
      happyClients: 15
    });

    // 5. Skills
    await Skill.insertMany([
      { title: 'React', category: 'Frontend', level: 'Expert', icon: '⚛️', order: 0 },
      { title: 'Node.js', category: 'Backend', level: 'Expert', icon: '🟢', order: 1 },
      { title: 'MongoDB', category: 'Database', level: 'Expert', icon: '🍃', order: 2 },
      { title: 'TypeScript', category: 'Frontend', level: 'Intermediate', icon: '📘', order: 3 },
      { title: 'Docker', category: 'DevOps', level: 'Intermediate', icon: '🐳', order: 4 },
      { title: 'AWS', category: 'DevOps', level: 'Beginner', icon: '☁️', order: 5 }
    ]);

    // 6. Experience
    await Experience.insertMany([
      {
        company: 'Tech Solutions Inc.',
        role: 'Senior Developer',
        startDate: 'Jan 2023',
        endDate: 'Present',
        isCurrent: true,
        description: 'Leading the frontend team in developing high-performance React applications.',
        techStack: ['React', 'Redux', 'Node.js'],
        order: 0
      },
      {
        company: 'Web Craft Agency',
        role: 'Full Stack Developer',
        startDate: 'Jun 2021',
        endDate: 'Dec 2022',
        description: 'Developed and maintained various client projects using MERN stack.',
        techStack: ['MongoDB', 'Express', 'React', 'Node.js'],
        order: 1
      }
    ]);

    // 7. Education
    await Education.insertMany([
      {
        institution: 'University of Technology',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startYear: '2017',
        endYear: '2021',
        grade: '3.8 GPA',
        type: 'Degree',
        order: 0
      },
      {
        institution: 'Online Academy',
        degree: 'Full Stack Web Development',
        field: 'Web Development',
        startYear: '2021',
        endYear: '2021',
        type: 'Certification',
        order: 1
      }
    ]);

    // 8. Projects
    await Project.insertMany([
      {
        title: 'E-Commerce Platform',
        description: 'A full-featured e-commerce platform with payment integration.',
        imageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80',
        liveUrl: '#',
        githubUrl: '#',
        techStack: ['React', 'Node.js', 'Stripe'],
        featured: true,
        order: 0
      },
      {
        title: 'Task Management App',
        description: 'Collaborative task management tool for remote teams.',
        imageUrl: 'https://images.unsplash.com/photo-1540350394557-8d14678e7f91?auto=format&fit=crop&w=800&q=80',
        liveUrl: '#',
        githubUrl: '#',
        techStack: ['Vue.js', 'Firebase'],
        order: 1
      }
    ]);

    // 9. Gallery
    await GalleryPhoto.insertMany([
      { imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80', caption: 'Working on code', order: 0 },
      { imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80', caption: 'Workspace setup', order: 1 },
      { imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', caption: 'Team meeting', order: 2 }
    ]);

    // 10. YouTube Videos
    await YouTubeVideo.insertMany([
      {
        videoId: 'dQw4w9WgXcQ',
        title: 'Introduction to React Hooks',
        description: 'Learn the basics of React Hooks in this short tutorial.',
        thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        order: 0
      }
    ]);

    // 11. Testimonials
    await Testimonial.insertMany([
      {
        name: 'John Doe',
        role: 'CEO',
        company: 'Startup Hub',
        photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        text: 'Harsh is an exceptional developer who consistently delivers high-quality work.',
        rating: 5,
        order: 0
      },
      {
        name: 'Jane Smith',
        role: 'Product Manager',
        company: 'Creative Studio',
        photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
        text: 'Great communication and technical skills. Highly recommended!',
        rating: 4,
        order: 1
      }
    ]);

    // 12. Messages
    await Message.create({
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Inquiry about project',
      message: 'Hello, I saw your portfolio and I am interested in collaborating on a project.',
      isRead: false
    });

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
