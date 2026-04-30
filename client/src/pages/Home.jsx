import React, { Suspense } from 'react';
import Navbar from '../components/homepage/Navbar';
import HeroBanner from '../components/homepage/HeroBanner';
const About = React.lazy(() => import('../components/homepage/About'));
const SkillsElite = React.lazy(() => import('../components/homepage/Skills3D'));
const ExperienceElite = React.lazy(() => import('../components/homepage/Experience3D'));
const Projects = React.lazy(() => import('../components/homepage/Projects'));
const Testimonials = React.lazy(() => import('../components/homepage/Testimonials'));
import ContactForm from '../components/homepage/ContactForm';
import Footer from '../components/homepage/Footer';
const Gallery = React.lazy(() => import('../components/homepage/Gallery'));
const YouTubeSection = React.lazy(() => import('../components/homepage/YouTubeSection'));
import useSiteMeta from '../hooks/useSiteMeta';

const Home = () => {
  const { siteMeta, loading } = useSiteMeta();

  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-darkBg overflow-hidden">
       <div className="relative">
          <div className="w-24 h-24 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-primary uppercase tracking-widest animate-pulse">Loading</div>
       </div>
    </div>
  );

  return (
    <div className="bg-darkBg min-h-screen text-gray-400 font-body selection:bg-primary/20 selection:text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {siteMeta?.maintenanceMode ? (
          <div className="min-h-[60vh] flex items-center justify-center">
             {/* Literally Blank Mode */}
          </div>
        ) : (
          <>
            {/* 1. HERO SECTION */}
            {siteMeta?.showHero && <HeroBanner />}

            {/* 2. FEATURED WORK PREVIEW */}
            {siteMeta?.showProjects && (
              <Suspense fallback={null}>
                <Projects />
              </Suspense>
            )}

            {/* 3. ABOUT SNAPSHOT */}
            {siteMeta?.showAbout && (
              <Suspense fallback={null}>
                <About />
              </Suspense>
            )}

            {/* 4. TECHNICAL ARSENAL */}
            {siteMeta?.showSkills && (
              <Suspense fallback={null}>
                <SkillsElite />
              </Suspense>
            )}

            {/* 5. EXPERIENCE TIMELINE */}
            {siteMeta?.showExperience && (
              <Suspense fallback={null}>
                <ExperienceElite />
              </Suspense>
            )}

            {/* 6. AESTHETIC SNAPS */}
            {siteMeta?.showGallery && (
              <Suspense fallback={null}>
                <Gallery />
              </Suspense>
            )}

            {/* 7. TESTIMONIALS */}
            {siteMeta?.showTestimonials && (
              <Suspense fallback={null}>
                <Testimonials />
              </Suspense>
            )}

            {/* 8. VIDEO CHRONICLES */}
            {siteMeta?.showVideos && (
              <Suspense fallback={null}>
                <YouTubeSection />
              </Suspense>
            )}

            {/* 9. CONTACT FORM */}
            <ContactForm />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Home;
