import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, LogOut, Menu, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const ReaderLayout = ({ user, onLogout, children }) => {
    const { t } = useLanguage();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { name: t('home'), path: '/' },
        { name: t('myBooks'), path: '/my-books' },
        { name: t('history'), path: '/history' },
    ];

    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)' }}>
            {/* Top Navigation Bar */}
            <nav className="sticky top-0 z-50 rounded-none" style={{ background: 'var(--bg-base)', borderBottom: '1px solid var(--border-secondary)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center p-2" style={{ background: 'var(--accent-gradient)', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}>
                                <svg viewBox="0 0 64 64" className="w-full h-full">
                                    <rect x="8" y="12" width="48" height="10" rx="2" fill="white" transform="rotate(-8 32 17)"/>
                                    <rect x="8" y="26" width="48" height="10" rx="2" fill="white" opacity="0.85" transform="rotate(3 32 31)"/>
                                    <rect x="8" y="40" width="48" height="10" rx="2" fill="white" opacity="0.7" transform="rotate(-2 32 45)"/>
                                </svg>
                            </div>
                            <span className="text-lg font-bold hidden sm:block">LibManager</span>
                        </div>

                        {/* Search Bar (Center) */}
                        <div className="hidden md:flex flex-1 max-w-lg mx-8">
                            <div className="relative w-full group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5" style={{ color: 'var(--text-muted)' }} />
                                </div>
                                <input
                                    type="text"
                                    className="input-field"
                                    style={{ paddingLeft: '2.5rem' }}
                                    placeholder={t('searchBooks') || "Search for books..."}
                                />
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="hidden md:flex items-center gap-4">
                            {/* Navigation Links */}
                            <div className="flex items-center gap-1 mr-4">
                                {navItems.map((item) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                                            style={{
                                                background: isActive ? 'var(--accent-soft)' : 'transparent',
                                                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)'
                                            }}
                                        >
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Notifications */}
                            <Link to="/notifications" className="p-2 rounded-full transition-colors relative" style={{ color: 'var(--text-secondary)' }}>
                                <span className="text-lg">🔔</span>
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                            </Link>

                            {/* Divider */}
                            <div className="h-6 w-px" style={{ background: 'var(--border-secondary)' }}></div>

                            {/* Profile Dropdown (Simplified as button) */}
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden lg:block">
                                    <p className="text-sm font-medium">{user?.fullName}</p>
                                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('reader')}</p>
                                </div>
                                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: 'var(--accent-gradient)' }}>
                                    {user?.fullName?.charAt(0) || 'R'}
                                </div>
                                <button
                                    onClick={onLogout}
                                    className="p-2 rounded-lg transition-colors"
                                    style={{ color: 'var(--text-muted)' }}
                                    title={t('logout')}
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="flex md:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden glass-panel border-t border-slate-700/50 bg-slate-900/95 absolute w-full backdrop-blur-xl">
                        <div className="px-4 py-3 space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`block px-3 py-2 rounded-lg text-base font-medium flex items-center gap-3 ${
                                        location.pathname === item.path
                                            ? 'bg-indigo-500/10 text-indigo-400'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                    }`}
                                >
                                    <item.icon size={18} />
                                    {item.name}
                                </Link>
                            ))}
                            <Link
                                to="/notifications"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 flex items-center gap-3"
                            >
                                <Bell size={18} />
                                {t('notifications') || "Notifications"}
                            </Link>
                            <div className="pt-4 mt-4 border-t border-slate-700/50">
                                <div className="flex items-center px-3 mb-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white text-xs font-bold mr-3">
                                        {user?.fullName?.charAt(0) || 'R'}
                                    </div>
                                    <div>
                                        <div className="text-base font-medium text-white">{user?.fullName}</div>
                                        <div className="text-sm text-slate-400">{t('reader')}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={onLogout}
                                    className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-3"
                                >
                                    <LogOut size={18} />
                                    {t('logout')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
                {children}
            </main>

            {/* Chat Bot Floating Button */}
            <button className="fixed bottom-6 right-6 p-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 transition-all hover:scale-110 z-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/></svg>
            </button>
        </div>
    );
};

export default ReaderLayout;
