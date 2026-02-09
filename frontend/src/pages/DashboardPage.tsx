import { useTranslation } from 'react-i18next';
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    TrendingUp,
    Users,
    ArrowUpRight,
    ArrowDownRight,
} from 'lucide-react';

export default function DashboardPage() {
    const { t } = useTranslation();

    const stats = [
        {
            title: t('dashboard.totalIncidents'),
            value: '156',
            change: '+12%',
            trend: 'up',
            icon: AlertTriangle,
            color: 'blue',
        },
        {
            title: t('dashboard.openIncidents'),
            value: '23',
            change: '-5%',
            trend: 'down',
            icon: Clock,
            color: 'yellow',
        },
        {
            title: t('dashboard.slaBreached'),
            value: '4',
            change: '+2',
            trend: 'up',
            icon: AlertTriangle,
            color: 'red',
        },
        {
            title: t('dashboard.resolvedToday'),
            value: '18',
            change: '+8',
            trend: 'up',
            icon: CheckCircle,
            color: 'green',
        },
    ];

    const recentActivity = [
        { id: 'INC-001', title: 'Email sunucusu yanıt vermiyor', status: 'open', priority: 'high' },
        { id: 'INC-002', title: 'VPN bağlantı sorunu', status: 'inProgress', priority: 'medium' },
        { id: 'INC-003', title: 'Yazıcı çalışmıyor', status: 'resolved', priority: 'low' },
        { id: 'INC-004', title: 'Active Directory senkronizasyon hatası', status: 'open', priority: 'critical' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return 'bg-blue-100 text-blue-700';
            case 'inProgress': return 'bg-yellow-100 text-yellow-700';
            case 'resolved': return 'bg-green-100 text-green-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'low': return 'text-slate-500';
            case 'medium': return 'text-yellow-500';
            case 'high': return 'text-orange-500';
            case 'critical': return 'text-red-500';
            default: return 'text-slate-500';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                    {t('dashboard.title')} 👋
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                    İşte bugünkü ITSM özeti
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
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
                                className={`flex items-center text-sm font-medium ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
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

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                            {t('dashboard.recentActivity')}
                        </h2>
                    </div>
                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                        {recentActivity.map((item) => (
                            <div
                                key={item.id}
                                className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                            {item.id}
                                        </span>
                                        <h3 className="text-slate-800 dark:text-white font-medium mt-1">
                                            {item.title}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-sm font-medium ${getPriorityColor(item.priority)}`}>
                                            {t(`incident.priorities.${item.priority}`)}
                                        </span>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                                            {t(`incident.statuses.${item.status}`)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* My Tasks */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                            {t('dashboard.myTasks')}
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                            <Users className="w-12 h-12 mb-4" />
                            <p>Henüz atanmış görev yok</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
