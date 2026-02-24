import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { authApi } from '../services/api';
import { showAlert } from '../utils/alert';

const Login = ({ onLogin }) => {
    const { t, language, changeLanguage } = useLanguage();
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '', fullName: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const body = isRegister 
                ? { username: formData.username, password: formData.password, fullName: formData.fullName }
                : { username: formData.username, password: formData.password };

            let data;
            if (isRegister) {
                data = await authApi.register(body);
            } else {
                data = await authApi.login(body);
            }

            if (data.error) {
                await showAlert(data.error || t('error'));
                setLoading(false);
                return;
            }

            localStorage.setItem('user', JSON.stringify(data.user || data));
            onLogin(data.user || data);
        } catch (error) {
            console.error(error);
            await showAlert(t('error'));
        } finally {
            setLoading(false);
        }
    };

    const handleDemo = (role) => {
        const credentials = {
            admin: { username: 'admin', password: 'admin123' },
            librarian: { username: 'lib', password: '123456' },
            reader: { username: 'baokha', password: '123456' }
        };
        setFormData({ ...credentials[role], fullName: '' });
    };

    const features = [
        { title: 'Digital Library', desc: 'Access thousands of books' },
        { title: 'Community', desc: 'Join book discussions' },
        { title: 'Secure', desc: 'Your data is protected' },
    ];

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
                
                {/* Decorative elements */}
                <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white/90 flex items-center justify-center p-2">
                            <svg viewBox="0 0 64 64" className="w-full h-full">
                                <rect x="8" y="8" width="48" height="12" rx="2" fill="#3B82F6" transform="rotate(-8 32 14)"/>
                                <rect x="8" y="22" width="48" height="12" rx="2" fill="#EC4899" transform="rotate(3 32 28)"/>
                                <rect x="8" y="36" width="48" height="12" rx="2" fill="#FBBF24" transform="rotate(-2 32 42)"/>
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-white">LibManager</span>
                    </div>
                    
                    {/* Main Text */}
                    <div className="max-w-lg">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur text-white/90 text-sm font-medium mb-8 border border-white/20">
                            <span>Modern Library System</span>
                        </div>
                        
                        <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
                            Your Gateway to 
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200">
                                Endless Knowledge
                            </span>
                        </h1>
                        
                        <p className="text-lg text-white/70 leading-relaxed mb-10">
                            Discover, borrow, and manage your reading journey with our comprehensive library management platform.
                        </p>
                        
                        {/* Features - Simplified */}
                        <div className="flex gap-8">
                            {features.map((feature, i) => (
                                <div key={i}>
                                    <p className="font-medium text-white text-sm">{feature.title}</p>
                                    <p className="text-white/50 text-xs">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Footer */}
                    <p className="text-white/40 text-sm">© 2026 LibManager. SE347 - CNPM</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 xl:w-2/5 flex flex-col relative" style={{ background: 'var(--bg-base)' }}>
                {/* Language Selector - Top Right */}
                <div className="absolute top-4 right-4 z-10 flex gap-1 rounded-lg overflow-hidden" style={{ border: '1px solid var(--border-primary)' }}>
                    <button
                        type="button"
                        onClick={() => changeLanguage('vi')}
                        className="text-sm py-1.5 px-3 font-medium transition-all"
                        style={{
                            background: language === 'vi' ? 'var(--accent-primary)' : 'var(--bg-base)',
                            color: language === 'vi' ? 'white' : 'var(--text-secondary)'
                        }}
                    >
                        VI
                    </button>
                    <button
                        type="button"
                        onClick={() => changeLanguage('en')}
                        className="text-sm py-1.5 px-3 font-medium transition-all"
                        style={{
                            background: language === 'en' ? 'var(--accent-primary)' : 'var(--bg-base)',
                            color: language === 'en' ? 'white' : 'var(--text-secondary)'
                        }}
                    >
                        EN
                    </button>
                </div>

                {/* Mobile Header */}
                <div className="lg:hidden p-6 pt-14 flex items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-1.5">
                            <svg viewBox="0 0 64 64" className="w-full h-full">
                                <rect x="8" y="12" width="48" height="10" rx="2" fill="white" transform="rotate(-8 32 17)"/>
                                <rect x="8" y="26" width="48" height="10" rx="2" fill="white" opacity="0.8" transform="rotate(3 32 31)"/>
                                <rect x="8" y="40" width="48" height="10" rx="2" fill="white" opacity="0.6" transform="rotate(-2 32 45)"/>
                            </svg>
                        </div>
                        <span className="font-bold">LibManager</span>
                    </div>
                </div>

                {/* Form Container */}
                <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
                    <div className="w-full max-w-md">
                        {/* Header */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-2">
                                {isRegister ? t('registerAccount') : `${t('login')} to LibManager`}
                            </h2>
                            <p style={{ color: 'var(--text-muted)' }}>
                                {isRegister ? 'Create your account to get started' : 'Welcome back! Please enter your details.'}
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {isRegister && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('fullName')}</label>
                                    <input 
                                        type="text"
                                        required
                                        className="input-field"
                                        placeholder={t('fullName')}
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-2">{t('username')}</label>
                                <input 
                                    type="text"
                                    required
                                    className="input-field"
                                    placeholder={t('username')}
                                    value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">{t('password')}</label>
                                <div className="relative">
                                    <input 
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        className="input-field"
                                        style={{ paddingRight: '4rem' }}
                                        placeholder={t('password')}
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium px-2 py-1 rounded transition-colors"
                                        style={{ color: 'var(--accent-primary)' }}
                                    >
                                        {showPassword ? 'Ẩn' : 'Hiện'}
                                    </button>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="btn-primary w-full py-3.5 text-base disabled:opacity-50"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        {t('loading')}
                                    </span>
                                ) : (
                                    <span>{isRegister ? t('register') : t('login')}</span>
                                )}
                            </button>
                        </form>

                        {/* Demo Buttons */}
                        {!isRegister && (
                            <div className="mt-6">
                                <p className="text-xs text-center mb-3" style={{ color: 'var(--text-muted)' }}>Quick demo login:</p>
                                <div className="flex gap-2">
                                    <button 
                                        type="button"
                                        onClick={() => handleDemo('admin')}
                                        className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
                                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}
                                    >
                                        Admin
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => handleDemo('librarian')}
                                        className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
                                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}
                                    >
                                        Librarian
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => handleDemo('reader')}
                                        className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
                                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}
                                    >
                                        Reader
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Toggle */}
                        <div className="text-center mt-8 pt-6" style={{ borderTop: '1px solid var(--border-secondary)' }}>
                            <span style={{ color: 'var(--text-muted)' }}>
                                {isRegister ? 'Already have an account?' : "Don't have an account?"}
                            </span>
                            <button 
                                type="button"
                                onClick={() => setIsRegister(!isRegister)}
                                className="ml-2 font-semibold transition-colors"
                                style={{ color: 'var(--accent-primary)' }}
                            >
                                {isRegister ? t('login') : t('register')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
