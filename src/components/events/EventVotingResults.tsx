'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getVoteResults } from '@/actions/event';
import { Avatar } from '@/components/ui/avatar';
import { Trophy, BarChart2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Tooltip,
    Cell,
} from 'recharts';

interface Candidate {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    studentId?: string | null;
    department?: string | null;
}

interface VoteResult {
    candidate: Candidate | null;
    votes: number;
}

interface VoteResultsData {
    results: VoteResult[];
    totalVotes: number;
}

interface EventVotingResultsProps {
    eventId: string;
    isCompleted: boolean;
    winnerId?: string | null;
}

export default function EventVotingResults({
    eventId,
    isCompleted,
    winnerId,
}: EventVotingResultsProps) {
    const [results, setResults] = useState<VoteResultsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true);
                const data = await getVoteResults(eventId);
                setResults(data);
            } catch (err) {
                console.error('Failed to fetch vote results:', err);
                setError(
                    'Failed to load voting results. Please try again later.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [eventId]);

    if (loading) {
        return (
            <Card className="border-gray-800 bg-gray-900">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-white">
                        <div className="flex items-center">
                            <BarChart2 className="mr-2 h-5 w-5 text-indigo-400" />
                            Voting Results
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex h-40 items-center justify-center">
                        <div className="flex items-center space-x-4">
                            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-500"></div>
                            <p className="text-gray-400">
                                Loading voting results...
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="border-gray-800 bg-gray-900">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-white">
                        <div className="flex items-center">
                            <BarChart2 className="mr-2 h-5 w-5 text-indigo-400" />
                            Voting Results
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="py-8 text-center text-red-400">{error}</div>
                </CardContent>
            </Card>
        );
    }

    if (!results || results.results.length === 0) {
        return (
            <Card className="border-gray-800 bg-gray-900">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-white">
                        <div className="flex items-center">
                            <BarChart2 className="mr-2 h-5 w-5 text-indigo-400" />
                            Voting Results
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="py-8 text-center text-gray-400">
                        No voting data available.
                    </div>
                </CardContent>
            </Card>
        );
    }

    const totalVotes = results.totalVotes;

    // Create chart data for Recharts
    const chartData = results.results.map(result => {
        return {
            name: result.candidate?.name?.split(' ')[0] || 'Unknown',
            votes: result.votes,
            isWinner: isCompleted && winnerId === result.candidate?.id,
        };
    });

    return (
        <Card className="border-gray-800 bg-gray-900">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-white">
                    <div className="flex items-center">
                        <BarChart2 className="mr-2 h-5 w-5 text-indigo-400" />
                        Voting Results
                        <Badge className="ml-3 bg-indigo-600 text-white">
                            Total Votes: {totalVotes}
                        </Badge>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="chart" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                        <TabsTrigger
                            value="chart"
                            className="data-[state=active]:bg-gray-700"
                        >
                            Chart View
                        </TabsTrigger>
                        <TabsTrigger
                            value="list"
                            className="data-[state=active]:bg-gray-700"
                        >
                            List View
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="chart" className="mt-4">
                        <Card className="border-gray-800 bg-gray-900">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold text-white">
                                    Vote Distribution
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-80">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart
                                            data={chartData}
                                            layout="vertical"
                                            margin={{
                                                left: 20,
                                                right: 50,
                                                top: 10,
                                                bottom: 10,
                                            }}
                                        >
                                            <CartesianGrid
                                                horizontal
                                                strokeDasharray="3 3"
                                                stroke="#4b5563"
                                            />
                                            <YAxis
                                                dataKey="name"
                                                type="category"
                                                tickLine={false}
                                                axisLine={{ stroke: '#6b7280' }}
                                                tick={{
                                                    fill: '#9ca3af',
                                                    fontSize: 12,
                                                }}
                                                width={80}
                                            />
                                            <XAxis
                                                type="number"
                                                tickLine={false}
                                                axisLine={{ stroke: '#6b7280' }}
                                                tick={{
                                                    fill: '#9ca3af',
                                                    fontSize: 12,
                                                }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#1f2937',
                                                    borderColor: '#374151',
                                                    color: '#e5e7eb',
                                                }}
                                                cursor={{
                                                    fill: 'rgba(107, 114, 128, 0.2)',
                                                }}
                                            />
                                            <Bar
                                                dataKey="votes"
                                                fill="#6366f1"
                                                radius={4}
                                                className="votes-bar"
                                            >
                                                <LabelList
                                                    dataKey="votes"
                                                    position="right"
                                                    fill="#e5e7eb"
                                                    fontSize={12}
                                                />
                                                {chartData.map(
                                                    (entry, index) =>
                                                        entry.isWinner ? (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill="#facc15"
                                                            />
                                                        ) : null
                                                )}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                            <div className="px-6 pb-4 text-sm">
                                <div className="text-gray-400">
                                    Showing vote distribution across all
                                    candidates
                                </div>
                            </div>
                        </Card>
                    </TabsContent>

                    <TabsContent value="list" className="mt-4">
                        <div className="overflow-hidden rounded-lg border border-gray-700">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-800">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase"
                                        >
                                            Rank
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase"
                                        >
                                            Candidate
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-300 uppercase"
                                        >
                                            Votes
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-300 uppercase"
                                        >
                                            Percentage
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-300 uppercase"
                                        >
                                            Bar
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700 bg-gray-900">
                                    {results.results.map((result, index) => {
                                        const isWinner =
                                            isCompleted &&
                                            winnerId === result.candidate?.id;
                                        const percentage =
                                            totalVotes > 0
                                                ? Math.round(
                                                      (result.votes /
                                                          totalVotes) *
                                                          100
                                                  )
                                                : 0;

                                        return (
                                            <tr
                                                key={
                                                    result.candidate?.id ||
                                                    index
                                                }
                                                className={
                                                    isWinner
                                                        ? 'bg-yellow-900/10'
                                                        : undefined
                                                }
                                            >
                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-300">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <Avatar
                                                            className={`mr-3 h-8 w-8 ${isWinner ? 'border-2 border-yellow-500' : ''}`}
                                                            src={
                                                                result.candidate
                                                                    ?.image ||
                                                                undefined
                                                            }
                                                            alt={
                                                                result.candidate
                                                                    ?.name ||
                                                                'Candidate'
                                                            }
                                                            fallback={
                                                                result.candidate?.name
                                                                    ?.split(' ')
                                                                    .map(
                                                                        n =>
                                                                            n[0]
                                                                    )
                                                                    .join('')
                                                                    .toUpperCase() ||
                                                                '?'
                                                            }
                                                        />
                                                        <div className="text-sm font-medium text-gray-200">
                                                            {result.candidate
                                                                ?.name ||
                                                                'Unknown Candidate'}
                                                            {isWinner && (
                                                                <Trophy className="ml-2 inline-block h-4 w-4 text-yellow-500" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-300">
                                                    {result.votes}
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm font-semibold whitespace-nowrap text-gray-200">
                                                    {percentage}%
                                                </td>
                                                <td className="w-40 px-6 py-4">
                                                    <div className="relative h-2 w-full rounded-full bg-gray-700">
                                                        <div
                                                            className={`absolute top-0 left-0 h-full rounded-full ${
                                                                isWinner
                                                                    ? 'bg-yellow-500'
                                                                    : 'bg-indigo-500'
                                                            }`}
                                                            style={{
                                                                width: `${percentage}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
