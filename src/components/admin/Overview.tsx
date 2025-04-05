'use client';

import {
    Bar,
    BarChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
} from 'recharts';

interface OverviewProps {
    data: {
        clubStats: {
            status: string;
            _count: number;
        }[];
        totalEvents: number;
        totalNominations: number;
        totalUsers: number;
        activeEvents: number;
    };
}

export function Overview({ data }: OverviewProps) {
    const chartData = [
        {
            name: 'Total Users',
            value: data.totalUsers,
            description: 'Registered users',
        },
        {
            name: 'Total Events',
            value: data.totalEvents,
            description: 'All events',
        },
        {
            name: 'Ongoing Events',
            value: data.activeEvents,
            description: 'Currently active',
        },
        {
            name: 'Nominations',
            value: data.totalNominations,
            description: 'Open positions',
        },
        ...data.clubStats.map(stat => ({
            name: `${stat.status} Clubs`,
            value: stat._count,
            description: `${stat.status.toLowerCase()} status`,
        })),
    ];

    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={value => `${value}`}
                />
                <Tooltip
                    content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                            return (
                                <div className="bg-background rounded-lg border p-2 shadow-sm">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex flex-col">
                                            <span className="text-muted-foreground text-[0.70rem] uppercase">
                                                {payload[0].payload.name}
                                            </span>
                                            <span className="text-muted-foreground font-bold">
                                                {payload[0].value}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-muted-foreground text-[0.70rem]">
                                                {payload[0].payload.description}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    }}
                />
                <Bar
                    dataKey="value"
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                />
            </BarChart>
        </ResponsiveContainer>
    );
}
