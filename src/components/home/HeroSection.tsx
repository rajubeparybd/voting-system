import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
    return (
        <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800">
            {/* Background overlay with image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center opacity-30"
                style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
            />

            {/* Content */}
            <div className="z-10 container mx-auto px-6 text-center md:px-12">
                <h1 className="mb-6 text-3xl leading-tight font-bold text-white md:text-4xl lg:text-5xl">
                    Discover, Engage, and Lead – Your Club Journey Starts Here!
                </h1>
                <p className="mx-auto mb-10 max-w-3xl text-lg text-gray-300 md:text-xl">
                    Join university clubs, vote for your leaders, and make an
                    impact in student life.
                </p>
                <Link
                    href="/auth/signup"
                    className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-8 py-3 font-medium text-black transition-colors hover:bg-amber-600"
                >
                    Join Now
                    <ArrowRight size={20} />
                </Link>
            </div>
        </div>
    );
};

export default HeroSection;
