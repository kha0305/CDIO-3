import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

const LandingPage = () => {
    const { t, language, changeLanguage } = useLanguage();

    const features = [
        {
            title: 'Quản lý Sách',
            desc: 'Quản lý kho sách với hàng nghìn đầu sách đa dạng thể loại',
            titleEn: 'Book Management',
            descEn: 'Manage library with thousands of diverse book titles'
        },
        {
            title: 'Mượn & Trả Sách',
            desc: 'Quy trình mượn trả sách đơn giản, nhanh chóng',
            titleEn: 'Borrow & Return',
            descEn: 'Simple and fast borrowing process'
        },
        {
            title: 'Theo dõi Lịch sử',
            desc: 'Xem lịch sử mượn sách và quản lý phiếu phạt',
            titleEn: 'Track History',
            descEn: 'View borrowing history and manage fines'
        },
        {
            title: 'Đặt Trước Sách',
            desc: 'Đặt trước sách yêu thích khi sách đang được mượn',
            titleEn: 'Reserve Books',
            descEn: 'Reserve your favorite books when unavailable'
        }
    ];

    const stats = [
        { value: '10,000+', label: language === 'vi' ? 'Đầu sách' : 'Books' },
        { value: '5,000+', label: language === 'vi' ? 'Độc giả' : 'Readers' },
        { value: '50,000+', label: language === 'vi' ? 'Lượt mượn' : 'Borrows' },
        { value: '24/7', label: language === 'vi' ? 'Hỗ trợ' : 'Support' }
    ];

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4" style={{ background: 'var(--bg-base)', borderBottom: '1px solid var(--border-secondary)' }}>
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center p-2" style={{ background: 'var(--accent-gradient)' }}>
                            <svg viewBox="0 0 64 64" className="w-full h-full">
                                <rect x="8" y="12" width="48" height="10" rx="2" fill="white" transform="rotate(-8 32 17)"/>
                                <rect x="8" y="26" width="48" height="10" rx="2" fill="white" opacity="0.85" transform="rotate(3 32 31)"/>
                                <rect x="8" y="40" width="48" height="10" rx="2" fill="white" opacity="0.7" transform="rotate(-2 32 45)"/>
                            </svg>
                        </div>
                        <span className="text-xl font-bold">LibManager</span>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Language Toggle */}
                        <div className="flex gap-1 rounded-lg overflow-hidden" style={{ border: '1px solid var(--border-primary)' }}>
                            <button
                                onClick={() => changeLanguage('vi')}
                                className="text-sm py-1.5 px-3 font-medium transition-all"
                                style={{
                                    background: language === 'vi' ? 'var(--accent-primary)' : 'transparent',
                                    color: language === 'vi' ? 'white' : 'var(--text-secondary)'
                                }}
                            >
                                VI
                            </button>
                            <button
                                onClick={() => changeLanguage('en')}
                                className="text-sm py-1.5 px-3 font-medium transition-all"
                                style={{
                                    background: language === 'en' ? 'var(--accent-primary)' : 'transparent',
                                    color: language === 'en' ? 'white' : 'var(--text-secondary)'
                                }}
                            >
                                EN
                            </button>
                        </div>

                        <Link 
                            to="/login" 
                            className="btn-primary px-6 py-2.5"
                        >
                            {t('login')}
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div 
                                className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-6"
                                style={{ background: 'var(--accent-soft)', color: 'var(--accent-primary)' }}
                            >
                                {language === 'vi' ? 'Hệ thống Quản lý Thư viện' : 'Library Management System'}
                            </div>
                            
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                                {language === 'vi' ? (
                                    <>
                                        Khám phá Kho tàng
                                        <span className="block" style={{ color: 'var(--accent-primary)' }}>Tri thức Vô tận</span>
                                    </>
                                ) : (
                                    <>
                                        Discover Endless
                                        <span className="block" style={{ color: 'var(--accent-primary)' }}>Knowledge</span>
                                    </>
                                )}
                            </h1>
                            
                            <p className="text-lg mb-8 max-w-xl" style={{ color: 'var(--text-secondary)' }}>
                                {language === 'vi' 
                                    ? 'LibManager giúp bạn quản lý thư viện một cách hiệu quả. Mượn sách, theo dõi lịch sử, và khám phá hàng nghìn đầu sách đa dạng.'
                                    : 'LibManager helps you manage your library efficiently. Borrow books, track history, and explore thousands of diverse titles.'
                                }
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link to="/login" className="btn-primary px-8 py-4 text-lg">
                                    {language === 'vi' ? 'Bắt đầu ngay' : 'Get Started'}
                                </Link>
                                <button 
                                    className="px-8 py-4 rounded-xl text-lg font-medium transition-all"
                                    style={{ 
                                        background: 'var(--bg-secondary)', 
                                        border: '1px solid var(--border-primary)',
                                        color: 'var(--text-primary)'
                                    }}
                                >
                                    {language === 'vi' ? 'Tìm hiểu thêm' : 'Learn More'}
                                </button>
                            </div>
                        </div>

                        {/* Hero Image/Illustration */}
                        <div className="hidden lg:block">
                            <div 
                                className="aspect-square rounded-3xl p-8 flex items-center justify-center"
                                style={{ background: 'var(--accent-gradient)' }}
                            >
                                <div className="text-center text-white">
                                    <svg viewBox="0 0 64 64" className="w-32 h-32 mx-auto mb-6">
                                        <rect x="8" y="12" width="48" height="10" rx="2" fill="white" transform="rotate(-8 32 17)"/>
                                        <rect x="8" y="26" width="48" height="10" rx="2" fill="white" opacity="0.85" transform="rotate(3 32 31)"/>
                                        <rect x="8" y="40" width="48" height="10" rx="2" fill="white" opacity="0.7" transform="rotate(-2 32 45)"/>
                                    </svg>
                                    <p className="text-2xl font-bold">LibManager</p>
                                    <p className="text-white/70">SE347 - CNPM</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 px-6" style={{ background: 'var(--bg-secondary)' }}>
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center">
                                <p className="text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--accent-primary)' }}>
                                    {stat.value}
                                </p>
                                <p style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            {language === 'vi' ? 'Tính năng nổi bật' : 'Key Features'}
                        </h2>
                        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
                            {language === 'vi' 
                                ? 'LibManager cung cấp đầy đủ công cụ để quản lý thư viện hiệu quả'
                                : 'LibManager provides complete tools for efficient library management'
                            }
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, i) => (
                            <div 
                                key={i} 
                                className="p-6 rounded-2xl transition-all hover:-translate-y-1"
                                style={{ 
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-secondary)'
                                }}
                            >
                                <div 
                                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-2xl"
                                    style={{ background: 'var(--accent-soft)' }}
                                >
                                    {i === 0 && '📚'}
                                    {i === 1 && '🔄'}
                                    {i === 2 && '📊'}
                                    {i === 3 && '📝'}
                                </div>
                                <h3 className="text-lg font-semibold mb-2">
                                    {language === 'vi' ? feature.title : feature.titleEn}
                                </h3>
                                <p style={{ color: 'var(--text-muted)' }}>
                                    {language === 'vi' ? feature.desc : feature.descEn}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div 
                        className="p-12 rounded-3xl"
                        style={{ background: 'var(--accent-gradient)' }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            {language === 'vi' ? 'Sẵn sàng bắt đầu?' : 'Ready to get started?'}
                        </h2>
                        <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                            {language === 'vi' 
                                ? 'Đăng ký ngay để trải nghiệm hệ thống quản lý thư viện hiện đại'
                                : 'Sign up now to experience the modern library management system'
                            }
                        </p>
                        <Link 
                            to="/login" 
                            className="inline-block px-8 py-4 bg-white rounded-xl font-semibold text-lg transition-all hover:bg-white/90"
                            style={{ color: 'var(--accent-primary)' }}
                        >
                            {language === 'vi' ? 'Đăng nhập / Đăng ký' : 'Login / Register'}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-6" style={{ borderTop: '1px solid var(--border-secondary)' }}>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center p-1.5" style={{ background: 'var(--accent-gradient)' }}>
                            <svg viewBox="0 0 64 64" className="w-full h-full">
                                <rect x="8" y="12" width="48" height="10" rx="2" fill="white" transform="rotate(-8 32 17)"/>
                                <rect x="8" y="26" width="48" height="10" rx="2" fill="white" opacity="0.85" transform="rotate(3 32 31)"/>
                                <rect x="8" y="40" width="48" height="10" rx="2" fill="white" opacity="0.7" transform="rotate(-2 32 45)"/>
                            </svg>
                        </div>
                        <span className="font-semibold">LibManager</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)' }}>
                        © 2026 LibManager. SE347 - CNPM
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
