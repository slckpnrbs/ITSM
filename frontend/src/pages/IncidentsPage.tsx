import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, AlertTriangle, RefreshCw } from 'lucide-react';
import { incidentsApi } from '../services/api';
import CreateIncidentModal from '../components/CreateIncidentModal';

export default function IncidentsPage() {
    const { t } = useTranslation();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        status: '',
        priority: '',
        search: '',
    });

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['incidents', filters],
        queryFn: () => incidentsApi.getAll(filters).then((res) => res.data),
    });

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            OPEN: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            IN_PROGRESS: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
            PENDING: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
            RESOLVED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            CLOSED: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
        };
        return styles[status] || styles.OPEN;
    };

    const getPriorityBadge = (priority: string) => {
        const styles: Record<string, string> = {
            LOW: 'border-slate-300 text-slate-600',
            MEDIUM: 'border-yellow-400 text-yellow-600',
            HIGH: 'border-orange-400 text-orange-600',
            CRITICAL: 'border-red-500 text-red-600 bg-red-50',
        };
        return styles[priority] || styles.LOW;
    };

    const getStatusText = (status: string) => {
        const map: Record<string, string> = {
            OPEN: t('incident.statuses.open'),
            IN_PROGRESS: t('incident.statuses.inProgress'),
            PENDING: t('incident.statuses.pending'),
            RESOLVED: t('incident.statuses.resolved'),
            CLOSED: t('incident.statuses.closed'),
        };
        return map[status] || status;
    };

    const getPriorityText = (priority: string) => {
        const map: Record<string, string> = {
            LOW: t('incident.priorities.low'),
            MEDIUM: t('incident.priorities.medium'),
            HIGH: t('incident.priorities.high'),
            CRITICAL: t('incident.priorities.critical'),
        };
        return map[priority] || priority;
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
                <div className="flex gap-2">
                    <button
                        onClick={() => refetch()}
                        className="inline-flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg transition-all"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Plus className="w-5 h-5" />
                        {t('incident.new')}
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                            placeholder={t('common.search') + '...'}
                            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border-none rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                        className="px-3 py-2 bg-slate-100 dark:bg-slate-700 border-none rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="">Tüm Durumlar</option>
                        <option value="OPEN">{t('incident.statuses.open')}</option>
                        <option value="IN_PROGRESS">{t('incident.statuses.inProgress')}</option>
                        <option value="PENDING">{t('incident.statuses.pending')}</option>
                        <option value="RESOLVED">{t('incident.statuses.resolved')}</option>
                        <option value="CLOSED">{t('incident.statuses.closed')}</option>
                    </select>
                    <select
                        value={filters.priority}
                        onChange={(e) => setFilters({ ...filters, priority: e.target.value, page: 1 })}
                        className="px-3 py-2 bg-slate-100 dark:bg-slate-700 border-none rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="">Tüm Öncelikler</option>
                        <option value="LOW">{t('incident.priorities.low')}</option>
                        <option value="MEDIUM">{t('incident.priorities.medium')}</option>
                        <option value="HIGH">{t('incident.priorities.high')}</option>
                        <option value="CRITICAL">{t('incident.priorities.critical')}</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-red-500">
                        Veriler yüklenirken bir hata oluştu
                    </div>
                ) : data?.data?.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        Henüz olay kaydı bulunmuyor
                    </div>
                ) : (
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
                                {data?.data?.map((incident: any) => (
                                    <tr
                                        key={incident.id}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="text-primary-600 dark:text-primary-400 font-medium">
                                                {incident.number}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-slate-800 dark:text-white font-medium">
                                                    {incident.subject}
                                                </p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                                    {incident.reporterName} • {new Date(incident.createdAt).toLocaleString('tr-TR')}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-medium border rounded-full ${getPriorityBadge(incident.priority)}`}
                                            >
                                                {getPriorityText(incident.priority)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(incident.status)}`}
                                            >
                                                {getStatusText(incident.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                            {incident.assigneeName || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {incident.slaBreached ? (
                                                <span className="text-red-500 font-medium">⚠️ İhlal</span>
                                            ) : incident.resolutionDeadline ? (
                                                <span className="text-slate-600 dark:text-slate-300">
                                                    {new Date(incident.resolutionDeadline).toLocaleString('tr-TR')}
                                                </span>
                                            ) : (
                                                '-'
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {data?.meta && data.meta.totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700">
                        <p className="text-sm text-slate-500">
                            Toplam {data.meta.total} kayıt
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                                disabled={filters.page === 1}
                                className="px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 rounded disabled:opacity-50"
                            >
                                Önceki
                            </button>
                            <span className="px-3 py-1 text-sm">
                                {filters.page} / {data.meta.totalPages}
                            </span>
                            <button
                                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                                disabled={filters.page >= data.meta.totalPages}
                                className="px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 rounded disabled:opacity-50"
                            >
                                Sonraki
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            <CreateIncidentModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
}
