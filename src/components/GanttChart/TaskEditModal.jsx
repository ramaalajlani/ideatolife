// src/components/GanttChart/TaskEditModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { X, Upload, Loader2, Save } from 'lucide-react';
import taskService from '../../services/taskService';

const TaskEditModal = ({ task, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({ progress_percentage: 0, notes: '' });
  const [existingAttachments, setExistingAttachments] = useState([]);
  const [newAttachments, setNewAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!task) return;

    setFormData({
      progress_percentage: task.progress_percentage || 0,
      notes: task.notes || ''
    });

    let attachmentsArray = [];
    if (Array.isArray(task.attachments)) {
      attachmentsArray = task.attachments;
    } else if (typeof task.attachments === 'string') {
      try {
        attachmentsArray = JSON.parse(task.attachments);
      } catch {
        attachmentsArray = [];
      }
    }

    setExistingAttachments(
      attachmentsArray.map((att, index) => ({
        id: index,
        name: att.split('/').pop(),
        path: `http://localhost:8000/storage/task_attachments/${att.split('/').pop()}`
      }))
    );
  }, [task]);

  const validateFile = (file) => {
    const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
    const maxSize = 5 * 1024 * 1024;
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    return allowedExtensions.includes(ext) && file.size <= maxSize;
  };

  const handleFileChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const validFiles = files.filter(file => validateFile(file));
    if (validFiles.length) setNewAttachments(prev => [...prev, ...validFiles]);

    e.target.value = '';
  }, []);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setLoading(true);
    setSuccess(false);

    try {
      const form = new FormData();
      form.append('progress_percentage', formData.progress_percentage.toString());
      if (formData.notes?.trim() !== '') form.append('notes', formData.notes);
      newAttachments.forEach(file => form.append('attachments[]', file));

      const response = await taskService.updateTask(task.id, form);
      setSuccess(true);

      if (onSubmit) onSubmit(response?.data);

      setTimeout(() => onClose(), 1500);
    } catch {
      // Ignore server errors
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FF7F50] to-[#FF9933] p-6 text-white flex justify-between items-center">
          <h2 className="text-2xl font-bold">Edit Task: {task.task_name}</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#FF8333] rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 space-y-6">
          {/* Progress */}
          <div className="space-y-3">
            <label className="text-lg font-bold text-gray-800">Progress</label>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={formData.progress_percentage}
              onChange={(e) => setFormData(prev => ({ ...prev, progress_percentage: parseInt(e.target.value) }))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-right font-bold">{formData.progress_percentage}%</div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-lg font-bold text-gray-800 mb-2">Additional Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add notes about task progress..."
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF9E55] resize-none"
            />
          </div>

          {/* Attachments */}
          <div className="space-y-4">
            <label className="text-lg font-bold text-gray-800">Attachments</label>

            {existingAttachments.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-bold text-gray-700 text-sm">Current Files</h4>
                {existingAttachments.map(att => (
                  <div key={att.id} className="bg-white p-3 rounded-lg border border-gray-200 hover:bg-[#FFF0E0] cursor-pointer transition-colors">
                    <div onClick={() => window.open(att.path, '_blank')} className="text-[#FF6F31] hover:text-[#FF8533] hover:underline transition-colors">
                      {att.name}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* New files upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-[#FF9E55] transition-colors bg-white">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-3">Drag & drop files here or select files</p>
              <label className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF8C42] to-[#FF6F31] text-white px-6 py-3 rounded-lg cursor-pointer hover:from-[#FF9E55] hover:to-[#FF8333] transition-all shadow-lg">
                Select Files
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
              </label>

              {newAttachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  <h4 className="font-bold text-gray-700 text-sm">New Files ({newAttachments.length})</h4>
                  {newAttachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 hover:bg-[#FFF0E0] transition-colors">
                      <div>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">Task updated successfully!</div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white p-6 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg">Cancel</button>
          <button
            onClick={handleSubmit}
            className="px-8 py-2.5 bg-gradient-to-r from-[#FF8C42] to-[#FF6F31] text-white rounded-lg flex items-center gap-2 hover:from-[#FF9E55] hover:to-[#FF8333] transition-all"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskEditModal;
