const features = [
    {
        id: 1,
        number: '01',
        title: 'Skill Development',
        description:
            'Clubs help students develop leadership, communication, teamwork, and problem-solving skills.',
    },
    {
        id: 2,
        number: '02',
        title: 'Networking Opportunities',
        description:
            'Students can connect with like-minded peers, professors, and industry professionals, creating career connections.',
    },
    {
        id: 3,
        number: '03',
        title: 'Personal Growth & Confidence',
        description:
            'Engaging in club activities boosts confidence, creativity, and the ability to handle responsibilities.',
    },
    {
        id: 4,
        number: '04',
        title: 'Better Campus Experience',
        description:
            'Clubs make university life more enjoyable by providing social engagement, extracurricular activities.',
    },
];

const FeatureCard = ({ feature }: { feature: (typeof features)[0] }) => {
    return (
        <div className="bg-opacity-20 relative rounded-xl bg-gray-800 p-6">
            <span className="text-5xl font-bold text-gray-700 opacity-50">
                {feature.number}
            </span>
            <div className="mt-10 space-y-3">
                <h3 className="text-lg font-medium text-white">
                    {feature.title}
                </h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
            </div>
        </div>
    );
};

const FeaturesSection = () => {
    return (
        <section className="bg-gray-950 py-20">
            <div className="container mx-auto px-6 md:px-12">
                {/* Section Title */}
                <div className="mb-16 flex flex-col items-end">
                    <h2 className="text-3xl font-medium text-amber-500 md:text-4xl">
                        KEY FEATURES
                    </h2>
                    <div className="mt-2 h-1 w-32 bg-gray-700"></div>
                </div>

                <div className="grid grid-cols-1 gap-16">
                    <div className="space-y-8">
                        <h3 className="max-w-2xl text-2xl leading-tight font-medium text-white md:text-3xl">
                            Discover, Connect, and Grow Beyond the Classroom
                        </h3>
                        <p className="max-w-2xl text-gray-400">
                            University clubs offer the perfect platform to
                            develop skills, build lifelong connections, and gain
                            real-world experience. Whether you&apos;re
                            passionate about leadership, technology, arts, or
                            social impact, there&apos;s a club for you!
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {features.map(feature => (
                            <FeatureCard key={feature.id} feature={feature} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
