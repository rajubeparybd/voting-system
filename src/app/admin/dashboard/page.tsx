import { Suspense } from 'react';
import { db } from '@/lib/prisma';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RecentApplications } from '@/components/admin/RecentApplications';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

async function getData() {
    try {
        const [
            totalUsers,
            totalClubs,
            totalEvents,
            activeEvents,
            totalNominations,
            ongoingEvents,
            pendingApplications,
            recentApplications,
            clubStats,
            eventsByStatus,
            applicationsByStatus,
            topClubs,
        ] = await Promise.all([
            db.user.count(),
            db.club.count(),
            db.event.count(),
            db.event.count({
                where: { status: 'ONGOING' },
            }),
            db.nomination.count(),
            db.event.findMany({
                where: { status: 'ONGOING' },
                include: {
                    club: true,
                    votes: true,
                },
                take: 5,
            }),
            db.application.count({
                where: { status: 'PENDING' },
            }),
            db.application.findMany({
                where: {},
                include: {
                    user: true,
                    nomination: {
                        include: {
                            club: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
                take: 5,
            }),
            db.club.groupBy({
                by: ['status'],
                _count: true,
            }),
            db.event.groupBy({
                by: ['status'],
                _count: true,
            }),
            db.application.groupBy({
                by: ['status'],
                _count: true,
            }),
            db.club.findMany({
                include: {
                    events: true,
                    nominations: true,
                },
                orderBy: {
                    events: {
                        _count: 'desc',
                    },
                },
                take: 5,
            }),
        ]);

        return {
            totalUsers,
            totalClubs,
            totalEvents,
            activeEvents,
            totalNominations,
            ongoingEvents,
            pendingApplications,
            recentApplications,
            clubStats,
            eventsByStatus,
            applicationsByStatus,
            topClubs,
        };
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw new Error('Failed to fetch dashboard data');
    }
}

export default async function AdminDashboard() {
    const data = await getData();

    return (
        <div className="flex-1 space-y-4 p-2 pt-4 sm:p-4 md:p-6 lg:p-8">
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Dashboard
                </h2>
            </div>
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="w-full sm:w-auto">
                    <TabsTrigger
                        value="overview"
                        className="flex-1 sm:flex-none"
                    >
                        Overview
                    </TabsTrigger>
                    <TabsTrigger
                        value="analytics"
                        className="flex-1 sm:flex-none"
                    >
                        Analytics
                    </TabsTrigger>
                    <TabsTrigger
                        value="reports"
                        className="flex-1 sm:flex-none"
                    >
                        Reports
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xs font-medium sm:text-sm">
                                    Total Users
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xl font-bold sm:text-2xl">
                                    {data.totalUsers}
                                </div>
                                <p className="text-muted-foreground text-[10px] sm:text-xs">
                                    Registered in the system
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xs font-medium sm:text-sm">
                                    Active Clubs
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xl font-bold sm:text-2xl">
                                    {data.totalClubs}
                                </div>
                                <p className="text-muted-foreground text-[10px] sm:text-xs">
                                    Total registered clubs
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xs font-medium sm:text-sm">
                                    Active Events
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xl font-bold sm:text-2xl">
                                    {data.activeEvents}
                                </div>
                                <p className="text-muted-foreground text-[10px] sm:text-xs">
                                    Currently ongoing events
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xs font-medium sm:text-sm">
                                    Pending Applications
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xl font-bold sm:text-2xl">
                                    {data.pendingApplications}
                                </div>
                                <p className="text-muted-foreground text-[10px] sm:text-xs">
                                    Awaiting review
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:gap-4 lg:grid-cols-2">
                        <Card className="overflow-hidden">
                            <CardHeader className="space-y-1">
                                <CardTitle className="text-lg sm:text-xl">
                                    Recent Applications
                                </CardTitle>
                                <CardDescription className="text-xs sm:text-sm">
                                    Latest candidate applications
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Suspense
                                    fallback={
                                        <Skeleton className="h-[250px] w-full sm:h-[350px]" />
                                    }
                                >
                                    <RecentApplications
                                        data={data.recentApplications}
                                    />
                                </Suspense>
                            </CardContent>
                        </Card>
                        <Card className="overflow-hidden">
                            <CardHeader className="space-y-1">
                                <CardTitle className="text-lg sm:text-xl">
                                    Ongoing Events
                                </CardTitle>
                                <CardDescription className="text-xs sm:text-sm">
                                    Currently active voting events
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 sm:space-y-8">
                                    {data.ongoingEvents.map(event => (
                                        <div
                                            key={event.id}
                                            className="flex items-center"
                                        >
                                            <div className="space-y-1">
                                                <p className="text-xs leading-none font-medium sm:text-sm">
                                                    {event.title}
                                                </p>
                                                <p className="text-muted-foreground text-[10px] sm:text-sm">
                                                    {event.club.name} •{' '}
                                                    {event.votes.length} votes
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="analytics" className="space-y-4">
                    <div className="grid grid-cols-1 gap-2 sm:gap-4 lg:grid-cols-7">
                        <Card className="overflow-x-auto lg:col-span-4">
                            <CardHeader className="space-y-1">
                                <CardTitle className="text-lg sm:text-xl">
                                    Event Status Distribution
                                </CardTitle>
                                <CardDescription className="text-xs sm:text-sm">
                                    Overview of events by their current status
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-xs sm:text-sm">
                                                    Status
                                                </TableHead>
                                                <TableHead className="text-xs sm:text-sm">
                                                    Count
                                                </TableHead>
                                                <TableHead className="text-xs sm:text-sm">
                                                    Percentage
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {data.eventsByStatus.map(status => (
                                                <TableRow key={status.status}>
                                                    <TableCell className="text-xs font-medium sm:text-sm">
                                                        {status.status}
                                                    </TableCell>
                                                    <TableCell className="text-xs sm:text-sm">
                                                        {status._count}
                                                    </TableCell>
                                                    <TableCell className="text-xs sm:text-sm">
                                                        {(
                                                            (status._count /
                                                                data.totalEvents) *
                                                            100
                                                        ).toFixed(1)}
                                                        %
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="overflow-x-auto lg:col-span-3">
                            <CardHeader className="space-y-1">
                                <CardTitle className="text-lg sm:text-xl">
                                    Application Analytics
                                </CardTitle>
                                <CardDescription className="text-xs sm:text-sm">
                                    Distribution of application statuses
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-xs sm:text-sm">
                                                    Status
                                                </TableHead>
                                                <TableHead className="text-xs sm:text-sm">
                                                    Count
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {data.applicationsByStatus.map(
                                                status => (
                                                    <TableRow
                                                        key={status.status}
                                                    >
                                                        <TableCell className="text-xs font-medium sm:text-sm">
                                                            {status.status}
                                                        </TableCell>
                                                        <TableCell className="text-xs sm:text-sm">
                                                            {status._count}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="reports" className="space-y-4">
                    <Card className="overflow-x-auto">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-lg sm:text-xl">
                                Top Active Clubs
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm">
                                Clubs with the most events and nominations
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-xs sm:text-sm">
                                                Club Name
                                            </TableHead>
                                            <TableHead className="text-xs sm:text-sm">
                                                Total Events
                                            </TableHead>
                                            <TableHead className="text-xs sm:text-sm">
                                                Total Nominations
                                            </TableHead>
                                            <TableHead className="text-xs sm:text-sm">
                                                Status
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.topClubs.map(club => (
                                            <TableRow key={club.id}>
                                                <TableCell className="text-xs font-medium sm:text-sm">
                                                    {club.name}
                                                </TableCell>
                                                <TableCell className="text-xs sm:text-sm">
                                                    {club.events.length}
                                                </TableCell>
                                                <TableCell className="text-xs sm:text-sm">
                                                    {club.nominations.length}
                                                </TableCell>
                                                <TableCell className="text-xs sm:text-sm">
                                                    {club.status}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
