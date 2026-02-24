import { useState, useEffect } from 'react';
import { booksApi, reservationsApi } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';
import BookDetailsModal from '../components/BookDetailsModal';
import { showAlert, showSuccess, showConfirm } from '../utils/alert';

const ReaderDashboard = () => {
    const { t, language } = useLanguage();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('title');
    const [selectedBook, setSelectedBook] = useState(null);

    // Bilingual categories
    const categories = [
        { key: 'all', vi: 'Tất cả', en: 'All' },
        { key: 'romance', vi: 'Lãng mạn', en: 'Romance' },
        { key: 'science fiction', vi: 'Khoa học viễn tưởng', en: 'Science Fiction' },
        { key: 'fantasy', vi: 'Giả tưởng', en: 'Fantasy' },
        { key: 'mystery', vi: 'Bí ẩn', en: 'Mystery' },
        { key: 'horror', vi: 'Kinh dị', en: 'Horror' },
        { key: 'biography', vi: 'Tiểu sử', en: 'Biography' },
        { key: 'history', vi: 'Lịch sử', en: 'History' },
        { key: 'cooking', vi: 'Nấu ăn', en: 'Cooking' },
        { key: 'business', vi: 'Kinh doanh', en: 'Business' },
        { key: 'children', vi: 'Thiếu nhi', en: 'Children' },
        { key: 'classics', vi: 'Kinh điển', en: 'Classics' }
    ];

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const data = await booksApi.getAll();
                setBooks(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    const handleBorrow = async (book) => {
        const storedUser = localStorage.getItem('user');
        const user = storedUser ? JSON.parse(storedUser) : null;

        if (!user || user.role !== 'reader') {
             if (!user?.readerId) {
                 await showAlert(t('loginRequired') || "Please login as a Reader first.");
                 return;
             }
        }

        if (!user?.readerId) {
             await showAlert(t('loginRequired') || "Please login again to update your account.");
             return;
        }

        const isConfirmed = await showConfirm(t('confirmBorrow') || `Do you want to reserve "${book.title}"?`);
        if (!isConfirmed) return;

        try {
            await reservationsApi.create({
                readerId: user.readerId,
                bookId: book.id
            });
            await showSuccess(t('reservationSuccess') || "Book reserved successfully!");
            setSelectedBook(null);
        } catch (error) {
            console.error(error);
            await showAlert(error.error || t('error'));
        }
    };

    const filteredBooks = books
        .filter(book => {
            if (filter === 'all') return true;
            return (book.category || '').toLowerCase().includes(filter);
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'title':
                    return (a.title || '').localeCompare(b.title || '');
                case 'author':
                    return (a.author || '').localeCompare(b.author || '');
                case 'newest':
                    return (b.publishYear || 0) - (a.publishYear || 0);
                case 'oldest':
                    return (a.publishYear || 0) - (b.publishYear || 0);
                default:
                    return 0;
            }
        });

    return (
        <div className="space-y-10 pb-12 animate-fadeIn">
            {/* Hero Section - Compact */}
            <div className="relative rounded-2xl overflow-hidden">
                {/* Background with overlay */}
                <div className="absolute inset-0 hero-gradient"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
                
                <div className="relative z-10 px-6 md:px-8 py-8 md:py-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="max-w-xl">
                            <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#ffffff' }}>
                                {t('discoverBooks')}
                            </h1>
                            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                                {t('exploreBooks', { count: books.length, categories: categories.length - 1 })}
                            </p>
                        </div>
                        
                        {/* Stats inline */}
                        <div className="flex gap-6">
                            <div className="text-center">
                                <p className="text-xl font-bold" style={{ color: '#ffffff' }}>{books.length}+</p>
                                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>{t('books')}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-bold" style={{ color: '#ffffff' }}>{categories.length - 1}</p>
                                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>{t('categories')}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-bold" style={{ color: '#ffffff' }}>24/7</p>
                                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>{t('access')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div>
                {/* Header Row - Title + Sort */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold">{t('popularBooks')}</h2>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {t('showing', { count: filteredBooks.length })}
                        </p>
                    </div>
                    
                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="text-sm py-2 px-4 pr-8 rounded-lg cursor-pointer font-medium appearance-none"
                        style={{
                            background: `var(--bg-secondary) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236366f1' d='M2 4l4 4 4-4'/%3E%3C/svg%3E") no-repeat right 12px center`,
                            border: '1px solid var(--border-primary)',
                            color: 'var(--text-primary)',
                            boxShadow: 'var(--shadow-sm)'
                        }}
                    >
                        <option value="title">{t('sortByTitle')}</option>
                        <option value="author">{t('sortByAuthor')}</option>
                        <option value="newest">{t('sortByNewest')}</option>
                        <option value="oldest">{t('sortByOldest')}</option>
                    </select>
                </div>
                
                {/* Category Pills - Single Row */}
                <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-thin">
                    {categories.map(cat => (
                        <button 
                            key={cat.key}
                            onClick={() => setFilter(cat.key)}
                            className={`category-pill whitespace-nowrap ${filter === cat.key ? 'active' : ''}`}
                        >
                            {language === 'vi' ? cat.vi : cat.en}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {Array(10).fill(0).map((_, i) => (
                            <div key={i} className="book-card">
                                <div className="aspect-[2/3] skeleton"></div>
                                <div className="p-4 space-y-3">
                                    <div className="h-5 skeleton w-3/4"></div>
                                    <div className="h-4 skeleton w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {filteredBooks.map((book) => {
                            const total = book.totalQty || book.quantity || 0;
                            const borrowed = book.borrowedQty || 0;
                            const available = total - borrowed;
                             
                            return (
                                <div 
                                    key={book.id} 
                                    onClick={() => setSelectedBook(book)} 
                                    className="book-card group cursor-pointer"
                                >
                                    {/* Image */}
                                    <div className="aspect-[2/3] relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                                        {book.coverUrl ? (
                                            <img 
                                                src={book.coverUrl} 
                                                alt={book.title}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
                                                <span className="text-4xl font-bold" style={{ color: 'var(--text-light)' }}>{book.title?.charAt(0) || 'B'}</span>
                                            </div>
                                        )}
                                        
                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedBook(book);
                                                    }}
                                                    className="w-full py-2.5 bg-white text-slate-900 rounded-lg font-medium text-sm transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
                                                >
                                                    {t('viewDetails')}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Wishlist button - simplified */}
                                        <button 
                                            onClick={(e) => e.stopPropagation()}
                                            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 shadow-lg text-lg"
                                        >
                                            ♡
                                        </button>
                                        
                                        {/* Availability badge */}
                                        {available <= 0 && (
                                            <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-red-500 text-white text-xs font-medium">
                                                {t('outOfStock')}
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="p-4">
                                        <h3 className="font-semibold line-clamp-1 mb-1" style={{ fontSize: '0.95rem' }}>{book.title}</h3>
                                        <p className="text-sm line-clamp-1" style={{ color: 'var(--text-muted)' }}>{book.author}</p>
                                        
                                        <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid var(--border-secondary)' }}>
                                            <div className="flex items-center gap-1">
                                                <span className="text-amber-400">★</span>
                                                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>4.5</span>
                                            </div>
                                            <span 
                                                className="text-xs px-2 py-1 rounded-full font-medium"
                                                style={{
                                                    background: available > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                    color: available > 0 ? 'var(--success)' : 'var(--danger)'
                                                }}
                                            >
                                                {available > 0 ? `${available} ${t('left')}` : t('unavailable')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Empty state */}
                        {filteredBooks.length === 0 && !loading && (
                            <div className="col-span-full py-16 text-center">
                                <p style={{ color: 'var(--text-muted)' }}>{t('noBooksInCategory')}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Book Details Modal */}
            <BookDetailsModal 
                book={selectedBook} 
                isOpen={!!selectedBook} 
                onClose={() => setSelectedBook(null)} 
                onBorrow={handleBorrow}
            />
        </div>
    );
};

export default ReaderDashboard;
