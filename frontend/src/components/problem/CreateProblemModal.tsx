import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { problemsApi, incidentsApi } from '../../services/api';
import { IncidentPriority } from '../../types/problem';
import { X, Loader2, AlertTriangle } from 'lucide-react';

interface CreateProblemModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface FormData {
    summary: string;
    description: string;
    priority: IncidentPriority;
    incidentIds: string[];
}

export default function CreateProblemModal({ isOpen, onClose }: CreateProblemModalProps) {
    const { t } = useTranslation();
    const [error, setError] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            priority: IncidentPriority.MEDIUM,
            incidentIds: []
        }
    });

    // Fetch open incidents for linking
    const { data: incidents, isLoading: isLoadingIncidents } = useQuery({
        queryKey: ['incidents', 'open'],
        queryFn: () => incidentsApi.getAll({ status: 'OPEN' }).then(res => res.data.data || []),
        enabled: isOpen,
    });

    const createProblemMutation = useMutation({
        mutationFn: (data: FormData) => problemsApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['problems'] });
            reset();
            onClose();
        },
        onError: (err: any) => {
            setError(err.response?.data?.message || 'Failed to create problem');
        }
    });

    const onSubmit = (data: FormData) => {
        if (!data.incidentIds || data.incidentIds.length === 0) {
            setError(t('problem.atLeastOneIncident'));
            return;
        }
        setError(null);
        createProblemMutation.mutate(data);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('problem.createProblem')}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('problem.summary')}</label>
                        <input
                            {...register('summary', { required: 'Summary is required' })}
                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Brief summary of the problem"
                        />
                        {errors.summary && <p className="text-red-500 text-sm">{errors.summary.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('problem.description')}</label>
                        <textarea
                            {...register('description', { required: 'Description is required' })}
                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white h-32"
                            placeholder="Detailed description..."
                        />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('problem.priority')}</label>
                            <select
                                {...register('priority')}
                                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            >
                                {Object.values(IncidentPriority).map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('problem.linkedIncidents')}</label>
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 max-h-48 overflow-y-auto space-y-2">
                            {isLoadingIncidents ? (
                                <div className="text-center py-2 text-gray-500">{t('problem.loadingIncidents')}</div>
                            ) : incidents?.length === 0 ? (
                                <div className="text-center py-2 text-gray-500">{t('problem.noOpenIncidents')}</div>
                            ) : (
                                incidents?.map((incident: any) => (
                                    <label key={incident.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                                        <input
                                            type="checkbox"
                                            value={incident.id}
                                            {...register('incidentIds')}
                                            className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">{incident.number} - {incident.subject}</div>
                                            <div className="text-xs text-gray-500">{new Date(incident.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    </label>
                                ))
                            )}
                        </div>
                        {errors.incidentIds && <p className="text-red-500 text-sm">{errors.incidentIds.message}</p>}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                            {t('common.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={createProblemMutation.isPending}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {createProblemMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                            {t('problem.createProblem')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
