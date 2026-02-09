import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    LayoutDashboard,
    AlertTriangle,
    FileText,
    Bug,
    GitBranch,
    FolderKanban,
    HardDrive,
    BookOpen,
    BarChart3,
    Settings,
    LogOut,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'nav.dashboard' },
    { path: '/incidents', icon: AlertTriangle, label: 'nav.incidents' },
    { path: '/service-requests', icon: FileText, label: 'nav.serviceRequests' },
    { path: '/problems', icon: Bug, label: 'nav.problems' },
    { path: '/changes', icon: GitBranch, label: 'nav.changes' },
    { path: '/projects', icon: FolderKanban, label: 'nav.projects' },
    { path: '/assets', icon: HardDrive, label: 'nav.assets' },
    { path: '/knowledge-base', icon: BookOpen, label: 'nav.knowledgeBase' },
    { path: '/reports', icon: BarChart3, label: 'nav.reports' },
];

export default function Sidebar() {
    const { t } = useTranslation();
    const { logout } = useAuthStore();

    return (
        <aside className="w-64 bg-white dark:bg-slate-800 shadow-lg flex flex-col">
            {/* Logo */}
            <div className="h-16 flex items-center justify-center border-b border-slate-200 dark:border-slate-700">
                <h1 className="text-xl font-bold gradient-text">{t('common.appName')}</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3">
                <ul className="space-y-1">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{t(item.label)}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                <NavLink
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 transition-all"
                >
                    <Settings className="w-5 h-5" />
                    <span>{t('nav.settings')}</span>
                </NavLink>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-all mt-1"
                >
                    <LogOut className="w-5 h-5" />
                    <span>{t('auth.logout')}</span>
                </button>
            </div>
        </aside>
    );
}
