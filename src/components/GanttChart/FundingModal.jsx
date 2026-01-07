// src/components/GanttChart/FundingModal.jsx
import React, { useState } from 'react';
import { X, DollarSign, AlertCircle } from 'lucide-react';

const FundingModal = ({ 
    item, 
    itemType, // 'phase' or 'task'
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
            newErrors.requested_amount = 'Please enter a valid amount';
        }
        
        if (!formData.justification.trim()) {
            newErrors.justification = 'Please provide justification';
        }
        
        if (!formData.funding_plan.trim()) {
            newErrors.funding_plan = 'Please provide a funding plan';
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
    const title = existingFunding ? 'Edit Funding Request' : 'New Funding Request';

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-gradient-to-r from-[#FF7F50] to-[#FF9933] text-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-xl">
                            <DollarSign className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{title}</h2>
                            <p className="text-sm mt-1">
                                {itemType === 'phase' ? 'Phase' : 'Task'}: {itemName}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Requested Amount */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Requested Amount (SYP)</label>
                        <div className="relative">
                            <input
                                type="number"
                                name="requested_amount"
                                value={formData.requested_amount}
                                onChange={handleChange}
                                placeholder="Enter amount in SYP"
                                className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-[#FF9E55] focus:border-[#FF9E55] transition-all ${
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

                    {/* Justification */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Justification</label>
                        <textarea
                            name="justification"
                            value={formData.justification}
                            onChange={handleChange}
                            placeholder="Explain why this funding is needed..."
                            rows="3"
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF9E55] focus:border-[#FF9E55] transition-all ${
                                errors.justification 
                                    ? 'border-red-300 bg-red-50' 
                                    : 'border-gray-300'
                            }`}
                            disabled={existingFunding && existingFunding.status !== 'draft'}
                        />
                        {errors.justification && (
                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.justification}
                            </p>
                        )}
                    </div>

                    {/* Funding Plan */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Funding Plan</label>
                        <textarea
                            name="funding_plan"
                            value={formData.funding_plan}
                            onChange={handleChange}
                            placeholder="How will you use this funding?"
                            rows="3"
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#FF9E55] focus:border-[#FF9E55] transition-all ${
                                errors.funding_plan 
                                    ? 'border-red-300 bg-red-50' 
                                    : 'border-gray-300'
                            }`}
                            disabled={existingFunding && existingFunding.status !== 'draft'}
                        />
                        {errors.funding_plan && (
                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.funding_plan}
                            </p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-between gap-3 mt-8 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-gradient-to-r from-[#FF8C42] to-[#FF6F31] hover:from-[#FF9E55] hover:to-[#FF8333] text-white rounded-xl font-medium transition-all"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        
                        {(!existingFunding || existingFunding.status === 'draft') && (
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-gradient-to-r from-[#FF8C42] to-[#FF6F31] hover:from-[#FF9E55] hover:to-[#FF8333] text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Submitting...</span>
                                    </div>
                                ) : existingFunding ? 'Update Request' : 'Submit Request'}
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
        'draft': 'Draft',
        'pending': 'Pending Review',
        'approved': 'Approved',
        'rejected': 'Rejected',
        'funded': 'Funded'
    };
    return statusMap[status] || status;
};

export default FundingModal;
