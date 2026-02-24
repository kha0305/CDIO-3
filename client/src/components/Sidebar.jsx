import { useState } from 'react';
import { LogOut, Settings, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import SettingsModal from './SettingsModal';

const Sidebar = ({ user, onLogout, menuItems, extraMenuItems }) => {
    const location = useLocation();
    const { t } = useLanguage();
    const [showSettings, setShowSettings] = useState(false);

    const renderMenuItems = (items) => (
        <div className="space-y-1">
            {items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <Link 
                        key={item.path} 
                        to={item.path}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative"
                        style={{
                            background: isActive 
                                ? 'var(--accent-gradient)' 
                                : 'transparent',
                            color: isActive ? 'white' : 'var(--text-muted)',
                            boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.25)' : 'none'
                        }}
                    >
                        <item.icon 
                            className="w-5 h-5 transition-colors"
                            style={{ 
                                color: isActive ? 'white' : 'var(--text-muted)'
                            }}
                        />
                        <span className="font-medium">{item.name}</span>
                        {isActive && (
                            <ChevronRight size={16} className="ml-auto text-white/70" />
                        )}
                    </Link>
                );
            })}
        </div>
    );

    return (
        <>
            <aside 
                className="sidebar w-72 min-h-screen flex flex-col"
                style={{ 
                    background: 'var(--bg-primary)',
                    borderRight: '1px solid var(--border-secondary)'
                }}
            >
                {/* Logo */}
                <div className="p-6">
                    <div className="flex items-center gap-3">
                        <div 
                            className="w-11 h-11 rounded-xl flex items-center justify-center p-2"
                            style={{ background: 'var(--accent-gradient)', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}
                        >
                            <svg viewBox="0 0 64 64" className="w-full h-full">
                                <rect x="8" y="12" width="48" height="10" rx="2" fill="white" transform="rotate(-8 32 17)"/>
                                <rect x="8" y="26" width="48" height="10" rx="2" fill="white" opacity="0.85" transform="rotate(3 32 31)"/>
                                <rect x="8" y="40" width="48" height="10" rx="2" fill="white" opacity="0.7" transform="rotate(-2 32 45)"/>
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold">LibManager</h1>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('libraryManagement')}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 mt-2 space-y-6 overflow-y-auto">
                    <div>
                        <p 
                            className="px-4 text-xs font-semibold uppercase tracking-wider mb-3"
                            style={{ color: 'var(--text-light)' }}
                        >
                            {t('mainMenu')}
                        </p>
                        {renderMenuItems(menuItems || [])}
                    </div>
                    {extraMenuItems && extraMenuItems.length > 0 && (
                        <div>
                            <p 
                                className="px-4 text-xs font-semibold uppercase tracking-wider mb-3"
                                style={{ color: 'var(--text-light)' }}
                            >
                                {t('utilities')}
                            </p>
                            {renderMenuItems(extraMenuItems)}
                        </div>
                    )}
                </nav>

                {/* User Profile */}
                <div className="p-4 mt-auto">
                    <div 
                        className="p-4 rounded-2xl"
                        style={{ 
                            background: 'var(--bg-secondary)', 
                            border: '1px solid var(--border-secondary)' 
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                style={{ background: 'var(--accent-gradient)' }}
                            >
                                {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">{user?.fullName || 'User'}</p>
                                <p className="text-xs truncate capitalize" style={{ color: 'var(--text-muted)' }}>
                                    {user?.role || 'reader'}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                            <button 
                                onClick={() => setShowSettings(true)}
                                className="flex-1 px-3 py-2.5 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5"
                                style={{ 
                                    background: 'var(--bg-tertiary)', 
                                    color: 'var(--text-secondary)'
                                }}
                            >
                                <Settings size={14} />
                                {t('settings')}
                            </button>
                            <button 
                                onClick={onLogout}
                                className="flex-1 px-3 py-2.5 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 hover:bg-red-500/10"
                                style={{ 
                                    background: 'var(--bg-tertiary)', 
                                    color: 'var(--danger)'
                                }}
                            >
                                <LogOut size={14} />
                                {t('logout')}
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Settings Modal */}
            <SettingsModal 
                isOpen={showSettings} 
                onClose={() => setShowSettings(false)} 
            />
        </>
    );
};

export default Sidebar;
