import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Voting System',
    description: 'A voting system built for club members',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} from-background via-background/95 to-background/90 min-h-screen bg-gradient-to-br antialiased`}
                suppressHydrationWarning
            >
                <div className="relative z-10 flex min-h-screen flex-col">
                    <Providers>{children}</Providers>
                </div>
            </body>
        </html>
    );
}
