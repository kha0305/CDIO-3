import { useState, useEffect, useCallback } from 'react';
import { Bell, Check, Info, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { notificationsApi } from '../services/api';

const Notifications = () => {
    const { t } = useLanguage();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const data = await notificationsApi.getAll();
            setNotifications(data.notifications || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const handleMarkRead = async (id) => {
        try {
            await notificationsApi.markRead(id);
            // Optimistic update
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            // Or refetch
            // fetchNotifications();
        } catch (error) { console.error(error); }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationsApi.markAllRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) { console.error(error); }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle className="w-5 h-5 text-emerald-400" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
            case 'error': return <XCircle className="w-5 h-5 text-rose-400" />;
            default: return <Info className="w-5 h-5 text-blue-400" />;
        }
    };

    if (loading && notifications.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">{t('notifications') || 'Notifications'}</h1>
                    <p className="text-slate-400">{t('manageNotifications') || 'Stay updated with system activities'}</p>
                </div>
                <button 
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors border border-slate-700/50"
                >
                    <Check size={16} />
                    {t('markAllRead') || 'Mark all as read'}
                </button>
            </div>

            <div className="space-y-4">
                {notifications.map((notif) => (
                    <div 
                        key={notif.id} 
                        className={`p-4 rounded-xl border transition-all ${
                            notif.isRead 
                                ? 'bg-slate-900/40 border-slate-800/50 opacity-70 hover:opacity-100' 
                                : 'bg-slate-800/60 border-indigo-500/30 shadow-lg shadow-indigo-500/5'
                        }`}
                        onClick={() => !notif.isRead && handleMarkRead(notif.id)}
                    >
                        <div className="flex gap-4">
                            <div className={`mt-1 p-2 rounded-lg ${
                                notif.type === 'success' ? 'bg-emerald-500/10' :
                                notif.type === 'warning' ? 'bg-amber-500/10' :
                                notif.type === 'error' ? 'bg-rose-500/10' : 'bg-blue-500/10'
                            }`}>
                                {getIcon(notif.type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-start justify-between gap-4">
                                    <h3 className={`font-semibold ${notif.isRead ? 'text-slate-400' : 'text-white'}`}>
                                        {notif.title}
                                    </h3>
                                    <span className="text-xs text-slate-500 whitespace-nowrap flex items-center gap-1">
                                        <Clock size={12} />
                                        {new Date(notif.createdAt).toLocaleString('vi-VN')}
                                    </span>
                                </div>
                                <p className={`mt-1 text-sm ${notif.isRead ? 'text-slate-500' : 'text-slate-300'}`}>
                                    {notif.message}
                                </p>
                            </div>
                            {!notif.isRead && (
                                <div className="mt-2">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500 block"></span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {notifications.length === 0 && (
                    <div className="text-center py-12 glass-panel">
                        <Bell className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                        <p className="text-slate-400">{t('noNotifications') || 'No notifications yet'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
