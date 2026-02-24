import { useState, useEffect, useCallback } from 'react';
import { Users2, Search, Plus, Edit3, Trash2, X, Save, Mail, Phone } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import CustomSelect from '../components/CustomSelect';
import { readersApi } from '../services/api';
import { showConfirm } from '../utils/alert';

const Readers = () => {
    const { t } = useLanguage();
    const [readers, setReaders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingReader, setEditingReader] = useState(null);
    const [formData, setFormData] = useState({ cardId: '', name: '', email: '', phone: '', status: 'ACTIVE' });
    const [loading, setLoading] = useState(true);

    const fetchReaders = useCallback(async () => {
        try {
            setLoading(true);
            const data = await readersApi.getAll();
            setReaders(data);
        } catch (error) { 
            console.error(error); 
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReaders();
    }, [fetchReaders]);

    const handleEdit = (reader) => {
        setEditingReader(reader);
        setFormData({
            cardId: reader.cardId,
            name: reader.name,
            email: reader.email || '',
            phone: reader.phone || '',
            status: reader.status || 'ACTIVE',
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingReader) {
                await readersApi.update(editingReader.id, formData);
            } else {
                await readersApi.create(formData);
            }
            fetchReaders();
            setShowModal(false);
            setEditingReader(null);
            setFormData({ cardId: '', name: '', email: '', phone: '', status: 'ACTIVE' });
        } catch (error) { console.error(error); }
    };

    const handleDelete = async (id) => {
        const isConfirmed = await showConfirm(t('confirm') + '?');
        if (!isConfirmed) return;
        try {
            await readersApi.delete(id);
            fetchReaders();
        } catch (error) { console.error(error); }
    };

    const filteredReaders = readers.filter(r => 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        r.cardId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status) => {
        const normalizedStatus = status ? status.toUpperCase() : '';
        switch(normalizedStatus) {
            case 'ACTIVE': return <span className="badge badge-success">{t('active')}</span>;
            case 'SUSPENDED': return <span className="badge badge-danger">{t('suspended')}</span>;
            case 'EXPIRED': return <span className="badge badge-warning">{t('expired')}</span>;
            default: return <span className="badge badge-info">{status}</span>;
        }
    };

    const statusOptions = [
        { value: 'ACTIVE', label: t('active') },
        { value: 'SUSPENDED', label: t('suspended') },
        { value: 'EXPIRED', label: t('expired') },
    ];

    if (loading && readers.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">{t('readers')}</h1>
                    <p className="text-slate-400">{readers.length} {t('membersList')}</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                        <input 
                            type="text" 
                            placeholder={t('searchReaders')}
                            className="input-field w-64"
                            style={{ paddingLeft: '3rem' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="btn-primary"
                    >
                        <Plus className="w-5 h-5" /> {t('addMember')}
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>{t('cardId')}</th>
                            <th>{t('name')}</th>
                            <th>{t('email')}</th>
                            <th>{t('phone')}</th>
                            <th>{t('status')}</th>
                            <th>{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReaders.map(reader => (
                            <tr key={reader.id}>
                                <td>
                                    <span className="font-mono text-indigo-400">{reader.cardId}</span>
                                </td>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm" style={{ background: 'var(--accent-gradient)' }}>
                                            {reader.name.charAt(0)}
                                        </div>
                                        <span className="font-medium">{reader.name}</span>
                                    </div>
                                </td>
                                <td>
                                    {reader.email && (
                                        <span className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                                            <Mail size={14} /> {reader.email}
                                        </span>
                                    )}
                                </td>
                                <td>
                                    {reader.phone && (
                                        <span className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                                            <Phone size={14} /> {reader.phone}
                                        </span>
                                    )}
                                </td>
                                <td>{getStatusBadge(reader.status)}</td>
                                <td>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => handleEdit(reader)}
                                            className="action-btn action-btn-edit"
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(reader.id)}
                                            className="action-btn action-btn-delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredReaders.length === 0 && (
                    <div className="p-12 text-center">
                        <Users2 className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                        <p className="text-slate-400">{t('noReadersFound')}</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <div className="p-6" style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold">
                                    {editingReader ? t('edit') + ' ' + t('readers').toLowerCase() : t('addMember')}
                                </h2>
                                <button onClick={() => { setShowModal(false); setEditingReader(null); }} className="action-btn" style={{ color: 'var(--text-muted)' }}>
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{t('cardId')}</label>
                                <input type="text" required className="input-field" placeholder={t('cardId')} value={formData.cardId} onChange={e => setFormData({...formData, cardId: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{t('name')}</label>
                                <input type="text" required className="input-field" placeholder={t('name')} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{t('email')}</label>
                                <input type="email" className="input-field" placeholder={t('email')} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{t('phone')}</label>
                                <input type="tel" className="input-field" placeholder={t('phone')} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{t('status')}</label>
                                <CustomSelect
                                    options={statusOptions}
                                    value={formData.status}
                                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => { setShowModal(false); setEditingReader(null); }} className="btn-secondary">
                                    {t('cancel')}
                                </button>
                                <button type="submit" className="btn-primary">
                                    <Save size={18} /> {editingReader ? t('save') : t('add')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Readers;
