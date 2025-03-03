import { Navigation } from '@/components/home/Navigation';
import { Hero } from '@/components/home/Hero';
import { ClubSection } from '@/components/home/ClubSection';
import { ActivitiesSection } from '@/components/home/ActivitiesSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import Link from 'next/link';

// NAV LINKS for the top navbar (smooth scroll)
const navLinks = [
    { label: 'Our Clubs', href: '#our-clubs' },
    { label: 'Latest Activities', href: '#latest-activities' },
    { label: 'Features', href: '#features' },
];

export default function Home() {
    return (
        <div className="relative flex h-full w-full flex-col">
            <Navigation navLinks={navLinks} />
            <Hero
                typingStrings={[
                    'Welcome to Our University',
                    'Empowering Minds, Shaping Futures',
                    'Join Our Vibrant Campus Community',
                ]}
            />
            <ClubSection />
            <ActivitiesSection />
            <FeaturesSection />
            <footer
                className="flex items-center justify-between bg-gray-800 px-6 py-4 text-white"
                id="footer-section"
            >
                <div className="text-left">
                    <p>&copy; 2025 BUBT. All rights reserved.</p>
                </div>
                <div className="text-right">
                    <p>
                        Made with ❤️ by &nbsp;
                        <Link
                            className="text-blue-400 hover:underline"
                            target="_blank"
                            href="https://github.com/rajubeparybd"
                        >
                            Raju Bepary
                        </Link>
                    </p>
                </div>
            </footer>
        </div>
    );
}
