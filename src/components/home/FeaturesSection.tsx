const features = [
    {
        title: 'Collaborative Environment',
        description:
            'Meet new friends, work on joint projects, and become part of a vibrant community.',
    },
    {
        title: 'Skill Development',
        description:
            'Hone your leadership, communication, and technical skills through hands-on club activities.',
    },
    {
        title: 'Endless Opportunities',
        description:
            'From campus events to national competitions, your journey here is full of possibilities.',
    },
];

export function FeaturesSection() {
    return (
        <section
            id="features"
            className="bg-white px-4 py-12 text-center select-none"
        >
            <div className="mx-auto max-w-6xl">
                <h2 className="mb-6 text-3xl font-bold text-gray-800 md:text-4xl">
                    Key Features
                </h2>
                <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
                    Experience a new era of student life, connectivity, and
                    growth.
                </p>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="rounded bg-gray-100 p-6 shadow"
                        >
                            <h3 className="mb-2 text-xl font-bold text-indigo-600">
                                {feature.title}
                            </h3>
                            <p className="text-gray-700">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
