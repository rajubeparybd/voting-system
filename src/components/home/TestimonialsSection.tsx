import Image from 'next/image';
import { Quote } from 'lucide-react';

const TestimonialsSection = () => {
    return (
        <section id="testimonials" className="bg-gray-950 py-20">
            <div className="container mx-auto px-6 md:px-12">
                {/* Section Title */}
                <div className="mb-16 flex flex-col items-end">
                    <h2 className="text-3xl font-medium text-amber-500 md:text-4xl">
                        SAYINGS OF MEMBERS
                    </h2>
                    <div className="mt-2 h-1 w-32 bg-gray-700"></div>
                </div>

                {/* Testimonial Card */}
                <div className="mx-auto max-w-4xl">
                    <div className="relative">
                        <Quote className="absolute -top-10 -left-10 h-16 w-16 text-amber-500 opacity-50" />

                        <div className="flex flex-col items-center gap-8 md:flex-row">
                            {/* Testimonial */}
                            <div className="flex-1 rounded-xl bg-gray-800 p-8 shadow-lg">
                                <div className="mb-6 h-1 w-full bg-gray-700"></div>
                                <p className="mb-8 text-gray-300 italic">
                                    "Being part of the IT Club not only improved
                                    my coding skills but also helped me build
                                    confidence and expand my network. I've made
                                    amazing friends, participated in national
                                    competitions, and even landed an internship
                                    through club connections. If you want to
                                    grow beyond academics, joining a club is the
                                    best decision!"
                                </p>
                                <div className="text-center md:text-left">
                                    <h4 className="font-medium text-white">
                                        — Rahim Ahmed
                                    </h4>
                                    <p className="text-sm text-gray-400">
                                        IT Club Member
                                    </p>
                                </div>
                            </div>

                            {/* Image */}
                            <div className="w-full md:w-1/3">
                                <div className="relative mx-auto h-64 w-64 overflow-hidden rounded-xl">
                                    <Image
                                        src="/images/user.jpg"
                                        alt="Student testimonial"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
