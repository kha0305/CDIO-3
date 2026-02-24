import { useState } from 'react';
import { Settings, X, Bell, Shield, Database, Info, Sun, Moon } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import CustomSelect from './CustomSelect';
import { showSuccess } from '../utils/alert';

const SettingsModal = ({ isOpen, onClose }) => {
    const { language, changeLanguage, t } = useLanguage();
    const { isDarkMode, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('general');
    const [settings, setSettings] = useState({
        notifications: true,
        emailAlerts: false,
        autoLogout: '30',
    });

    if (!isOpen) return null;

    const tabs = [
        { id: 'general', label: t('general'), icon: Settings },
        { id: 'notifications', label: t('notifications'), icon: Bell },
        { id: 'security', label: t('security'), icon: Shield },
        { id: 'about', label: t('about'), icon: Info },
    ];

    const languageOptions = [
        { value: 'vi', label: '🇻🇳 Tiếng Việt' },
        { value: 'en', label: '🇺🇸 English' },
    ];

    const autoLogoutOptions = [
        { value: '15', label: `15 ${t('minutes')}` },
        { value: '30', label: `30 ${t('minutes')}` },
        { value: '60', label: `1 ${t('hour')}` },
        { value: '0', label: t('never') },
    ];

    const handleSave = async () => {
        localStorage.setItem('appSettings', JSON.stringify(settings));
        await showSuccess(t('settingsSaved'));
        onClose();
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content max-w-lg">
                <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Settings size={22} className="text-indigo-400" />
                        {t('settings')}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-700/50">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                                activeTab === tab.id 
                                    ? 'text-indigo-400 border-b-2 border-indigo-400 bg-indigo-500/5' 
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <tab.icon size={16} />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="p-6 space-y-6">
                    {activeTab === 'general' && (
                        <>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {isDarkMode ? <Moon size={20} className="text-indigo-400" /> : <Sun size={20} className="text-amber-400" />}
                                    <div>
                                        <p className="font-medium text-white">{t('darkMode')}</p>
                                        <p className="text-sm text-slate-400">{t('useDarkTheme')}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={toggleTheme}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${isDarkMode ? 'bg-indigo-600' : 'bg-slate-300'}`}
                                >
                                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${isDarkMode ? 'left-7' : 'left-1'}`}></span>
                                </button>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="font-medium text-white">{t('language')}</p>
                                    <p className="text-sm text-slate-400">{t('selectLanguage')}</p>
                                </div>
                                <CustomSelect
                                    options={languageOptions}
                                    value={language}
                                    onChange={(e) => changeLanguage(e.target.value)}
                                    className="w-40"
                                />
                            </div>
                        </>
                    )}

                    {activeTab === 'notifications' && (
                        <>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-white">{t('inAppNotifications')}</p>
                                    <p className="text-sm text-slate-400">{t('showPopup')}</p>
                                </div>
                                <button 
                                    onClick={() => setSettings({...settings, notifications: !settings.notifications})}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${settings.notifications ? 'bg-indigo-600' : 'bg-slate-600'}`}
                                >
                                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.notifications ? 'left-7' : 'left-1'}`}></span>
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-white">{t('emailNotifications')}</p>
                                    <p className="text-sm text-slate-400">{t('sendEmail')}</p>
                                </div>
                                <button 
                                    onClick={() => setSettings({...settings, emailAlerts: !settings.emailAlerts})}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${settings.emailAlerts ? 'bg-indigo-600' : 'bg-slate-600'}`}
                                >
                                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.emailAlerts ? 'left-7' : 'left-1'}`}></span>
                                </button>
                            </div>
                        </>
                    )}

                    {activeTab === 'security' && (
                        <>
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="font-medium text-white">{t('autoLogout')}</p>
                                    <p className="text-sm text-slate-400">{t('afterInactivity')}</p>
                                </div>
                                <CustomSelect
                                    options={autoLogoutOptions}
                                    value={settings.autoLogout}
                                    onChange={(e) => setSettings({...settings, autoLogout: e.target.value})}
                                    className="w-40"
                                />
                            </div>
                            <div>
                                <button className="w-full py-3 px-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-left hover:bg-slate-700/50 transition-colors">
                                    <p className="font-medium text-white">{t('changePassword')}</p>
                                    <p className="text-sm text-slate-400">{t('updatePassword')}</p>
                                </button>
                            </div>
                        </>
                    )}

                    {activeTab === 'about' && (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4">
                                <Database size={32} className="text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-white">LibManager</h3>
                            <p className="text-slate-400 text-sm mt-1">{t('libraryManagement')}</p>
                            <p className="text-slate-500 text-xs mt-4">{t('version')} 1.0.0</p>
                            <p className="text-slate-500 text-xs mt-1">© 2026 SE347 - CNPM</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-700/50 flex justify-end gap-3">
                    <button onClick={onClose} className="btn-secondary">
                        {t('cancel')}
                    </button>
                    <button onClick={handleSave} className="btn-primary">
                        {t('saveChanges')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
