import { useState, useEffect, useCallback } from 'react';
import { Calendar, BookOpen, User, Clock, X, Plus, CheckCircle, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import CustomSelect from '../components/CustomSelect';
import { reservationsApi, booksApi, readersApi } from '../services/api';
import { showAlert, showSuccess, showConfirm } from '../utils/alert';

const Reservations = () => {
    const { t } = useLanguage();
    const [reservations, setReservations] = useState([]);
    const [books, setBooks] = useState([]);
    const [readers, setReaders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ readerId: '', bookId: '' });
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [resData, booksData, readersData] = await Promise.all([
                reservationsApi.getAll(),
                booksApi.getAll(),
                readersApi.getAll(),
            ]);
            setReservations(resData);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.readerId || !formData.bookId) {
            await showAlert(t('error'));
            return;
        }
        try {
            const res = await reservationsApi.create(formData);
            if (!res.ok) {
                const error = await res.json();
                await showAlert(error.error || t('error'));
                return;
            }
            setShowModal(false);
            setFormData({ readerId: '', bookId: '' });
            fetchData();
            await showSuccess(t('success'));
        } catch (error) {
            console.error(error);
        }
    };

    const handleCancel = async (id) => {
        const isConfirmed = await showConfirm(t('confirm') + '?');
        if (!isConfirmed) return;
        try {
            await reservationsApi.cancel(id);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleApprove = async (id) => {
        try {
            await reservationsApi.approve(id);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return <span className="badge badge-warning"><Clock size={12} className="mr-1" /> {t('pending')}</span>;
            case 'fulfilled':
                return <span className="badge badge-success"><CheckCircle size={12} className="mr-1" /> {t('fulfilled')}</span>;
            case 'cancelled':
                return <span className="badge bg-slate-700/50 text-slate-400 border-slate-600">{t('cancelled')}</span>;
            case 'expired':
                return <span className="badge badge-danger"><AlertTriangle size={12} className="mr-1" /> {t('expired')}</span>;
            default:
                return null;
        }
    };

    const readerOptions = readers.map(r => ({
        value: r.id,
        label: `${r.name} (${r.cardId})`
    }));

    const bookOptions = books.map(b => ({
        value: b.id,
        label: b.title
    }));

    if (loading && reservations.length === 0) {
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
                    <h1 className="text-3xl font-bold text-white mb-1">{t('reservations')}</h1>
                    <p className="text-slate-400">{t('manageReservations')}</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn-primary">
                    <Plus className="w-5 h-5" /> {t('newReservation')}
                </button>
            </div>

            {/* Reservations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reservations.map((r) => (
                    <div key={r.id} className="card p-6 group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-amber-400" />
                            </div>
                            {r.status === 'pending' && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleApprove(r.id)}
                                        className="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors opacity-0 group-hover:opacity-100"
                                        title={t('approve')}
                                    >
                                        <CheckCircle size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleCancel(r.id)}
                                        className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
                                        title={t('cancel')}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        <h3 className="font-semibold text-white mb-2">{r.Book?.title || 'Unknown Book'}</h3>
                        
                        <div className="space-y-2 text-sm mt-4">
                            <div className="flex items-center gap-2 text-slate-400">
                                <User size={14} className="text-slate-500" />
                                <span>{r.Reader?.name || 'Unknown'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                                <Clock size={14} className="text-slate-500" />
                                <span>{t('expiresAt')}: {r.expiresAt ? new Date(r.expiresAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
                            </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between">
                            {getStatusBadge(r.status)}
                            <span className="text-xs text-slate-500">
                                {new Date(r.reservedAt).toLocaleDateString('vi-VN')}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {reservations.length === 0 && (
                <div className="glass-panel p-12 text-center">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                    <p className="text-slate-400">{t('noReservations')}</p>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <div className="p-6 border-b border-slate-700/50">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white">{t('newReservation')}</h2>
                                <button onClick={() => setShowModal(false)} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                    <User size={14} /> {t('readers')}
                                </label>
                                <CustomSelect
                                    options={readerOptions}
                                    value={formData.readerId}
                                    onChange={(e) => setFormData({ ...formData, readerId: e.target.value })}
                                    placeholder={t('selectReader')}
                                    required
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                    <BookOpen size={14} /> {t('bookToReserve')}
                                </label>
                                <CustomSelect
                                    options={bookOptions}
                                    value={formData.bookId}
                                    onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
                                    placeholder={t('selectBook')}
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                                    {t('cancel')}
                                </button>
                                <button type="submit" className="btn-primary">{t('confirm')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reservations;
