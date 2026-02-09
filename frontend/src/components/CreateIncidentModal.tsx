import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import { incidentsApi } from '../services/api';
import { useAuthStore } from '../store/authStore';

interface CreateIncidentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const categories = ['HARDWARE', 'SOFTWARE', 'NETWORK', 'SECURITY', 'ACCESS', 'OTHER'];

export default function CreateIncidentModal({ isOpen, onClose }: CreateIncidentModalProps) {
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        priority: 'MEDIUM',
        category: 'OTHER',
    });
    const [error, setError] = useState('');

    const createMutation = useMutation({
        mutationFn: (data: any) => incidentsApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['incidents'] });
            onClose();
            resetForm();
        },
        onError: (err: any) => {
            setError(err.response?.data?.message || 'Olay oluşturulurken bir hata oluştu');
        },
    });

    const resetForm = () => {
        setFormData({
            subject: '',
            description: '',
            priority: 'MEDIUM',
            category: 'OTHER',
        });
        setError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.subject.trim()) {
            setError('Konu alanı zorunludur');
            return;
        }
        if (!formData.description.trim()) {
            setError('Açıklama alanı zorunludur');
            return;
        }

        createMutation.mutate({
            ...formData,
            reporterId: user?.id || 'anonymous',
            reporterEmail: user?.email || 'anonymous@itsm.local',
            reporterName: user ? `${user.firstName} ${user.lastName}` : 'Anonymous',
        });
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={t('incident.new')} size="lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Error */}
                {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* Subject */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        {t('incident.subject')} *
                    </label>
                    <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Kısa bir başlık yazın..."
                        maxLength={200}
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        {t('incident.description')} *
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        rows={4}
                        placeholder="Sorunu detaylı olarak açıklayın..."
                    />
                </div>

                {/* Priority & Category Row */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Priority */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            {t('incident.priority')}
                        </label>
                        <select
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            {priorities.map((p) => (
                                <option key={p} value={p}>
                                    {t(`incident.priorities.${p.toLowerCase()}`)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Kategori
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            {categories.map((c) => (
                                <option key={c} value={c}>
                                    {c === 'HARDWARE' && 'Donanım'}
                                    {c === 'SOFTWARE' && 'Yazılım'}
                                    {c === 'NETWORK' && 'Ağ'}
                                    {c === 'SECURITY' && 'Güvenlik'}
                                    {c === 'ACCESS' && 'Erişim'}
                                    {c === 'OTHER' && 'Diğer'}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all"
                    >
                        {t('common.cancel')}
                    </button>
                    <button
                        type="submit"
                        disabled={createMutation.isPending}
                        className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {createMutation.isPending ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <AlertTriangle className="w-4 h-4" />
                        )}
                        {t('common.create')}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
