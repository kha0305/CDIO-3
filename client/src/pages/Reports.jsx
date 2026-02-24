import { useState, useEffect } from 'react';
import { BarChart3, BookOpen, Users, TrendingUp, ArrowUp, ArrowDown, PieChart } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { statsApi } from '../services/api';

const Reports = () => {
    const { t } = useLanguage();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await statsApi.get();
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
                <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
    };

    // Mock data for charts
    const monthlyData = [
        { month: 'T1', borrows: 45, returns: 42 },
        { month: 'T2', borrows: 52, returns: 48 },
        { month: 'T3', borrows: 61, returns: 55 },
        { month: 'T4', borrows: 58, returns: 60 },
        { month: 'T5', borrows: 70, returns: 65 },
        { month: 'T6', borrows: 75, returns: 72 },
    ];

    const maxValue = Math.max(...monthlyData.flatMap(d => [d.borrows, d.returns]));

    const categoryData = [
        { name: 'Văn học', value: 35, color: 'bg-indigo-500' },
        { name: 'Khoa học', value: 25, color: 'bg-purple-500' },
        { name: 'Kỹ thuật', value: 20, color: 'bg-cyan-500' },
        { name: 'Kinh tế', value: 15, color: 'bg-emerald-500' },
        { name: 'Khác', value: 5, color: 'bg-slate-500' },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-1">{t('statistics')}</h1>
                <p className="text-slate-400">{t('libraryOverview')}</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="stat-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm">{t('totalBooks')}</p>
                            <p className="text-3xl font-bold text-white mt-1">{stats?.totalBooks || 0}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-blue-500/10">
                            <BookOpen className="w-6 h-6 text-blue-400" />
                        </div>
                    </div>
                    <div className="flex items-center gap-1 mt-3 text-sm text-emerald-400">
                        <ArrowUp size={14} /> +12% {t('thisMonth')}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm">{t('totalReaders')}</p>
                            <p className="text-3xl font-bold text-white mt-1">{stats?.totalReaders || 0}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-purple-500/10">
                            <Users className="w-6 h-6 text-purple-400" />
                        </div>
                    </div>
                    <div className="flex items-center gap-1 mt-3 text-sm text-emerald-400">
                        <ArrowUp size={14} /> +5% {t('thisMonth')}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm">{t('borrowsThisMonth')}</p>
                            <p className="text-3xl font-bold text-white mt-1">{stats?.borrowsThisMonth || 0}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-500/10">
                            <TrendingUp className="w-6 h-6 text-emerald-400" />
                        </div>
                    </div>
                    <div className="flex items-center gap-1 mt-3 text-sm text-emerald-400">
                        <ArrowUp size={14} /> +18% {t('thisMonth')}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm">{t('unpaidFines')}</p>
                            <p className="text-2xl font-bold text-white mt-1">{formatCurrency(stats?.unpaidFines)}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-rose-500/10">
                            <BarChart3 className="w-6 h-6 text-rose-400" />
                        </div>
                    </div>
                    <div className="flex items-center gap-1 mt-3 text-sm text-rose-400">
                        <ArrowDown size={14} /> -8% {t('thisMonth')}
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bar Chart */}
                <div className="lg:col-span-2 glass-panel p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-white">{t('monthlyStats')}</h2>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                                <span className="text-slate-400">{t('borrows')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                                <span className="text-slate-400">{t('returns')}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Simple Bar Chart */}
                    <div className="h-64 flex items-end justify-between gap-4">
                        {monthlyData.map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full flex gap-1 items-end justify-center h-48">
                                    <div 
                                        className="w-6 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-md transition-all hover:opacity-80" 
                                        style={{ height: `${(d.borrows / maxValue) * 100}%` }}
                                        title={`${t('borrows')}: ${d.borrows}`}
                                    ></div>
                                    <div 
                                        className="w-6 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md transition-all hover:opacity-80" 
                                        style={{ height: `${(d.returns / maxValue) * 100}%` }}
                                        title={`${t('returns')}: ${d.returns}`}
                                    ></div>
                                </div>
                                <span className="text-xs text-slate-500">{d.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="glass-panel p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <PieChart className="w-5 h-5 text-indigo-400" />
                        <h2 className="text-lg font-bold text-white">{t('byCategory')}</h2>
                    </div>
                    
                    {/* Simple Legend */}
                    <div className="space-y-4">
                        {categoryData.map((cat, i) => (
                            <div key={i}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-slate-300">{cat.name}</span>
                                    <span className="text-sm font-semibold text-white">{cat.value}%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full ${cat.color} rounded-full transition-all`}
                                        style={{ width: `${cat.value}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {stats?.totalBooks === 0 && (
                        <div className="text-center py-8 text-slate-500">
                            {t('noData')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reports;
