import { LayoutDashboard, BookOpen, Users2, Repeat, Calendar, DollarSign, BarChart3, Shield, Settings, Import } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useLanguage } from '../i18n/LanguageContext';

const AdminLayout = ({ user, onLogout, children }) => {
    const { t } = useLanguage();

    const menuItems = [
        { name: t('dashboard'), icon: LayoutDashboard, path: '/' },
        { name: t('userManagement'), icon: Shield, path: '/users' }, // Admin specific
        { name: t('bookManagement'), icon: BookOpen, path: '/books' },
        { name: t('readers'), icon: Users2, path: '/readers' },
        { name: t('borrowReturn'), icon: Repeat, path: '/borrow' },
        { name: t('importBooks'), icon: Import, path: '/import-books' },
    ];

    const extraMenuItems = [
        { name: t('reservations'), icon: Calendar, path: '/reservations' },
        { name: t('fines'), icon: DollarSign, path: '/fines' },
        { name: t('reports'), icon: BarChart3, path: '/reports' },
        { name: t('configuration'), icon: Settings, path: '/config' }, // Admin specific
    ];

    return (
        <div className="flex min-h-screen bg-slate-900">
            <Sidebar 
                user={user} 
                onLogout={onLogout} 
                menuItems={menuItems} 
                extraMenuItems={extraMenuItems} 
            />
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
