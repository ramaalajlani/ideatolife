// src/components/GanttChart/TaskModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Calendar, FileText, Upload, Trash2 } from 'lucide-react';

const TaskModal = ({ task, phase, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    task_name: '',
    description: '',
    start_date: '',
    end_date: '',
    priority: 1,
    progress_percentage: 0,
  });

  const [attachments, setAttachments] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        task_name: task.task_name || '',
        description: task.description || '',
        start_date: task.start_date ? task.start_date.split('T')[0] : '',
        end_date: task.end_date ? task.end_date.split('T')[0] : '',
        priority: task.priority || 1,
        progress_percentage: task.progress_percentage || 0,
      });
      
      if (task.attachments) {
        setAttachments(Array.isArray(task.attachments) ? task.attachments : [task.attachments]);
      }
    } else if (phase) {
      // تعيين تواريخ افتراضية بناءً على المرحلة
      setFormData(prev => ({
        ...prev,
        start_date: phase.start_date ? phase.start_date.split('T')[0] : '',
        end_date: phase.end_date ? phase.end_date.split('T')[0] : '',
      }));
    }
  }, [task, phase]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'progress_percentage' ? parseInt(value) || 0 : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.task_name.trim()) {
      newErrors.task_name = 'اسم المهمة مطلوب';
    }
    
    if (!formData.start_date) {
      newErrors.start_date = 'تاريخ البداية مطلوب';
    }
    
    if (!formData.end_date) {
      newErrors.end_date = 'تاريخ النهاية مطلوب';
    } else if (formData.start_date && new Date(formData.end_date) < new Date(formData.start_date)) {
      newErrors.end_date = 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية';
    }
    
    if (formData.progress_percentage < 0 || formData.progress_percentage > 100) {
      newErrors.progress_percentage = 'النسبة يجب أن تكون بين 0 و 100';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const data = { ...formData };
      
      if (attachments.length > 0 && attachments[0] instanceof File) {
        data.attachments = attachments;
      }
      
      onSubmit(data);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* رأس النافذة */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {task ? 'تعديل المهمة' : 'إضافة مهمة جديدة'}
            </h2>
            {phase && (
              <p className="text-sm text-gray-600 mt-1">
                ضمن مرحلة: <span className="font-semibold">{phase.phase_name}</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* جسم النافذة */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* اسم المهمة */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم المهمة *
              </label>
              <input
                type="text"
                name="task_name"
                value={formData.task_name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                  errors.task_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="مثال: تصميم الصفحة الرئيسية"
              />
              {errors.task_name && (
                <p className="mt-1 text-sm text-red-600">{errors.task_name}</p>
              )}
            </div>
            
            {/* الوصف */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الوصف
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                placeholder="وصف تفصيلي للمهمة..."
              />
            </div>
            
            {/* التواريخ */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاريخ البداية *
                </label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition pr-10 ${
                      errors.start_date ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.start_date && (
                  <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاريخ النهاية *
                </label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    min={formData.start_date}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition pr-10 ${
                      errors.end_date ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.end_date && (
                  <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
                )}
              </div>
            </div>
            
            {/* الأولوية والتقدم */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الأولوية
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? '(الأقل)' : num === 5 ? '(الأعلى)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              
     
            </div>
            
           
          </div>
          
          {/* أزرار النافذة */}
          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              {task ? 'تحديث المهمة' : 'إضافة المهمة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;