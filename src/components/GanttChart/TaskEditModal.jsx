// src/components/GanttChart/TaskEditModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
    X, Upload, FileText, Image, File, 
    Trash2, Download, Calendar, DollarSign,
    CheckCircle, Clock, AlertCircle,
    Edit, Save, Loader2, Paperclip, Users
} from 'lucide-react';
import taskService from '../../services/taskService';

const TaskEditModal = ({ 
    task, 
    onClose, 
    onSubmit,
    onDelete,
    phaseApprovalStatus, // ⬅️ جديد
    onRequestFunding // ⬅️ جديد
}) => {
    const [formData, setFormData] = useState({
        progress_percentage: 0,
        notes: ''
    });
    const [existingAttachments, setExistingAttachments] = useState([]);
    const [newAttachments, setNewAttachments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize form data when task changes
    useEffect(() => {
        if (task) {
            setFormData({
                progress_percentage: task.progress_percentage || 0,
                notes: task.notes || ''
            });
            
            // ✅ معالجة المرفقات الحالية بشكل صحيح
            const attachments = task.attachments || [];
            if (Array.isArray(attachments)) {
                const processedAttachments = attachments.map(att => {
                    if (typeof att === 'string') {
                        return {
                            path: att,
                            name: att.split('/').pop(),
                            type: 'unknown',
                            size: 0
                        };
                    }
                    return {
                        path: att.file_path || att.path || att,
                        name: att.file_name || att.name || 'ملف',
                        type: att.mime_type || att.type || 'unknown',
                        size: att.file_size || att.size || 0,
                        id: att.id || Date.now()
                    };
                });
                setExistingAttachments(processedAttachments);
            }
        }
    }, [task]);

    // ✅ التحقق من صحة الملفات قبل الإضافة
    const validateFile = (file) => {
        const allowedTypes = [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'image/jpg',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        
        const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!allowedExtensions.includes(fileExtension)) {
            return `نوع الملف "${file.name}" غير مدعوم. الأنواع المسموحة: PDF, JPG, PNG, DOC, DOCX`;
        }
        
        if (file.size > maxSize) {
            return `حجم الملف "${file.name}" كبير جداً (${(file.size/1024/1024).toFixed(2)}MB). الحد الأقصى: 5MB`;
        }
        
        return null;
    };

    const handleFileChange = useCallback((e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const validFiles = [];
        const fileErrors = [];

        files.forEach(file => {
            const error = validateFile(file);
            if (error) {
                fileErrors.push(error);
            } else {
                validFiles.push(file);
            }
        });

        if (fileErrors.length > 0) {
            setError(fileErrors.join('\n'));
            return;
        }

        if (validFiles.length > 0) {
            setNewAttachments(prev => [...prev, ...validFiles]);
            setError(null);
        }
        
        e.target.value = '';
    }, []);

    const removeNewAttachment = useCallback((index) => {
        setNewAttachments(prev => prev.filter((_, i) => i !== index));
    }, []);

    const removeExistingAttachment = useCallback((index) => {
        setExistingAttachments(prev => prev.filter((_, i) => i !== index));
    }, []);

    const downloadAttachment = useCallback(async (filePath, fileName) => {
        try {
            const token = localStorage.getItem('token');
            
            const fullPath = filePath.startsWith('storage/') 
                ? `http://localhost:8000/${filePath}`
                : `http://localhost:8000/storage/${filePath}`;
            
            const response = await fetch(fullPath, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (!response.ok) throw new Error('فشل التحميل');
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName || filePath.split('/').pop();
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error('Download error:', err);
            setError('فشل في تحميل الملف: ' + err.message);
        }
    }, []);

    const formatFileSize = (bytes) => {
        if (!bytes || bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (fileName, fileType) => {
        if (!fileName) return <File className="w-5 h-5 text-gray-600" />;
        
        const extension = fileName.split('.').pop().toLowerCase();
        
        if (fileType?.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
            return <Image className="w-5 h-5 text-green-600" />;
        }
        if (fileType?.includes('pdf') || extension === 'pdf') {
            return <FileText className="w-5 h-5 text-red-600" />;
        }
        if (fileType?.includes('word') || extension === 'doc' || extension === 'docx') {
            return <FileText className="w-5 h-5 text-blue-600" />;
        }
        return <File className="w-5 h-5 text-gray-600" />;
    };

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        
        // ✅ منع الإرسال المزدوج
        if (isSubmitting) {
            console.log('🛑 Already submitting, ignoring duplicate request');
            return;
        }
        
        setIsSubmitting(true);
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // ✅ 1. إنشاء FormData
            const formDataToSend = new FormData();
            
            // ✅ 2. إضافة الحقول الأساسية
            formDataToSend.append('progress_percentage', formData.progress_percentage.toString());
            
            if (formData.notes && formData.notes.trim() !== '') {
                formDataToSend.append('notes', formData.notes);
            }

            // ✅ 3. إضافة الملفات الجديدة
            if (newAttachments.length > 0) {
                newAttachments.forEach((file, index) => {
                    formDataToSend.append(`attachments[${index}]`, file);
                });
                console.log(`✅ Added ${newAttachments.length} new files to FormData`);
            }

            // ✅ 4. استدعاء API
            console.log('🔄 Sending request to server...');
            const response = await taskService.updateTask(task.id, formDataToSend);
            
            console.log('✅ Server response:', response);
            
            setSuccess(true);
            setUploadProgress(100);
            
            // ✅ 5. تنفيذ onSubmit مرة واحدة فقط
            if (onSubmit && typeof onSubmit === 'function') {
                console.log('🔄 Calling onSubmit callback...');
                onSubmit(response.data);
            } else {
                console.log('⚠️ onSubmit is not a function or not provided');
            }
            
            // ✅ 6. إغلاق النافذة بعد تأخير قصير
            console.log('⏳ Closing modal in 2 seconds...');
            setTimeout(() => {
                console.log('🚪 Closing modal now');
                onClose();
            }, 2000);
            
        } catch (err) {
            console.error('❌ Submit error details:', err);
            
            // ✅ 7. معالجة الأخطاء بشكل مفصل
            let errorMessage = 'فشل في تحديث المهمة';
            
            if (err.data?.message) {
                errorMessage = err.data.message;
            } else if (err.errors) {
                const errorMessages = [];
                Object.entries(err.errors).forEach(([field, messages]) => {
                    if (Array.isArray(messages)) {
                        messages.forEach(msg => errorMessages.push(`${field}: ${msg}`));
                    } else {
                        errorMessages.push(`${field}: ${messages}`);
                    }
                });
                errorMessage = errorMessages.join('\n');
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
            
        } finally {
            console.log('🏁 Request finished');
            setIsSubmitting(false);
            setLoading(false);
            setUploadProgress(0);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('هل أنت متأكد من حذف هذه المهمة؟ سيتم حذف جميع المرفقات المرتبطة بها.')) {
            try {
                if (onDelete) {
                    await onDelete(task.id);
                }
                onClose();
            } catch (err) {
                setError(err.message || 'فشل في حذف المهمة');
            }
        }
    };

    // دالة طلب التمويل للمهمة
    const handleRequestFunding = () => {
        if (onRequestFunding) {
            onRequestFunding();
            onClose(); // إغلاق نافذة التعديل بعد فتح نافذة طلب التمويل
        }
    };

    if (!task) return null;

    const taskStartDate = new Date(task.start_date).toLocaleDateString('ar-SA');
    const taskEndDate = new Date(task.end_date).toLocaleDateString('ar-SA');
    const isPhaseApproved = phaseApprovalStatus === 'approved';

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div>
                                <h2 className="text-2xl font-bold flex items-center gap-3">
                                    <Edit className="w-7 h-7" />
                                    تعديل المهمة
                                </h2>
                                <p className="text-blue-100 mt-1">{task.task_name}</p>
                            </div>
                            {isPhaseApproved && (
                                <div className="bg-green-500/20 border border-green-400/30 px-3 py-1 rounded-lg text-sm flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    <span>المخطط معتمد</span>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
                            disabled={loading}
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
                    <div className="p-6 space-y-6">
                        {/* زر طلب التمويل - يظهر فقط إذا كان المخطط معتمداً */}
                        {isPhaseApproved && onRequestFunding && (
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <DollarSign className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">طلب تمويل لهذه المهمة</h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                يمكنك طلب تمويل خاص لهذه المهمة من المستثمر
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleRequestFunding}
                                    className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
                                >
                                    <DollarSign className="w-5 h-5" />
                                    <span>طلب تمويل لهذه المهمة</span>
                                </button>
                                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-3 h-3" />
                                        <span>اجتماع مع اللجنة والمستثمر</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3 h-3" />
                                        <span>موعد خلال يومين</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Task Info Summary */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm font-medium text-gray-600">من</span>
                                    </div>
                                    <div className="font-semibold text-gray-900">{taskStartDate}</div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm font-medium text-gray-600">إلى</span>
                                    </div>
                                    <div className="font-semibold text-gray-900">{taskEndDate}</div>
                                </div>
                            </div>
                        </div>

                        {/* Progress Slider */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="block text-lg font-bold text-gray-800">
                                    نسبة الإنجاز
                                </label>
                                <div className="text-2xl font-bold text-blue-600">
                                    {formData.progress_percentage}%
                                </div>
                            </div>
                            
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="1"
                                value={formData.progress_percentage}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    progress_percentage: parseInt(e.target.value)
                                }))}
                                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
                                disabled={loading}
                            />
                            
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>0%</span>
                                <span>25%</span>
                                <span>50%</span>
                                <span>75%</span>
                                <span>100%</span>
                            </div>
                            
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300 rounded-full"
                                    style={{ width: `${formData.progress_percentage}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-lg font-bold text-gray-800 mb-2">
                                ملاحظات إضافية
                            </label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    notes: e.target.value
                                }))}
                                placeholder="أضف ملاحظات حول تقدم المهمة..."
                                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                rows="4"
                                disabled={loading}
                            />
                        </div>

                        {/* Attachments Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="block text-lg font-bold text-gray-800">
                                    المرفقات
                                </label>
                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                    <Paperclip className="w-4 h-4" />
                                    <span>{existingAttachments.length + newAttachments.length} ملفات</span>
                                </div>
                            </div>

                            {/* File Upload Area */}
                            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors bg-gray-50/50">
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 mb-3">
                                    اسحب وأفلت الملفات هنا أو
                                </p>
                                <label className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg cursor-pointer hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
                                    <Upload className="w-5 h-5" />
                                    <span>اختر ملفات</span>
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                        disabled={loading}
                                    />
                                </label>
                                <p className="text-sm text-gray-500 mt-3">
                                    الملفات المسموحة: PDF, JPG, PNG, DOC, DOCX
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    الحد الأقصى لكل ملف: 5MB
                                </p>
                            </div>

                            {/* Upload Progress */}
                            {loading && uploadProgress > 0 && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-700">جاري رفع الملفات...</span>
                                        <span className="font-semibold text-blue-600">{uploadProgress}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            {/* New Files */}
                            {newAttachments.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="font-bold text-gray-700 text-sm">
                                        ملفات جديدة ({newAttachments.length})
                                    </h4>
                                    <div className="space-y-2">
                                        {newAttachments.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    {getFileIcon(file.name, file.type)}
                                                    <div className="min-w-0">
                                                        <div className="font-medium truncate">{file.name}</div>
                                                        <div className="text-xs text-gray-500">
                                                            {formatFileSize(file.size)} • {file.type || 'غير معروف'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewAttachment(index)}
                                                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                                    title="إزالة"
                                                    disabled={loading}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Existing Attachments */}
                            {existingAttachments.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="font-bold text-gray-700 text-sm">
                                        ملفات موجودة ({existingAttachments.length})
                                    </h4>
                                    <div className="space-y-2">
                                        {existingAttachments.map((attachment, index) => {
                                            const fileName = attachment.name || 'ملف';
                                            return (
                                                <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        {getFileIcon(fileName, attachment.type)}
                                                        <div className="min-w-0">
                                                            <div className="font-medium truncate">{fileName}</div>
                                                            <div className="text-xs text-gray-500">
                                                                {attachment.size ? formatFileSize(attachment.size) : 'حجم غير معروف'} • 
                                                                {attachment.type && attachment.type !== 'unknown' ? ` ${attachment.type}` : ' ملف'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => downloadAttachment(attachment.path, fileName)}
                                                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                                            title="تحميل"
                                                            disabled={loading}
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeExistingAttachment(index)}
                                                            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                                            title="حذف"
                                                            disabled={loading}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <span className="font-bold">حدث خطأ</span>
                                </div>
                                <div className="text-sm whitespace-pre-line">{error}</div>
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                <span className="font-semibold">تم تحديث المهمة بنجاح!</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="bg-gray-50 p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex gap-3">
                        {onDelete && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="px-5 py-2.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-semibold flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={loading || isSubmitting}
                            >
                                <Trash2 className="w-5 h-5" />
                                حذف المهمة
                            </button>
                        )}
                    </div>
                    
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            إلغاء
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading || isSubmitting}
                            className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 min-w-[140px]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    جاري الحفظ...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    حفظ التغييرات
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

TaskEditModal.defaultProps = {
    phaseApprovalStatus: null,
    onRequestFunding: null
};

export default TaskEditModal;