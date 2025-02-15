import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Users, Briefcase } from 'lucide-react';

const AboutSection = () => {
    return (
        <section id="about" className="bg-gray-900 py-20">
            <div className="container mx-auto px-6 md:px-12">
                {/* Section Title */}
                <div className="mb-16 flex flex-col items-end">
                    <h2 className="text-3xl font-medium text-amber-500 md:text-4xl">
                        ABOUT US
                    </h2>
                    <div className="mt-2 h-1 w-32 bg-gray-700"></div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 items-center gap-12 md:gap-24 lg:grid-cols-2">
                    <div className="space-y-12">
                        <div className="text-base leading-relaxed text-gray-300 md:text-lg">
                            <p>
                                Welcome to BUBT Club Hub! A centralized platform
                                where all university clubs are showcased. Find
                                the club that matches your interests,
                                participate in elections, and shape your
                                university community. Being part of a club
                                enhances your university experience beyond
                                academics! Develop leadership skills, meet
                                like-minded peers, and participate in exciting
                                events that will shape your career and personal
                                growth.
                            </p>
                            <p className="mt-4">
                                Whether you&apos;re looking to join a club, run
                                for leadership, or vote for your favorite
                                candidates, everything happens right here!
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div className="flex items-center gap-4">
                                <div className="rounded-lg bg-gray-800 p-3">
                                    <Users className="h-6 w-6 text-amber-500" />
                                </div>
                                <p className="font-medium text-white">
                                    Leadership & Networking Opportunities
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="rounded-lg bg-gray-800 p-3">
                                    <Briefcase className="h-6 w-6 text-amber-500" />
                                </div>
                                <p className="font-medium text-white">
                                    Skill Development & Hands-on Experience
                                </p>
                            </div>
                        </div>

                        <Link
                            href="#clubs"
                            className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-8 py-3 font-medium text-black transition-colors hover:bg-amber-600"
                        >
                            Learn More <ArrowRight size={18} />
                        </Link>
                    </div>

                    <div className="relative">
                        {/* Main image */}
                        <div className="relative h-[450px] w-full overflow-hidden rounded-lg shadow-xl">
                            <Image
                                src="/images/activity1.jpg"
                                alt="Club Activities"
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Stats card */}
                        <div className="absolute right-6 bottom-6 w-32 rounded-lg bg-amber-500 p-6 text-center shadow-lg">
                            <h3 className="text-4xl font-bold text-gray-900">
                                10+
                            </h3>
                            <p className="text-xl font-medium text-gray-900">
                                Clubs
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
