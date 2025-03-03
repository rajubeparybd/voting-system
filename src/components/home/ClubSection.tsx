import Image from 'next/image';

import businessLogo from '@/assets/images/business.png';
import culturalLogo from '@/assets/images/cultural.jpg';
import debatingLogo from '@/assets/images/debating.png';
import itLogo from '@/assets/images/it.png';
import languageLogo from '@/assets/images/language.png';
import roverLogo from '@/assets/images/rover.jpg';
import sportsLogo from '@/assets/images/sports.jpg';
import welfareLogo from '@/assets/images/welfare.png';
import economicsLogo from '@/assets/images/economics.jpg';
import bloodLogo from '@/assets/images/blood.jpg';
import eeeLogo from '@/assets/images/eee.jpg';
import ieeeLogo from '@/assets/images/ieee.jpg';
import { JSX } from 'react';

const clubs = [
    { name: 'IEEE Club', logo: ieeeLogo },
    { name: 'EEE Club', logo: eeeLogo },
    { name: 'Business Club', logo: businessLogo },
    { name: 'Cultural Club', logo: culturalLogo },
    { name: 'Debating Club', logo: debatingLogo },
    { name: 'IT Club', logo: itLogo },
    { name: 'Language Club', logo: languageLogo },
    { name: 'Rover Scout', logo: roverLogo },
    { name: 'Sports Club', logo: sportsLogo },
    { name: 'Social Welfare Club', logo: welfareLogo },
    { name: 'Economics Club', logo: economicsLogo },
    { name: 'Blood Donation Club', logo: bloodLogo },
];

export function ClubSection(): JSX.Element {
    return (
        <section
            id="our-clubs"
            className="mt-[-1px] bg-white px-4 py-12 text-center"
        >
            <div className="mx-auto max-w-6xl">
                <h2 className="mb-8 text-3xl font-bold text-gray-800 md:text-4xl">
                    Our Clubs
                </h2>
                <p className="mx-auto mb-6 max-w-2xl text-gray-600">
                    Explore our diverse range of clubs that cater to every
                    interest, from business to culture, debating to sports, and
                    more.
                </p>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {clubs.map((club, idx) => (
                        <div
                            key={idx}
                            className="flex transform flex-col items-center rounded bg-gray-100 p-4 shadow transition hover:scale-105"
                        >
                            {/* Club Logo */}
                            <Image
                                src={club.logo}
                                alt={club.name}
                                className="mb-2 h-16 w-auto object-contain"
                            />
                            <h3 className="text-lg font-semibold text-indigo-600">
                                {club.name}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
