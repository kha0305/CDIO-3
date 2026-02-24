import { useState, useEffect } from 'react';
import { BookOpen, Users, Clock, AlertCircle, TrendingUp, Activity, ArrowUpRight, DollarSign, Calendar, BarChart3 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import NotificationBell from '../components/NotificationBell';

const Dashboard = () => {
    const { t } = useLanguage();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/stats');
                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-t-2 rounded-full animate-spin" style={{ borderColor: 'var(--border-secondary)', borderTopColor: 'var(--accent-primary)' }}></div>
            </div>
        );
    }

    const statCards = [
        { 
            title: t('totalBooks'), 
            value: stats?.totalBooks || 0, 
            icon: BookOpen, 
            trend: '+12%',
            color: '#3b82f6',
            bgColor: 'rgba(59, 130, 246, 0.1)'
        },
        { 
            title: t('totalReaders'), 
            value: stats?.totalReaders || 0, 
            icon: Users, 
            trend: '+5%',
            color: '#8b5cf6',
            bgColor: 'rgba(139, 92, 246, 0.1)'
        },
        { 
            title: t('borrowedBooks'), 
            value: stats?.activeBorrows || 0, 
            icon: Clock, 
            trend: '+8%',
            color: '#f59e0b',
            bgColor: 'rgba(245, 158, 11, 0.1)'
        },
        { 
            title: t('overdueBooks'), 
            value: stats?.overdueCount || 0, 
            icon: AlertCircle, 
            trend: '-2%',
            color: '#ef4444',
            bgColor: 'rgba(239, 68, 68, 0.1)'
        },
    ];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
    };

    return (
        <div className="max-w-7xl mx-auto animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-1">{t('dashboard')}</h1>
                    <p style={{ color: 'var(--text-muted)' }}>{t('welcome', { name: 'Admin' })}</p>
                </div>
                <div className="flex items-center gap-3">
                    <NotificationBell />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {statCards.map((stat, index) => (
                    <div 
                        key={index} 
                        className="stat-card group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div 
                                className="p-3 rounded-xl"
                                style={{ background: stat.bgColor }}
                            >
                                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                            </div>
                            <div 
                                className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
                                style={{ 
                                    background: stat.trend.startsWith('+') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    color: stat.trend.startsWith('+') ? 'var(--success)' : 'var(--danger)'
                                }}
                            >
                                <TrendingUp size={12} />
                                {stat.trend}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>{stat.title}</p>
                            <p className="text-3xl font-bold">{stat.value.toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                <div className="glass-panel p-5 flex items-center gap-4">
                    <div className="p-3 rounded-xl" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
                        <Calendar className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
                    </div>
                    <div>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('pendingReservations')}</p>
                        <p className="text-2xl font-bold">{stats?.pendingReservations || 0}</p>
                    </div>
                </div>
                <div className="glass-panel p-5 flex items-center gap-4">
                    <div className="p-3 rounded-xl" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                        <TrendingUp className="w-6 h-6" style={{ color: 'var(--success)' }} />
                    </div>
                    <div>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('borrowsThisMonth')}</p>
                        <p className="text-2xl font-bold">{stats?.borrowsThisMonth || 0}</p>
                    </div>
                </div>
                <div className="glass-panel p-5 flex items-center gap-4">
                    <div className="p-3 rounded-xl" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                        <DollarSign className="w-6 h-6" style={{ color: 'var(--danger)' }} />
                    </div>
                    <div>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('unpaidFines')}</p>
                        <p className="text-2xl font-bold">{formatCurrency(stats?.unpaidFines)}</p>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activities */}
                <div className="lg:col-span-2 glass-panel p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
                                <Activity className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                            </div>
                            <h2 className="text-lg font-semibold">{t('recentTransactions')}</h2>
                        </div>
                        <button 
                            className="text-sm font-medium flex items-center gap-1 transition-colors hover:opacity-80"
                            style={{ color: 'var(--accent-primary)' }}
                        >
                            {t('viewAll')} <ArrowUpRight size={14} />
                        </button>
                    </div>
                    <div className="space-y-3">
                        {stats?.recentTransactions && stats.recentTransactions.length > 0 ? (
                            stats.recentTransactions.slice(0, 5).map((tr) => (
                                <div 
                                    key={tr.id} 
                                    className="flex items-center gap-4 p-4 rounded-xl transition-colors cursor-pointer"
                                    style={{ background: 'var(--bg-secondary)' }}
                                >
                                    <div 
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                                        style={{ background: 'var(--accent-gradient)' }}
                                    >
                                        {tr.Reader?.name?.charAt(0) || '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{tr.Reader?.name || 'Unknown'}</p>
                                        <p className="text-sm truncate" style={{ color: 'var(--text-muted)' }}>
                                            {tr.Book?.title || 'Unknown Book'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span 
                                            className="badge"
                                            style={{
                                                background: tr.status === 'returned' ? 'rgba(16, 185, 129, 0.1)' : tr.status === 'overdue' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                                color: tr.status === 'returned' ? 'var(--success)' : tr.status === 'overdue' ? 'var(--danger)' : 'var(--info)'
                                            }}
                                        >
                                            {tr.status}
                                        </span>
                                        <p className="text-xs mt-1" style={{ color: 'var(--text-light)' }}>
                                            {new Date(tr.borrowDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <Activity size={40} strokeWidth={1} className="mx-auto mb-3" style={{ color: 'var(--text-light)' }} />
                                <p style={{ color: 'var(--text-muted)' }}>{t('noTransactions')}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Notifications Panel */}
                <div className="glass-panel p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
                            <BarChart3 className="w-5 h-5" style={{ color: '#8b5cf6' }} />
                        </div>
                        <h2 className="text-lg font-semibold">{t('notifications')}</h2>
                    </div>
                    
                    <div className="space-y-4">
                        {/* System Status */}
                        <div 
                            className="p-4 rounded-xl"
                            style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <span className="text-sm font-medium" style={{ color: 'var(--success)' }}>{t('systemNormal')}</span>
                            </div>
                        </div>
                        
                        {/* Overdue Warning */}
                        {(stats?.overdueCount || 0) > 0 && (
                            <div 
                                className="p-4 rounded-xl"
                                style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                            >
                                <div className="flex items-start gap-2">
                                    <AlertCircle size={16} style={{ color: 'var(--danger)' }} className="mt-0.5" />
                                    <div>
                                        <span className="text-sm font-medium" style={{ color: 'var(--danger)' }}>
                                            {t('overdueWarning', { count: stats.overdueCount })}
                                        </span>
                                        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{t('needAttention')}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Reservations Warning */}
                        {(stats?.pendingReservations || 0) > 0 && (
                            <div 
                                className="p-4 rounded-xl"
                                style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}
                            >
                                <div className="flex items-start gap-2">
                                    <Calendar size={16} style={{ color: 'var(--warning)' }} className="mt-0.5" />
                                    <div>
                                        <span className="text-sm font-medium" style={{ color: 'var(--warning)' }}>
                                            {t('reservationWarning', { count: stats.pendingReservations })}
                                        </span>
                                        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{t('needProcess')}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
