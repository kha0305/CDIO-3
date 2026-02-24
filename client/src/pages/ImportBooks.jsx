import { useState, useEffect, useCallback } from 'react';
import { Download, CheckCircle, AlertCircle, BookOpen, Loader2, Search, Star } from 'lucide-react';
import { booksApi } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';

const ImportBooks = () => {
    const { t } = useLanguage();
    const [externalBooks, setExternalBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('harry potter');
    const [importingInfo, setImportingInfo] = useState({});
    const [error, setError] = useState(null);

    const API_KEY = '5b8032cc6d8b4007b27768a25a0d4ec9';
    const BASE_URL = 'https://api.bigbookapi.com';

    const fetchExternalBooks = useCallback(async (query) => {
        if (!query.trim()) return;
        
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${BASE_URL}/search-books?api-key=${API_KEY}&query=${encodeURIComponent(query)}&number=20`);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            const data = await response.json();
            if (data && data.books) {
                // Flatten nested arrays if present
                const flatBooks = data.books.flat();
                setExternalBooks(flatBooks);
            } else {
                setExternalBooks([]);
            }
        } catch (err) {
            console.error("Failed to fetch external books:", err);
            setError(err.message);
            setExternalBooks([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchExternalBooks(searchQuery);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchExternalBooks(searchQuery);
    };

    const fetchBookDetails = async (bookId) => {
        try {
            const response = await fetch(`${BASE_URL}/${bookId}?api-key=${API_KEY}`);
            if (!response.ok) return null;
            return await response.json();
        } catch (err) {
            console.error("Failed to fetch book details:", err);
            return null;
        }
    };

    const handleImport = async (book) => {
        setImportingInfo(prev => ({ ...prev, [book.id]: { status: 'loading' } }));
        
        try {
            // Optionally fetch more details
            const details = await fetchBookDetails(book.id);
            
            const authorName = book.authors && book.authors.length > 0 
                ? book.authors.map(a => a.name).join(', ') 
                : 'Unknown Author';

            // Map external book data to our schema
            const newBook = {
                title: book.title,
                author: authorName,
                category: details?.genres?.[0] || 'General',
                publishYear: details?.publish_date ? Math.floor(details.publish_date) : null,
                publisher: details?.publisher || 'Unknown',
                description: details?.description || `${book.subtitle || ''} By ${authorName}.`,
                totalQty: 5,
                isbn: details?.identifiers?.isbn_13 || details?.identifiers?.isbn_10 || `BB-${book.id}`,
                coverUrl: book.image || ''
            };

            await booksApi.create(newBook);
            setImportingInfo(prev => ({ ...prev, [book.id]: { status: 'success' } }));
        } catch (err) {
            console.error("Import failed:", err);
            setImportingInfo(prev => ({ ...prev, [book.id]: { status: 'error' } }));
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">{t('importBooks')}</h1>
                <p className="text-slate-400">Search and import books from BigBookAPI</p>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-8">
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search books (e.g., 'harry potter', 'science fiction', 'cooking')..."
                            className="input-field w-full"
                            style={{ paddingLeft: '3rem' }}
                        />
                    </div>
                    <button type="submit" className="btn-primary px-8" disabled={loading}>
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                        Search
                    </button>
                </div>
            </form>

            {error && (
                <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
                    <AlertCircle className="inline w-5 h-5 mr-2" />
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                </div>
            ) : externalBooks.length === 0 ? (
                <div className="text-center py-16">
                    <BookOpen className="w-16 h-16 mx-auto text-slate-600 mb-4" />
                    <p className="text-slate-400">No books found. Try a different search query.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {externalBooks.map(book => {
                        const status = importingInfo[book.id]?.status;
                        const rating = book.rating?.average ? (book.rating.average * 5).toFixed(1) : null;

                        return (
                            <div key={book.id} className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden flex flex-col hover:border-indigo-500/30 transition-colors">
                                <div className="h-56 bg-slate-900 relative overflow-hidden">
                                    {book.image ? (
                                        <img 
                                            src={book.image} 
                                            alt={book.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null; 
                                                e.target.src = '';
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-600">
                                            <BookOpen size={48} />
                                        </div>
                                    )}
                                    
                                    {rating && (
                                        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-amber-400 text-sm">
                                            <Star size={14} fill="currentColor" />
                                            <span className="font-medium">{rating}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 flex-1 flex flex-col">
                                    <h3 className="font-bold text-white text-lg mb-1 line-clamp-2">{book.title}</h3>
                                    {book.subtitle && (
                                        <p className="text-slate-500 text-xs mb-2 line-clamp-1">{book.subtitle}</p>
                                    )}
                                    <p className="text-slate-400 text-sm mb-3">
                                        {book.authors?.map(a => a.name).join(', ') || 'Unknown Author'}
                                    </p>
                                    
                                    <div className="mt-auto pt-3 border-t border-slate-700/50">
                                        {status === 'success' ? (
                                            <button disabled className="w-full py-2.5 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center gap-2 cursor-default font-medium">
                                                <CheckCircle size={18} /> Imported
                                            </button>
                                        ) : status === 'error' ? (
                                            <button 
                                                onClick={() => handleImport(book)}
                                                className="w-full py-2.5 bg-rose-500/20 text-rose-400 rounded-lg flex items-center justify-center gap-2 hover:bg-rose-500/30 font-medium"
                                            >
                                                <AlertCircle size={18} /> Retry
                                            </button>
                                        ) : status === 'loading' ? (
                                            <button disabled className="w-full py-2.5 bg-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center gap-2 cursor-wait font-medium">
                                                <Loader2 size={18} className="animate-spin" /> Importing...
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => handleImport(book)}
                                                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center justify-center gap-2 transition-colors font-medium"
                                            >
                                                <Download size={18} /> Import Book
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ImportBooks;
