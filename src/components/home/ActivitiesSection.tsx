import Image from 'next/image';

import act1 from '@/assets/images/activity1.jpg';
import act2 from '@/assets/images/activity2.jpg';
import act3 from '@/assets/images/activity3.jpg';
import { JSX } from 'react';

const activities = [
    {
        id: 1,
        image: act1,
        title: 'National Robotics Championship 2025',
        desc: 'Thrilling Robotics showdown among universities!',
    },
    {
        id: 2,
        image: act2,
        title: 'Call for Members for IEEE Club',
        desc: 'Join the IEEE Club to explore the world of Electrical Engineering.',
    },
    {
        id: 3,
        image: act3,
        title: 'AD Maker',
        desc: 'Showcase your creativity in the AD Maker competition.',
    },
];

export function ActivitiesSection(): JSX.Element {
    return (
        <section id="latest-activities" className="bg-gray-50 px-4 py-12">
            <div className="mx-auto max-w-6xl">
                <h2 className="mb-8 text-3xl font-bold text-gray-800 md:text-4xl">
                    Latest Clubs Activity
                </h2>
                <p className="mx-auto mb-6 max-w-2xl text-center text-gray-600">
                    Stay updated with recent club events, workshops, and meetups
                    happening on campus.
                </p>
                {/* Horizontal slider container */}
                <div className="scrollbar-thin scrollbar-thumb-gray-300 flex space-x-4 overflow-x-auto pb-2">
                    {activities.map(act => (
                        <div
                            key={act.id}
                            className="inline-block w-64 flex-shrink-0 rounded bg-white p-4 shadow"
                        >
                            <div className="mb-3 flex h-32 items-center justify-center overflow-hidden bg-gray-200">
                                <Image
                                    src={act.image}
                                    alt={act.title}
                                    className="h-full w-auto object-cover"
                                />
                            </div>
                            <h3 className="mb-1 font-bold text-indigo-600">
                                {act.title}
                            </h3>
                            <p className="text-sm text-gray-600">{act.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
