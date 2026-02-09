import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    Bell,
} from 'lucide-react';
import { incidentsApi } from '../services/api';
import { useWebSocket } from '../services/websocket';

export default function DashboardPage() {
    const { t } = useTranslation();
    const [notifications, setNotifications] = useState<any[]>([]);

    // Fetch stats from API
    const { data: stats, refetch: refetchStats } = useQuery({
        queryKey: ['incidentStats'],
        queryFn: async () => {
            try {
                const res = await incidentsApi.getStats();
                return res.data;
            } catch {
                // Return default stats if API fails
                return {
                    total: 0,
                    open: 0,
                    inProgress: 0,
                    breached: 0,
                    resolvedToday: 0,
                };
            }
        },
    });

    // Fetch recent incidents
    const { data: recentData } = useQuery({
        queryKey: ['recentIncidents'],
        queryFn: async () => {
            try {
                const res = await incidentsApi.getAll({ limit: 5 });
                return res.data?.data || [];
            } catch {
                return [];
            }
        },
    });

    // Listen for real-time notifications
    useWebSocket('incident:created', (data) => {
        setNotifications((prev) => [
            { type: 'created', ...data, time: new Date() },
            ...prev.slice(0, 4),
        ]);
        refetchStats();
    });

    useWebSocket('incident:assigned', (data) => {
        setNotifications((prev) => [
            { type: 'assigned', ...data, time: new Date() },
            ...prev.slice(0, 4),
        ]);
    });

    useWebSocket('sla:warning', (data) => {
        setNotifications((prev) => [
            { type: 'sla', ...data, time: new Date() },
            ...prev.slice(0, 4),
        ]);
    });

    const statCards = [
        {
            title: t('dashboard.totalIncidents'),
            value: stats?.total || 0,
            change: '+12%',
            trend: 'up' as const,
            icon: AlertTriangle,
            color: 'blue',
        },
        {
            title: t('dashboard.openIncidents'),
            value: stats?.open || 0,
            change: '-5%',
            trend: 'down' as const,
            icon: Clock,
            color: 'yellow',
        },
        {
            title: t('dashboard.slaBreached'),
            value: stats?.breached || 0,
            change: stats?.breached > 0 ? `+${stats?.breached}` : '0',
            trend: stats?.breached > 0 ? 'up' as const : 'down' as const,
            icon: AlertTriangle,
            color: 'red',
        },
        {
            title: t('dashboard.resolvedToday'),
            value: stats?.resolvedToday || 0,
            change: `+${stats?.resolvedToday || 0}`,
            trend: 'up' as const,
            icon: CheckCircle,
            color: 'green',
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN': return 'bg-blue-100 text-blue-700';
            case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-700';
            case 'RESOLVED': return 'bg-green-100 text-green-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'LOW': return 'text-slate-500';
            case 'MEDIUM': return 'text-yellow-500';
            case 'HIGH': return 'text-orange-500';
            case 'CRITICAL': return 'text-red-500';
            default: return 'text-slate-500';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                        {t('dashboard.title')} 👋
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        İşte bugünkü ITSM özeti
                    </p>
                </div>

                {/* Real-time notification indicator */}
                {notifications.length > 0 && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                        <Bell className="w-4 h-4 text-primary-500" />
                        <span className="text-sm text-primary-600 dark:text-primary-400">
                            {notifications.length} yeni bildirim
                        </span>
                    </div>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div
                                className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                                    stat.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                                        stat.color === 'red' ? 'bg-red-100 text-red-600' :
                                            'bg-green-100 text-green-600'
                                    }`}
                            >
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span
                                className={`flex items-center text-sm font-medium ${stat.trend === 'up' && stat.color !== 'red' ? 'text-green-500' :
                                    stat.trend === 'up' && stat.color === 'red' ? 'text-red-500' :
                                        'text-green-500'
                                    }`}
                            >
                                {stat.change}
                                {stat.trend === 'up' ? (
                                    <ArrowUpRight className="w-4 h-4 ml-1" />
                                ) : (
                                    <ArrowDownRight className="w-4 h-4 ml-1" />
                                )}
                            </span>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-3xl font-bold text-slate-800 dark:text-white">
                                {stat.value}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                {stat.title}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity & Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Incidents */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                            {t('dashboard.recentActivity')}
                        </h2>
                    </div>
                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                        {recentData && recentData.length > 0 ? (
                            recentData.map((item: any) => (
                                <div
                                    key={item.id}
                                    className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-sm font-medium text-primary-500">
                                                {item.number}
                                            </span>
                                            <h3 className="text-slate-800 dark:text-white font-medium mt-1">
                                                {item.subject}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-sm font-medium ${getPriorityColor(item.priority)}`}>
                                                {item.priority}
                                            </span>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-slate-400">
                                Henüz olay kaydı yok
                            </div>
                        )}
                    </div>
                </div>

                {/* Live Notifications */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                            <Bell className="w-5 h-5 text-primary-500" />
                            Canlı Bildirimler
                        </h2>
                    </div>
                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                        {notifications.length > 0 ? (
                            notifications.map((notif, index) => (
                                <div key={index} className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className={`w-2 h-2 rounded-full mt-2 ${notif.type === 'sla' ? 'bg-red-500' :
                                            notif.type === 'assigned' ? 'bg-yellow-500' :
                                                'bg-green-500'
                                            }`} />
                                        <div>
                                            <p className="text-sm text-slate-800 dark:text-white">
                                                {notif.type === 'created' && `Yeni olay: ${notif.incidentNumber}`}
                                                {notif.type === 'assigned' && `Olay atandı: ${notif.incidentId}`}
                                                {notif.type === 'sla' && `SLA uyarısı: ${notif.incidentNumber}`}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {notif.time.toLocaleTimeString('tr-TR')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-slate-400">
                                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>Gerçek zamanlı bildirimler burada görünecek</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
