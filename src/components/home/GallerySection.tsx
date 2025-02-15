import Image from 'next/image';

const filters = [
    { id: 1, name: 'All', active: true },
    { id: 2, name: 'IT Club', active: false },
    { id: 3, name: 'Rover Scout', active: false },
    { id: 4, name: 'Language Club', active: false },
    { id: 5, name: 'Blood Donation', active: false },
];

const images = [
    {
        id: 1,
        src: '/images/activity1.jpg',
        alt: 'Club activity image 1',
    },
    {
        id: 2,
        src: '/images/activity2.jpg',
        alt: 'Club activity image 2',
    },
    {
        id: 3,
        src: '/images/activity3.jpg',
        alt: 'Club activity image 3',
    },
    {
        id: 4,
        src: '/images/sports.jpg',
        alt: 'Sports club activities',
    },
    {
        id: 5,
        src: '/images/cultural.jpg',
        alt: 'Cultural club performance',
    },
];

const FilterChip = ({ filter }: { filter: (typeof filters)[0] }) => {
    return (
        <button
            className={`rounded-full border border-gray-600 px-4 py-2 transition-colors ${
                filter.active
                    ? 'bg-amber-500 font-medium text-black'
                    : 'bg-transparent text-gray-400 hover:text-white'
            }`}
        >
            {filter.name}
        </button>
    );
};

const GallerySection = () => {
    return (
        <section id="gallery" className="bg-gray-900 py-20">
            <div className="container mx-auto px-6 md:px-12">
                {/* Section Title */}
                <div className="mb-12 flex flex-col items-end">
                    <h2 className="text-3xl font-medium text-amber-500 md:text-4xl">
                        PHOTO GALLERY
                    </h2>
                    <div className="mt-2 h-1 w-32 bg-gray-700"></div>
                </div>

                {/* Filter Chips */}
                <div className="mb-12 flex flex-wrap gap-4">
                    {filters.map(filter => (
                        <FilterChip key={filter.id} filter={filter} />
                    ))}
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* First column - large image */}
                    <div className="relative h-96 overflow-hidden rounded-xl md:col-span-2">
                        <Image
                            src={images[0].src}
                            alt={images[0].alt}
                            fill
                            className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                    </div>

                    {/* Second column */}
                    <div className="space-y-6">
                        <div className="relative h-44 overflow-hidden rounded-xl">
                            <Image
                                src={images[1].src}
                                alt={images[1].alt}
                                fill
                                className="object-cover transition-transform duration-500 hover:scale-105"
                            />
                        </div>
                        <div className="relative h-44 overflow-hidden rounded-xl">
                            <Image
                                src={images[2].src}
                                alt={images[2].alt}
                                fill
                                className="object-cover transition-transform duration-500 hover:scale-105"
                            />
                        </div>
                    </div>

                    {/* Third row */}
                    <div className="relative h-72 overflow-hidden rounded-xl">
                        <Image
                            src={images[3].src}
                            alt={images[3].alt}
                            fill
                            className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                    </div>
                    <div className="relative h-72 overflow-hidden rounded-xl">
                        <Image
                            src={images[4].src}
                            alt={images[4].alt}
                            fill
                            className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GallerySection;
