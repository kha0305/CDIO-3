import { useLanguage } from '../i18n/LanguageContext';

const BookDetailsModal = ({ book, isOpen, onClose, onBorrow }) => {
    const { t } = useLanguage();

    if (!isOpen || !book) return null;

    const total = book.totalQty || book.quantity || 0;
    const borrowed = book.borrowedQty || 0;
    const available = total - borrowed;
    const isAvailable = available > 0;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div 
                className="modal-content max-w-5xl w-[95vw] flex flex-col md:flex-row overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button - More visible */}
                <button 
                    onClick={onClose}
                    className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 text-lg font-bold"
                    style={{ 
                        background: 'var(--bg-base)', 
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-primary)',
                        boxShadow: 'var(--shadow-md)'
                    }}
                >
                    ×
                </button>

                {/* Left Side: Cover Image */}
                <div className="w-full md:w-2/5 relative" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="aspect-[2/3] md:aspect-auto md:h-full w-full flex items-center justify-center p-8">
                        {book.coverUrl ? (
                            <img 
                                src={book.coverUrl} 
                                alt={book.title} 
                                className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
                            />
                        ) : (
                            <div className="w-48 h-72 rounded-lg flex flex-col items-center justify-center" style={{ background: 'var(--bg-tertiary)' }}>
                                <span className="text-6xl font-bold" style={{ color: 'var(--text-light)' }}>{book.title?.charAt(0) || 'B'}</span>
                                <span className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>No Cover</span>
                            </div>
                        )}
                    </div>
                    
                    {/* Availability Badge */}
                    <div className="absolute top-4 left-4">
                        <span 
                            className="px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5"
                            style={{
                                background: isAvailable ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                color: isAvailable ? 'var(--success)' : 'var(--danger)',
                                border: `1px solid ${isAvailable ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                            }}
                        >
                            <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                            {isAvailable ? `${available} ${t('available')}` : t('outOfStock')}
                        </span>
                    </div>
                </div>

                {/* Right Side: Details */}
                <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                    {/* Category */}
                    <div className="mb-4">
                        <span 
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{ background: 'var(--accent-soft)', color: 'var(--accent-primary)' }}
                        >
                            {book.category || 'General'}
                        </span>
                    </div>

                    {/* Title & Author */}
                    <h2 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">{book.title}</h2>
                    <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
                        {t('byAuthor')} <span className="font-medium" style={{ color: 'var(--accent-primary)' }}>{book.author}</span>
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-4 mb-6 pb-6" style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span 
                                    key={star} 
                                    className={star <= 4 ? 'text-amber-400' : 'text-slate-300'}
                                >
                                    {star <= 4 ? '★' : '☆'}
                                </span>
                            ))}
                        </div>
                        <span style={{ color: 'var(--text-muted)' }}>4.0 / 5.0</span>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                            <span className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>{t('publisher')}</span>
                            <p className="font-medium truncate mt-1">{book.publisher || 'Unknown'}</p>
                        </div>
                        <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                            <span className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>{t('year')}</span>
                            <p className="font-medium mt-1">{book.publishYear || 'N/A'}</p>
                        </div>
                        <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                            <span className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>{t('isbn')}</span>
                            <p className="font-mono text-sm truncate mt-1">{book.isbn || 'N/A'}</p>
                        </div>
                        <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                            <span className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>{t('stock')}</span>
                            <p className="font-medium mt-1">{total} {t('copies')}</p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                        <h3 className="font-semibold mb-3">{t('description')}</h3>
                        <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            {book.description || t('noDescription')}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button 
                            disabled={!isAvailable}
                            onClick={() => onBorrow(book)}
                            className="flex-1 btn-primary py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isAvailable ? t('borrowBook') : t('unavailable')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetailsModal;
