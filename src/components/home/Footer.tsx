import Link from 'next/link';
import { ArrowRight, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 pt-16 pb-8 text-gray-300">
            <div className="container mx-auto px-6 md:px-12">
                {/* Top section */}
                <div className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-2">
                    {/* Logo and CTA */}
                    <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
                        <div className="flex flex-col items-center md:items-start">
                            <h3 className="mb-4 text-xl font-medium text-white">
                                Ready to get started?
                            </h3>
                            <Link
                                href="/auth/signup"
                                className="flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-2 font-medium text-black transition-colors hover:bg-amber-600"
                            >
                                Get started
                            </Link>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className="flex flex-col">
                        <h3 className="mb-4 text-lg font-medium text-white">
                            Subscribe to our newsletter
                        </h3>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="bg-opacity-50 flex-grow rounded-l-lg bg-gray-800 px-4 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            />
                            <button className="rounded-r-lg bg-amber-500 px-4 py-2 text-black transition-colors hover:bg-amber-600">
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                <hr className="mb-12 border-gray-800" />

                {/* Links section */}
                <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
                    <div>
                        <h4 className="mb-4 font-medium text-amber-500">
                            Quick Links
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="#clubs"
                                    className="transition-colors hover:text-amber-400"
                                >
                                    Clubs
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#events"
                                    className="transition-colors hover:text-amber-400"
                                >
                                    Events
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#community"
                                    className="transition-colors hover:text-amber-400"
                                >
                                    Community
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 font-medium text-amber-500">
                            About
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="#about"
                                    className="transition-colors hover:text-amber-400"
                                >
                                    Our Story
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#features"
                                    className="transition-colors hover:text-amber-400"
                                >
                                    Benefits
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#team"
                                    className="transition-colors hover:text-amber-400"
                                >
                                    Team
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/careers"
                                    className="transition-colors hover:text-amber-400"
                                >
                                    Careers
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 font-medium text-amber-500">
                            Help
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/faqs"
                                    className="transition-colors hover:text-amber-400"
                                >
                                    FAQs
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/contact"
                                    className="transition-colors hover:text-amber-400"
                                >
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom section */}
                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                    <div className="flex gap-6">
                        <Link
                            href="/terms"
                            className="text-sm transition-colors hover:text-amber-400"
                        >
                            Terms & Conditions
                        </Link>
                        <Link
                            href="/privacy"
                            className="text-sm transition-colors hover:text-amber-400"
                        >
                            Privacy Policy
                        </Link>
                    </div>
                    <div className="flex gap-4">
                        <Link
                            href="#"
                            className="text-gray-400 transition-colors hover:text-white"
                        >
                            <Facebook size={20} />
                        </Link>
                        <Link
                            href="#"
                            className="text-gray-400 transition-colors hover:text-white"
                        >
                            <Twitter size={20} />
                        </Link>
                        <Link
                            href="#"
                            className="text-gray-400 transition-colors hover:text-white"
                        >
                            <Instagram size={20} />
                        </Link>
                    </div>
                </div>

                <div
                    className="mt-6 flex items-center justify-between text-sm text-gray-500"
                    id="footer-section"
                >
                    <div className="text-left">
                        <p>&copy; 2025 BUBT. All rights reserved.</p>
                    </div>
                    <div className="text-right">
                        <p>
                            Made with ❤️ by &nbsp;
                            <Link
                                className="text-blue-400 hover:underline"
                                target="_blank"
                                href="https://github.com/rajubeparybd"
                            >
                                Raju Bepary
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
