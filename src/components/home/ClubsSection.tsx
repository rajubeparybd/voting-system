'use client';

import Image from 'next/image';
import { Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getActiveClubs } from '@/actions/club';

interface Club {
    id: string;
    name: string;
    description: string;
    image: string;
    members: string[];
    open_date?: Date | null;
}

const ClubCard = ({ club }: { club: Club }) => {
    return (
        <div className="flex flex-col overflow-hidden rounded-xl bg-gray-800 shadow-lg transition-transform duration-300 hover:-translate-y-2">
            {/* Club logo */}
            <div className="relative h-48 w-full">
                <Image
                    src={club.image}
                    alt={club.name}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Club details */}
            <div className="flex flex-grow flex-col p-6">
                <div className="flex-grow space-y-3">
                    <h3 className="text-xl font-bold text-white">
                        {club.name}
                    </h3>
                    <p className="text-gray-400">{club.description}</p>

                    <div className="flex items-center gap-2 text-amber-500">
                        <Users size={16} />
                        <span className="text-sm">
                            {club.members?.length || 0}+ Members
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ClubFilterChip = ({
    category,
    activeCategory,
    onClick,
}: {
    category: string;
    activeCategory: string;
    onClick: (category: string) => void;
}) => {
    const isActive = category === activeCategory;

    return (
        <button
            onClick={() => onClick(category)}
            className={`rounded-full border border-gray-600 px-4 py-2 transition-colors ${
                isActive
                    ? 'bg-amber-500 font-medium text-black'
                    : 'bg-transparent text-gray-400 hover:text-white'
            }`}
        >
            {category}
        </button>
    );
};

const PageIndicator = () => {
    return (
        <div className="mt-8 flex items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-amber-500">
                <div className="h-3 w-3 rounded-full bg-amber-500"></div>
            </div>
            <div className="h-3 w-3 rounded-full bg-amber-500"></div>
        </div>
    );
};

const ClubsSection = () => {
    const [clubs, setClubs] = useState<Club[]>([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<string[]>(['All']);
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        async function loadClubs() {
            try {
                const clubsData = await getActiveClubs();
                setClubs(clubsData);

                // Extract categories from club names for filtering
                const uniqueCategories = new Set<string>(['All']);
                clubsData.forEach(club => {
                    // Extract category from club name (e.g., "IT CLUB" -> "IT")
                    const category = club.name.split(' ')[0];
                    if (category) {
                        uniqueCategories.add(category);
                    }
                });

                setCategories(Array.from(uniqueCategories));
            } catch (error) {
                console.error('Error loading clubs:', error);
            } finally {
                setLoading(false);
            }
        }

        loadClubs();
    }, []);

    // Filter clubs based on selected category
    const filteredClubs =
        activeCategory === 'All'
            ? clubs
            : clubs.filter(club => club.name.includes(activeCategory));

    // Handle category filter click
    const handleCategoryFilter = (category: string) => {
        setActiveCategory(category);
    };

    return (
        <section id="clubs" className="bg-gray-950 py-20">
            <div className="container mx-auto px-6 md:px-12">
                {/* Section Title */}
                <div className="mb-16 flex flex-col items-end">
                    <h2 className="text-3xl font-medium text-amber-500 md:text-4xl">
                        OUR CLUBS
                    </h2>
                    <div className="mt-2 h-1 w-32 bg-gray-700"></div>
                </div>

                {/* Filter Chips */}
                <div className="mb-12 flex flex-wrap gap-4">
                    {categories.map(category => (
                        <ClubFilterChip
                            key={category}
                            category={category}
                            activeCategory={activeCategory}
                            onClick={handleCategoryFilter}
                        />
                    ))}
                </div>

                {/* Page Indicator */}
                <PageIndicator />

                {/* Clubs Grid */}
                <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {loading ? (
                        <div className="col-span-full py-12 text-center">
                            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
                            <p className="mt-4 text-gray-300">
                                Loading clubs...
                            </p>
                        </div>
                    ) : filteredClubs.length > 0 ? (
                        filteredClubs.map(club => (
                            <ClubCard key={club.id} club={club} />
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center">
                            <p className="text-gray-300">
                                No active clubs found.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ClubsSection;
