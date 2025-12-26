// src/components/GanttChart/FundingModal.jsx
import React, { useState } from 'react';
import { X, DollarSign, AlertCircle } from 'lucide-react';

const FundingModal = ({ 
    item, 
    itemType, // 'phase' أو 'task'
    onClose, 
    onSubmit,
    existingFunding,
    loading = false 
}) => {
    const [formData, setFormData] = useState({
        requested_amount: existingFunding?.requested_amount || '',
        justification: existingFunding?.justification || '',
        funding_plan: existingFunding?.funding_plan || ''
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.requested_amount || formData.requested_amount <= 0) {
            newErrors.requested_amount = 'يرجى إدخال مبلغ صحيح';
        }
        
        if (!formData.justification.trim()) {
            newErrors.justification = 'يرجى كتابة مبررات الطلب';
        }
        
        if (!formData.funding_plan.trim()) {
            newErrors.funding_plan = 'يرجى كتابة خطة استخدام التمويل';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit({
                ...formData,
                requested_amount: parseFloat(formData.requested_amount)
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const itemName = itemType === 'phase' ? item.phase_name : item.task_name;
    const title = existingFunding ? 'تعديل طلب التمويل' : 'طلب تمويل جديد';

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                {/* الهيدر */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-50 rounded-xl">
                                <DollarSign className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">
                                    {title}
                                </h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    {itemType === 'phase' ? 'المرحلة' : 'المهمة'}: {itemName}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                    
                    {existingFunding?.status && (
                        <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            existingFunding.status === 'pending' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : existingFunding.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                        }`}>
                            حالة الطلب: {getStatusText(existingFunding.status)}
                        </div>
                    )}
                </div>

                {/* النموذج */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-5">
                        {/* المبلغ المطلوب */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                المبلغ المطلوب (SYP)
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="requested_amount"
                                    value={formData.requested_amount}
                                    onChange={handleChange}
                                    placeholder="أدخل المبلغ بالليرة السورية"
                                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${
                                        errors.requested_amount 
                                            ? 'border-red-300 bg-red-50' 
                                            : 'border-gray-300'
                                    }`}
                                    dir="ltr"
                                    disabled={existingFunding && existingFunding.status !== 'draft'}
                                />
                                <span className="absolute left-4 top-3 text-gray-500">SYP</span>
                            </div>
                            {errors.requested_amount && (
                                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.requested_amount}
                                </p>
                            )}
                        </div>

                        {/* المبررات */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                مبررات طلب التمويل
                            </label>
                            <textarea
                                name="justification"
                                value={formData.justification}
                                onChange={handleChange}
                                placeholder="اشرح لماذا تحتاج لهذا التمويل..."
                                rows="3"
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${
                                    errors.justification 
                                        ? 'border-red-300 bg-red-50' 
                                        : 'border-gray-300'
                                }`}
                                dir="rtl"
                                disabled={existingFunding && existingFunding.status !== 'draft'}
                            />
                            {errors.justification && (
                                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.justification}
                                </p>
                            )}
                        </div>

                        {/* خطة استخدام التمويل */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                خطة استخدام التمويل
                            </label>
                            <textarea
                                name="funding_plan"
                                value={formData.funding_plan}
                                onChange={handleChange}
                                placeholder="كيف ستستخدم هذا التمويل؟..."
                                rows="3"
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${
                                    errors.funding_plan 
                                        ? 'border-red-300 bg-red-50' 
                                        : 'border-gray-300'
                                }`}
                                dir="rtl"
                                disabled={existingFunding && existingFunding.status !== 'draft'}
                            />
                            {errors.funding_plan && (
                                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.funding_plan}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* الأزرار */}
                    <div className="flex items-center justify-between gap-3 mt-8 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors font-medium"
                            disabled={loading}
                        >
                            إلغاء
                        </button>
                        
                        {(!existingFunding || existingFunding.status === 'draft') && (
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>جاري الإرسال...</span>
                                    </div>
                                ) : existingFunding ? 'تحديث الطلب' : 'تقديم الطلب'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

const getStatusText = (status) => {
    const statusMap = {
        'draft': 'مسودة',
        'pending': 'قيد المراجعة',
        'approved': 'تم الموافقة',
        'rejected': 'مرفوض',
        'funded': 'تم التمويل'
    };
    return statusMap[status] || status;
};

export default FundingModal;