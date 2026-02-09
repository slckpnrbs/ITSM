import { useTranslation } from 'react-i18next';
import { Plus, Filter, Search, AlertTriangle } from 'lucide-react';

export default function IncidentsPage() {
    const { t } = useTranslation();

    const incidents = [
        {
            id: 'INC-001',
            subject: 'Email sunucusu yanıt vermiyor',
            reporter: 'Ahmet Yılmaz',
            assignee: 'Mehmet Demir',
            priority: 'high',
            status: 'open',
            createdAt: '2024-01-15 09:30',
            sla: '2 saat',
        },
        {
            id: 'INC-002',
            subject: 'VPN bağlantı sorunu',
            reporter: 'Ayşe Kaya',
            assignee: 'Ali Veli',
            priority: 'medium',
            status: 'inProgress',
            createdAt: '2024-01-15 10:15',
            sla: '4 saat',
        },
        {
            id: 'INC-003',
            subject: 'Yazıcı çalışmıyor',
            reporter: 'Fatma Şahin',
            assignee: 'Mehmet Demir',
            priority: 'low',
            status: 'resolved',
            createdAt: '2024-01-14 14:00',
            sla: '8 saat',
        },
    ];

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            open: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            inProgress: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
            pending: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
            resolved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            closed: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
        };
        return styles[status] || styles.open;
    };

    const getPriorityBadge = (priority: string) => {
        const styles: Record<string, string> = {
            low: 'border-slate-300 text-slate-600',
            medium: 'border-yellow-400 text-yellow-600',
            high: 'border-orange-400 text-orange-600',
            critical: 'border-red-500 text-red-600 bg-red-50',
        };
        return styles[priority] || styles.low;
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                        <AlertTriangle className="w-7 h-7 text-primary-500" />
                        {t('incident.title')}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Olay kayıtlarını yönetin ve takip edin
                    </p>
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                    <Plus className="w-5 h-5" />
                    {t('incident.new')}
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder={t('common.search') + '...'}
                            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border-none rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <button className="inline-flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg transition-all">
                        <Filter className="w-5 h-5" />
                        {t('common.filter')}
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-700/50">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    {t('incident.id')}
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    {t('incident.subject')}
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    {t('incident.priority')}
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    {t('incident.status')}
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    {t('incident.assignee')}
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    {t('incident.sla')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {incidents.map((incident) => (
                                <tr
                                    key={incident.id}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer"
                                >
                                    <td className="px-6 py-4">
                                        <span className="text-primary-600 dark:text-primary-400 font-medium">
                                            {incident.id}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-slate-800 dark:text-white font-medium">
                                                {incident.subject}
                                            </p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                {incident.reporter} • {incident.createdAt}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-medium border rounded-full ${getPriorityBadge(
                                                incident.priority
                                            )}`}
                                        >
                                            {t(`incident.priorities.${incident.priority}`)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                                                incident.status
                                            )}`}
                                        >
                                            {t(`incident.statuses.${incident.status}`)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                        {incident.assignee}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                        {incident.sla}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
