import { useState, useEffect, useCallback } from 'react';
import { Repeat, UserCheck, BookOpenCheck, History, ArrowRight, CheckCircle, Clock, AlertTriangle, Calendar } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import CustomSelect from '../components/CustomSelect';
import { transactionsApi, booksApi, readersApi } from '../services/api';
import { showAlert, showSuccess, showConfirm } from '../utils/alert';

const Borrow = () => {
    const { t } = useLanguage();
    const [transactions, setTransactions] = useState([]);
    const [books, setBooks] = useState([]);
    const [readers, setReaders] = useState([]);
    const [formData, setFormData] = useState({ readerId: '', bookId: '', dueDate: '' });
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [transData, booksData, readersData] = await Promise.all([
                transactionsApi.getAll(),
                booksApi.getAll(),
                readersApi.getAll(),
            ]);
            setTransactions(transData);
            setBooks(booksData);
            setReaders(readersData);
        } catch (error) { 
            console.error(error); 
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleBorrow = async (e) => {
        e.preventDefault();
        if (!formData.readerId || !formData.bookId || !formData.dueDate) {
            await showAlert(t('error'));
            return;
        }
        try {
            await transactionsApi.borrow(formData);
            fetchData();
            setFormData({ readerId: '', bookId: '', dueDate: '' });
            await showSuccess(t('success'));
        } catch (error) {
            console.error(error);
            await showAlert(t('error'));
        }
    };

    const handleReturn = async (transactionId) => {
        const isConfirmed = await showConfirm(t('confirm') + '?');
        if (!isConfirmed) return;
        try {
            await transactionsApi.return(transactionId);
            fetchData();
        } catch (error) { console.error(error); }
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'BORROWED':
                return <span className="badge badge-warning"><Clock size={12} className="mr-1" /> {t('borrowed')}</span>;
            case 'RETURNED':
                return <span className="badge badge-success"><CheckCircle size={12} className="mr-1" /> {t('returned')}</span>;
            case 'OVERDUE':
                return <span className="badge badge-danger"><AlertTriangle size={12} className="mr-1" /> {t('overdue')}</span>;
            case 'EXTENDED':
                return <span className="badge badge-info"><Calendar size={12} className="mr-1" /> {t('extended')}</span>;
            default:
                return null;
        }
    };

    const readerOptions = readers.map(r => ({
        value: r.id,
        label: `${r.name} (${r.cardId})`
    }));

    const bookOptions = books.filter(b => {
        const available = (b.quantity || b.totalQty || 0) - (b.borrowedQty || 0);
        return available > 0;
    }).map(b => ({
        value: b.id,
        label: `${b.title} (${t('available')}: ${(b.quantity || b.totalQty || 0) - (b.borrowedQty || 0)})`
    }));

    if (loading && transactions.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-1">{t('borrowReturn')}</h1>
                <p className="text-slate-400">{t('recordTransaction')}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Borrow Form */}
                <div className="lg:col-span-1">
                    <div className="glass-panel p-6 sticky top-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                                <Repeat className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">{t('createLoan')}</h2>
                                <p className="text-xs text-slate-400">{t('recordTransaction')}</p>
                            </div>
                        </div>
                        
                        <form onSubmit={handleBorrow} className="space-y-5">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                    <UserCheck size={14} /> {t('readers')}
                                </label>
                                <CustomSelect
                                    options={readerOptions}
                                    value={formData.readerId}
                                    onChange={(e) => setFormData({...formData, readerId: e.target.value})}
                                    placeholder={t('selectReader')}
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                    <BookOpenCheck size={14} /> {t('title')}
                                </label>
                                <CustomSelect
                                    options={bookOptions}
                                    value={formData.bookId}
                                    onChange={(e) => setFormData({...formData, bookId: e.target.value})}
                                    placeholder={t('selectBook')}
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                    <Calendar size={14} /> {t('dueDate')}
                                </label>
                                <input 
                                    type="date" 
                                    required 
                                    className="input-field" 
                                    value={formData.dueDate} 
                                    onChange={e => setFormData({...formData, dueDate: e.target.value})} 
                                />
                            </div>
                            
                            <button type="submit" className="btn-primary w-full py-3.5 mt-2">
                                <ArrowRight size={18} /> {t('confirmBorrow')}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Transaction History */}
                <div className="lg:col-span-2">
                    <div className="glass-panel overflow-hidden">
                        <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-slate-700/50">
                                    <History className="w-5 h-5 text-slate-300" />
                                </div>
                                <h2 className="text-lg font-bold text-white">{t('transactionHistory')}</h2>
                            </div>
                            <span className="text-sm text-slate-400">{transactions.length} {t('transactions')}</span>
                        </div>
                        
                        <div className="divide-y divide-slate-700/30">
                            {transactions.map(tr => (
                                <div key={tr.id} className="p-5 hover:bg-slate-800/30 transition-colors flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/20 flex items-center justify-center shrink-0">
                                            <BookOpenCheck className="w-5 h-5 text-indigo-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium text-white truncate">
                                                {tr.Book ? tr.Book.title : 'Unknown Book'}
                                            </p>
                                            <p className="text-sm text-slate-400 truncate">
                                                {tr.Reader ? tr.Reader.name : 'Unknown Reader'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 shrink-0">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-xs text-slate-500">{t('borrowDate')}</p>
                                            <p className="text-sm text-slate-300">{tr.borrowDate}</p>
                                        </div>
                                        {getStatusBadge(tr.status)}
                                        {(tr.status === 'BORROWED' || tr.status === 'EXTENDED') && (
                                            <button 
                                                onClick={() => handleReturn(tr.id)} 
                                                className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors border border-emerald-500/20"
                                            >
                                                {t('returnBook')}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            
                            {transactions.length === 0 && (
                                <div className="p-12 text-center">
                                    <History className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                                    <p className="text-slate-400">{t('noTransactionsYet')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Borrow;
