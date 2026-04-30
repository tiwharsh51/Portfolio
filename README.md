# Admin-Controlled Dynamic Portfolio

A fully dynamic, production-ready MERN stack portfolio. The frontend acts as an animated, 3D-enhanced shell, while all data is securely managed through a hidden Admin panel.

## Features
- **Zero Hardcoded Content**: Everything (Bio, Skills, Experience, Projects) is stored in MongoDB.
- **Hidden Admin Dashboard**: Access via the subtle "⚙" icon in the footer.
- **3D Interactive Sections**: Uses Three.js and `@react-three/fiber` for immersive data visualization.
- **Framer Motion**: Smooth scroll and reveal animations.
- **Secure Architecture**: JWT httpOnly cookies, Cloudinary integration, and rate-limiting.

## Setup Instructions

### 1. Backend Setup
1. Navigate to the `server/` directory: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example` and fill in your MongoDB URI, Cloudinary keys, etc.
4. Start the server: `npm run dev`

### 2. Frontend Setup
1. Navigate to the `client/` directory: `cd client`
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`

### 3. First-Time Admin Setup
1. Once both servers are running, go to `http://localhost:5173/admin/login`
2. The system will detect no admin exists and prompt you for first-time setup.
3. Enter your email, password, and the `ADMIN_SETUP_KEY` you defined in your `.env` file.
4. You will be logged in to the admin panel. From there, fill in all sections to build your homepage!
