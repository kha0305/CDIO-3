import { useState, useEffect, useCallback } from 'react';
import { BookOpen, Search, Plus, Edit3, Trash2, X, Filter, Save, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { booksApi } from '../services/api';
import { showConfirm } from '../utils/alert';

const Books = () => {
    const { t } = useLanguage();
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [formData, setFormData] = useState({ 
        title: '', author: '', category: '', quantity: 1, isbn: '', 
        coverUrl: '', description: '', publisher: '', publishYear: new Date().getFullYear() 
    });
    const [loading, setLoading] = useState(true);

    const fetchBooks = useCallback(async () => {
        try {
            setLoading(true);
            const data = await booksApi.getAll();
            setBooks(data);
        } catch (error) { 
            console.error(error); 
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    const handleEdit = (book) => {
        setEditingBook(book);
        setFormData({
            title: book.title,
            author: book.author,
            category: book.category || '',
            quantity: book.quantity || book.totalQty || 1,
            isbn: book.isbn || '',
            coverUrl: book.coverUrl || '',
            description: book.description || '',
            publisher: book.publisher || '',
            publishYear: book.publishYear || new Date().getFullYear(),
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSubmit = {
                ...formData,
                totalQty: formData.quantity 
            };
            if (editingBook) {
                await booksApi.update(editingBook.id, dataToSubmit);
            } else {
                await booksApi.create(dataToSubmit);
            }
            fetchBooks();
            setShowModal(false);
            setEditingBook(null);
            setFormData({ title: '', author: '', category: '', quantity: 1, isbn: '', coverUrl: '', description: '', publisher: '', publishYear: new Date().getFullYear() });
        } catch (error) { console.error(error); }
    };

    const handleDelete = async (id) => {
        const isConfirmed = await showConfirm(t('confirm') + '?');
        if (!isConfirmed) return;
        try {
            await booksApi.delete(id);
            fetchBooks();
        } catch (error) { console.error(error); }
    };

    const filteredBooks = books.filter(b => 
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && books.length === 0) {
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
                    <h1 className="text-3xl font-bold text-white mb-1">{t('bookManagement')}</h1>
                    <p className="text-slate-400">{books.length} {t('booksInStock')}</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                        <input 
                            type="text" 
                            placeholder={t('searchBooks')}
                            className="input-field w-64"
                            style={{ paddingLeft: '3rem' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn-icon">
                        <Filter size={20} />
                    </button>
                    <button 
                        onClick={() => {
                            setEditingBook(null);
                            setFormData({ title: '', author: '', category: '', quantity: 1, isbn: '', coverUrl: '', description: '', publisher: '', publishYear: new Date().getFullYear() });
                            setShowModal(true);
                        }}
                        className="btn-primary"
                    >
                        <Plus className="w-5 h-5" /> {t('addBook')}
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>{t('title')}</th>
                            <th>{t('author')}</th>
                            <th>{t('category')}</th>
                            <th>{t('quantity')}</th>
                            <th>{t('available')}</th>
                            <th>{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBooks.map(book => (
                            <tr key={book.id}>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center shrink-0" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
                                            {book.coverUrl ? (
                                                <img src={book.coverUrl} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <BookOpen className="w-4 h-4" style={{ color: 'var(--text-light)' }} />
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-medium">{book.title}</div>
                                            <div className="text-xs font-mono" style={{ color: 'var(--text-light)' }}>{book.isbn}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{book.author}</td>
                                <td>
                                    <span className="badge badge-info">{book.category || t('uncategorized')}</span>
                                </td>
                                <td>{book.quantity || book.totalQty || 0}</td>
                                <td>
                                    <span className={`font-semibold ${((book.quantity || book.totalQty || 0) - (book.borrowedQty || 0)) > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {(book.quantity || book.totalQty || 0) - (book.borrowedQty || 0)}
                                    </span>
                                </td>
                                <td>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => handleEdit(book)}
                                            className="action-btn action-btn-edit"
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(book.id)}
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
                {filteredBooks.length === 0 && (
                    <div className="p-12 text-center">
                        <BookOpen className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                        <p className="text-slate-400">{t('noBooksFound')}</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-backdrop">
                    <div className="modal-content max-w-2xl">
                        <div className="p-6" style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold">
                                    {editingBook ? t('edit') + ' ' + t('title').toLowerCase() : t('addBook')}
                                </h2>
                                <button onClick={() => { setShowModal(false); setEditingBook(null); }} className="action-btn" style={{ color: 'var(--text-muted)' }}>
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{t('title')}</label>
                                    <input type="text" required className="input-field" placeholder={t('title')} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{t('author')}</label>
                                    <input type="text" required className="input-field" placeholder={t('author')} value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>ISBN</label>
                                    <input type="text" className="input-field" placeholder="ISBN" value={formData.isbn} onChange={e => setFormData({...formData, isbn: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{t('category')}</label>
                                    <input type="text" className="input-field" placeholder={t('category')} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{t('quantity')}</label>
                                    <input type="number" min="1" required className="input-field" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Publisher</label>
                                    <input type="text" className="input-field" placeholder="Publisher" value={formData.publisher} onChange={e => setFormData({...formData, publisher: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Year</label>
                                    <input type="number" className="input-field" placeholder="Year" value={formData.publishYear} onChange={e => setFormData({...formData, publishYear: e.target.value})} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Cover URL</label>
                                    <div className="relative">
                                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                                        <input type="text" className="input-field" style={{ paddingLeft: '3rem' }} placeholder="https://example.com/image.jpg" value={formData.coverUrl} onChange={e => setFormData({...formData, coverUrl: e.target.value})} />
                                    </div>
                                    {formData.coverUrl && (
                                        <div className="mt-2 h-32 w-24 rounded-lg overflow-hidden" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)' }}>
                                            <img src={formData.coverUrl} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Description</label>
                                    <textarea rows="3" className="input-field resize-none" placeholder="Book description..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-3 pt-4 mt-4" style={{ borderTop: '1px solid var(--border-secondary)' }}>
                                <button type="button" onClick={() => { setShowModal(false); setEditingBook(null); }} className="btn-secondary">
                                    {t('cancel')}
                                </button>
                                <button type="submit" className="btn-primary">
                                    <Save size={18} /> {editingBook ? t('save') : t('add')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Books;
