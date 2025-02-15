import Navbar from '@/components/home/Navbar';
import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import ClubsSection from '@/components/home/ClubsSection';
import EventsSection from '@/components/home/EventsSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import GallerySection from '@/components/home/GallerySection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import TeamSection from '@/components/home/TeamSection';
import Footer from '@/components/home/Footer';

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-gray-900 text-white">
            <Navbar />
            <HeroSection />
            <AboutSection />
            <ClubsSection />
            <EventsSection />
            <FeaturesSection />
            <GallerySection />
            <TestimonialsSection />
            <TeamSection />
            <Footer />
        </main>
    );
}
