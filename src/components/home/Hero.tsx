import Image from 'next/image';
import { TypedText } from '@/components/ui/typed-text';
import heroImg from '@/assets/images/hero-bg.jpg';
import Link from 'next/link';

interface HeroProps {
    typingStrings: string[];
}

export function Hero({ typingStrings }: HeroProps) {
    return (
        <section className="relative flex h-screen w-full items-center justify-center">
            <Image
                src={heroImg}
                alt="Hero background"
                fill
                className="object-cover"
                priority
            />
            <div className="absolute inset-0 bg-black opacity-40" />
            <div className="relative z-10 max-w-4xl px-4 text-center">
                <h1 className="mb-6 text-4xl font-extrabold text-white drop-shadow md:text-6xl">
                    <TypedText strings={typingStrings} />
                </h1>
                <p className="text-lg text-gray-100 md:text-2xl">
                    Explore the best clubs, latest activities, and endless
                    opportunities.
                </p>
                <div className="mt-8">
                    <Link
                        href="#our-clubs"
                        className="rounded bg-white px-6 py-3 font-bold text-indigo-600 shadow transition hover:bg-gray-100"
                    >
                        Learn More
                    </Link>
                </div>
            </div>
        </section>
    );
}
