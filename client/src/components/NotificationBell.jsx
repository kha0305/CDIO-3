import { useState, useRef, useEffect, useCallback } from 'react';
import { Bell, Check, Clock, AlertTriangle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { notificationsApi } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';

const NotificationBell = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);

    const fetchNotifications = useCallback(async () => {
        try {
            const data = await notificationsApi.getAll();
            setNotifications(data.notifications || []);
            setUnreadCount(data.unreadCount || 0);
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
        // Poll every minute
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleViewAll = () => {
        setIsOpen(false);
        navigate('/notifications');
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <Check size={16} className="text-emerald-400" />;
            case 'warning': return <AlertTriangle size={16} className="text-amber-400" />;
            case 'error': return <AlertTriangle size={16} className="text-rose-400" />;
            default: return <Info size={16} className="text-blue-400" />;
        }
    };

    const getIconBg = (type) => {
        switch (type) {
            case 'success': return 'bg-emerald-500/10';
            case 'warning': return 'bg-amber-500/10';
            case 'error': return 'bg-rose-500/10';
            default: return 'bg-blue-500/10';
        }
    };

    return (
        <div ref={dropdownRef} className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                title={t('notifications')}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#1e293b] border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/40 z-50 overflow-hidden animate-slideUp">
                    <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
                        <h3 className="font-semibold text-white">{t('notifications') || 'Notifications'}</h3>
                        {unreadCount > 0 && (
                            <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-full">
                                {unreadCount} {t('new') || 'new'}
                            </span>
                        )}
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length > 0 ? notifications.slice(0, 5).map((notification) => (
                            <div 
                                key={notification.id}
                                className={`p-4 border-b border-slate-700/30 hover:bg-slate-800/50 transition-colors cursor-pointer ${!notification.isRead ? 'bg-slate-800/30' : ''}`}
                            >
                                <div className="flex gap-3">
                                    <div className={`w-8 h-8 rounded-lg ${getIconBg(notification.type)} flex items-center justify-center shrink-0`}>
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white">{notification.title}</p>
                                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{notification.message}</p>
                                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                            <Clock size={10} /> {new Date(notification.createdAt).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                    {!notification.isRead && (
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full shrink-0 mt-1"></div>
                                    )}
                                </div>
                            </div>
                        )) : (
                            <div className="p-8 text-center text-slate-500 text-sm">
                                {t('noNotifications') || 'No notifications'}
                            </div>
                        )}
                    </div>

                    <div className="p-3 border-t border-slate-700/50">
                        <button 
                            onClick={handleViewAll}
                            className="w-full py-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                            {t('viewAll') || 'View all'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
