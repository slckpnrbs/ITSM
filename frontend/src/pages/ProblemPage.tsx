import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { problemsApi } from '../services/api';
import { Plus, Filter, Search, AlertOctagon } from 'lucide-react';
import { Problem } from '../types/problem';
import CreateProblemModal from '../components/problem/CreateProblemModal';

export default function ProblemPage() {
    const { t } = useTranslation();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data: problems, isLoading } = useQuery({
        queryKey: ['problems'],
        queryFn: () => problemsApi.getAll().then(res => res.data),
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('problem.title')}</h1>
                    <p className="text-gray-500 dark:text-gray-400">{t('problem.subtitle')}</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>{t('problem.new')}</span>
                </button>
            </div>

            <CreateProblemModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

            {/* Filter Bar */}
            <div className="flex space-x-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder={t('problem.searchProblems')}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                    <Filter className="w-4 h-4" />
                    <span>{t('common.filter')}</span>
                </button>
            </div>

            {/* Content */}
            {isLoading ? (
                <div>{t('common.loading')}</div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-4 font-medium">{t('problem.id')}</th>
                                <th className="px-6 py-4 font-medium">{t('problem.summary')}</th>
                                <th className="px-6 py-4 font-medium">{t('problem.status')}</th>
                                <th className="px-6 py-4 font-medium">{t('problem.priority')}</th>
                                <th className="px-6 py-4 font-medium">{t('problem.assignee')}</th>
                                <th className="px-6 py-4 font-medium">{t('problem.createdAt')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {problems?.map((problem: Problem) => (
                                <tr key={problem.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                        <div className="flex items-center space-x-2">
                                            <AlertOctagon className="w-4 h-4 text-purple-500" />
                                            <span>{problem.number}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-900 dark:text-white">{problem.summary}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800`}>
                                            {problem.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{problem.priority}</td>
                                    <td className="px-6 py-4">{problem.assigneeName || '-'}</td>
                                    <td className="px-6 py-4 text-gray-500">{new Date(problem.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {problems?.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        {t('problem.noProblems')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

