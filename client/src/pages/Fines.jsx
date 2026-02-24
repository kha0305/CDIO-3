import { useState, useEffect, useCallback } from 'react';
import { DollarSign, CheckCircle, Clock, User, AlertCircle, Filter } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import CustomSelect from '../components/CustomSelect';
import { finesApi } from '../services/api';
import { showConfirm } from '../utils/alert';

const Fines = () => {
    const { t } = useLanguage();
    const [fines, setFines] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    const fetchFines = useCallback(async () => {
        try {
            setLoading(true);
            const data = await finesApi.getAll(filter);
            setFines(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchFines();
    }, [fetchFines]);

    const handlePay = async (id) => {
        const isConfirmed = await showConfirm(t('confirm') + '?');
        if (!isConfirmed) return;
        try {
            await finesApi.pay(id);
            fetchFines();
        } catch (error) {
            console.error(error);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const totalUnpaid = fines.filter(f => !f.paid).reduce((sum, f) => sum + parseFloat(f.amount), 0);

    const filterOptions = [
        { value: 'all', label: t('all') },
        { value: 'unpaid', label: t('unpaid') },
        { value: 'paid', label: t('paid') },
    ];

    if (loading && fines.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">{t('fineManagement')}</h1>
                    <p className="text-slate-400">{t('trackFines')}</p>
                </div>
                <div className="flex items-center gap-3">
                    <Filter size={18} className="text-slate-400" />
                    <CustomSelect
                        options={filterOptions}
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder={t('filter')}
                        className="w-48"
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="stat-card">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-rose-500/10">
                            <DollarSign className="w-6 h-6 text-rose-400" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">{t('unpaid')}</p>
                            <p className="text-2xl font-bold text-white">{formatCurrency(totalUnpaid)}</p>
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-amber-500/10">
                            <Clock className="w-6 h-6 text-amber-400" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">{t('pendingPayment')}</p>
                            <p className="text-2xl font-bold text-white">{fines.filter(f => !f.paid).length}</p>
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-emerald-500/10">
                            <CheckCircle className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">{t('paid')}</p>
                            <p className="text-2xl font-bold text-white">{fines.filter(f => f.paid).length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fines List */}
            <div className="glass-panel overflow-hidden">
                <div className="p-6 border-b border-slate-700/50">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <AlertCircle className="text-rose-400" size={20} />
                        {t('fineList')}
                    </h2>
                </div>
                
                <div className="divide-y divide-slate-700/30">
                    {fines.map((fine) => (
                        <div key={fine.id} className="p-5 hover:bg-slate-800/30 transition-colors flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 min-w-0">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${fine.paid ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'} border`}>
                                    {fine.paid ? (
                                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                                    ) : (
                                        <DollarSign className="w-5 h-5 text-rose-400" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-medium text-white truncate">
                                        {fine.Transaction?.Book?.title || 'Unknown Book'}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                                        <span className="flex items-center gap-1">
                                            <User size={12} />
                                            {fine.Transaction?.Reader?.name || 'Unknown'}
                                        </span>
                                        <span>{fine.reason}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 shrink-0">
                                <div className="text-right">
                                    <p className={`text-lg font-bold ${fine.paid ? 'text-slate-500 line-through' : 'text-rose-400'}`}>
                                        {formatCurrency(fine.amount)}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {new Date(fine.createdAt).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                                {!fine.paid && (
                                    <button
                                        onClick={() => handlePay(fine.id)}
                                        className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors border border-emerald-500/20"
                                    >
                                        {t('collectFine')}
                                    </button>
                                )}
                                {fine.paid && (
                                    <span className="badge badge-success">{t('collected')}</span>
                                )}
                            </div>
                        </div>
                    ))}
                    
                    {fines.length === 0 && (
                        <div className="p-12 text-center">
                            <DollarSign className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                            <p className="text-slate-400">{t('noFines')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Fines;
