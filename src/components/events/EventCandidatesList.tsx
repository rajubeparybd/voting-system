import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { BadgeInfo, Mail, School } from 'lucide-react';

interface CandidateDetails {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    studentId?: string | null;
    department?: string | null;
}

interface EventCandidatesListProps {
    candidates: CandidateDetails[];
}

export default function EventCandidatesList({
    candidates,
}: EventCandidatesListProps) {
    return (
        <Card className="border-gray-800 bg-gray-900">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-white">
                    Candidates
                </CardTitle>
            </CardHeader>
            <CardContent>
                {candidates.length === 0 ? (
                    <p className="py-4 text-center text-gray-400">
                        No candidates found
                    </p>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {candidates.map((candidate: CandidateDetails) => (
                            <div
                                key={candidate.id}
                                className="flex flex-col rounded-lg border border-gray-600 bg-gray-800 p-4 shadow-md transition-all hover:border-gray-700"
                            >
                                <div className="mb-3 flex items-center">
                                    <Avatar
                                        className="mr-2 border"
                                        src={candidate.image}
                                        alt={candidate.name || ''}
                                        fallback={candidate.name
                                            ?.split(' ')
                                            .map(n => n[0])
                                            .join('')
                                            .toUpperCase()}
                                    />
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">
                                            {candidate.name || 'Anonymous'}
                                        </h3>
                                    </div>
                                </div>

                                <div className="mt-2 space-y-2 text-sm">
                                    {candidate.studentId && (
                                        <div className="flex items-center text-gray-300">
                                            <BadgeInfo className="mr-2 h-4 w-4 text-indigo-400" />
                                            <span>
                                                ID: {candidate.studentId}
                                            </span>
                                        </div>
                                    )}

                                    {candidate.department && (
                                        <div className="flex items-center text-gray-300">
                                            <School className="mr-2 h-4 w-4 text-indigo-400" />
                                            <span>
                                                Dept: {candidate.department}
                                            </span>
                                        </div>
                                    )}

                                    {candidate.email && (
                                        <div className="flex items-center text-gray-300">
                                            <Mail className="mr-2 h-4 w-4 text-indigo-400" />
                                            <span className="truncate">
                                                {candidate.email}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
