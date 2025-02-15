import Image from 'next/image';

const teamMembers = [
    {
        id: 1,
        name: 'Alleah Janette',
        role: 'Chief Creative Officer',
        image: '/images/user.jpg',
    },
    {
        id: 2,
        name: 'Mia Klassen',
        role: 'Chief Talent Officer',
        image: '/images/user.jpg',
    },
    {
        id: 3,
        name: 'Nadeen Sarrah',
        role: 'Chief Marketing Officer',
        image: '/images/user.jpg',
    },
];

const TeamMember = ({ member }: { member: (typeof teamMembers)[0] }) => {
    return (
        <div className="text-center">
            <div className="relative mx-auto mb-6 h-64 w-64 overflow-hidden rounded-full">
                <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="relative mx-auto -mt-12 max-w-[80%] rounded-lg bg-gray-800 p-4">
                <h3 className="text-xl font-semibold text-white">
                    {member.name}
                </h3>
                <p className="text-gray-400">{member.role}</p>
            </div>
        </div>
    );
};

const TeamSection = () => {
    return (
        <section id="team" className="bg-gray-900 py-20">
            <div className="container mx-auto px-6 md:px-12">
                {/* Section Title */}
                <div className="mb-16 flex flex-col items-end">
                    <h2 className="text-3xl font-medium text-amber-500 md:text-4xl">
                        OUR COMMITTEE
                    </h2>
                    <div className="mt-2 h-1 w-32 bg-gray-700"></div>
                </div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                    {teamMembers.map(member => (
                        <TeamMember key={member.id} member={member} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TeamSection;
