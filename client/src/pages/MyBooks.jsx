import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { BookOpen, Calendar, Clock, AlertCircle, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { transactionsApi, reservationsApi } from '../services/api';
import { showAlert, showSuccess, showConfirm } from '../utils/alert';

const MyBooks = () => {
    const { t } = useLanguage();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.pathname.includes('/history') ? 'history' : 'current');
    
    useEffect(() => {
        if (location.pathname.includes('/history')) {
            setActiveTab('history');
        } else {
            setActiveTab('current');
        }
    }, [location.pathname]);

    const [transactions, setTransactions] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const readerId = user?.readerId;

    const fetchData = useCallback(async () => {
        if (!readerId) return;
        
        try {
            setLoading(true);
            const [transData, resData] = await Promise.all([
                transactionsApi.getAll({ readerId }),
                reservationsApi.getAll()
            ]);
            
            setTransactions(transData);
            // Filter reservations for this reader
            setReservations(resData.filter(r => r.ReaderId === readerId));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [readerId]);

    useEffect(() => {
        if (readerId) {
            fetchData();
        }
    }, [fetchData, readerId]);

    const handleReturn = async (id) => {
        const isConfirmed = await showConfirm(t('confirmReturn') || "Return this book?");
        if (!isConfirmed) return;
        try {
            await transactionsApi.return(id);
            fetchData();
            await showSuccess(t('returnSuccess') || "Book returned successfully.");
        } catch (error) {
            console.error(error);
            await showAlert(error.error || t('error'));
        }
    };

    const handleExtend = async (transaction) => {
        const currentDue = new Date(transaction.dueDate);
        const newDue = new Date(currentDue);
        newDue.setDate(newDue.getDate() + 7); // Extend by 7 days
        const newDueDateStr = newDue.toISOString().split('T')[0];

        const isConfirmed = await showConfirm(t('confirmExtend') || `Extend due date to ${newDueDateStr}?`);
        if (!isConfirmed) return;

        try {
            await transactionsApi.extend(transaction.id, newDueDateStr);
            fetchData();
            await showSuccess(t('extendSuccess') || "Loan extended successfully.");
        } catch (error) {
            console.error(error);
            await showAlert(error.error || t('error'));
        }
    };

    const handleCancelReservation = async (id) => {
        const isConfirmed = await showConfirm(t('confirmCancel') || "Cancel this reservation?");
        if (!isConfirmed) return;
        try {
            await reservationsApi.cancel(id);
            fetchData();
            await showSuccess(t('cancelSuccess') || "Reservation cancelled.");
        } catch (error) {
            console.error(error);
            await showAlert(error.error || t('error'));
        }
    };

    if (!user || !user.readerId) {
        return (
            <div className="p-8 text-center text-slate-400">
                {t('loginRequired') || "Please login as a Reader to view this page."}
            </div>
        );
    }

    const currentLoans = transactions.filter(t => ['BORROWED', 'EXTENDED', 'OVERDUE'].includes(t.status));
    const historyComp = transactions.filter(t => t.status === 'RETURNED');
    const myReservations = reservations.filter(r => r.status === 'pending');

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">{t('myBooks')}</h1>

            {/* Tabs */}
            <div className="flex bg-slate-800/50 p-1 rounded-xl w-fit mb-8 border border-slate-700/50 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('current')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                        activeTab === 'current'
                            ? 'bg-indigo-500 text-white shadow-lg'
                            : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                >
                    {t('tabCurrentLoans')} ({currentLoans.length})
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                        activeTab === 'history'
                            ? 'bg-indigo-500 text-white shadow-lg'
                            : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                >
                    {t('tabReadingHistory')} ({historyComp.length})
                </button>
                <button
                    onClick={() => setActiveTab('reserved')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                        activeTab === 'reserved'
                            ? 'bg-indigo-500 text-white shadow-lg'
                            : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                >
                    {t('tabReservations')} ({myReservations.length})
                </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
                {loading && (
                    <div className="text-center py-10">
                        <div className="w-8 h-8 mx-auto border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                    </div>
                )}

                {!loading && activeTab === 'current' && (
                    <div className="space-y-4">
                        {currentLoans.length === 0 && <div className="text-center text-slate-500 py-8">{t('noLoans') || "No active loans."}</div>}
                        {currentLoans.map(loan => {
                            const dueDate = new Date(loan.dueDate);
                            const today = new Date();
                            const diffTime = dueDate - today;
                            const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                            
                            return (
                                <div key={loan.id} className="glass-panel p-6 flex flex-col md:flex-row items-center gap-6 group hover:border-indigo-500/30 transition-colors">
                                    <div className="w-16 h-24 bg-slate-700 rounded-lg shrink-0 overflow-hidden shadow-lg flex items-center justify-center">
                                         <BookOpen className="text-white/50" />
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-xl font-bold text-white mb-1">{loan.Book?.title || 'Unknown Book'}</h3>
                                        <p className="text-slate-400">{loan.Book?.author || 'Unknown Author'}</p>
                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-lg">
                                                <Calendar size={14} className="text-indigo-400" />
                                                {t('lblBorrowed')} {loan.borrowDate}
                                            </div>
                                            <div className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg ${
                                                daysLeft < 0 || loan.status === 'OVERDUE'
                                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                            }`}>
                                                <Clock size={14} />
                                                {loan.status === 'OVERDUE' ? t('overdue') : t('lblDue')} {loan.dueDate} 
                                                <span className="ml-1 opacity-75">
                                                    ({daysLeft > 0 ? t('daysLeft', { days: daysLeft }) : t('daysOverdue', { days: Math.abs(daysLeft) })})
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 w-full md:w-auto">
                                        <button 
                                            onClick={() => handleReturn(loan.id)}
                                            className="btn-primary w-full md:w-auto"
                                        >
                                            {t('returnBook')}
                                        </button>
                                         <button 
                                            onClick={() => handleExtend(loan)}
                                            disabled={loan.extensionCount >= 2 || loan.status === 'OVERDUE'}
                                            className="btn-secondary w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {t('btnExtendLoan')}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {!loading && activeTab === 'history' && (
                    <div className="grid grid-cols-1 gap-4">
                         {historyComp.length === 0 && <div className="text-center text-slate-500 py-8">{t('noHistory') || "No borrowing history."}</div>}
                        {historyComp.map(item => (
                            <div key={item.id} className="glass-panel p-4 flex items-center gap-4">
                                <div className="w-12 h-16 bg-slate-700 rounded-md shrink-0 flex items-center justify-center text-slate-500">
                                    <CheckCircle2 />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-white">{item.Book?.title}</h4>
                                    <p className="text-sm text-slate-400">{item.Book?.author}</p>
                                    <p className="text-xs text-slate-500 mt-1">{t('returnedDate')}: {item.returnDate}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && activeTab === 'reserved' && (
                    <div className="space-y-4">
                        {myReservations.length === 0 && <div className="text-center text-slate-500 py-8">{t('noReservations') || "No active reservations."}</div>}
                        {myReservations.map(res => (
                            <div key={res.id} className="glass-panel p-6 flex items-center justify-between gap-4">
                                <div>
                                    <h4 className="font-bold text-white text-lg">{res.Book?.title}</h4>
                                    <p className="text-slate-400">{res.Book?.author}</p>
                                    <p className="text-sm text-indigo-400 mt-1">Expires: {new Date(res.expiresAt).toLocaleDateString()}</p>
                                </div>
                                <button 
                                    onClick={() => handleCancelReservation(res.id)}
                                    className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-2"
                                >
                                    <XCircle size={18} />
                                    {t('cancel')}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBooks;
