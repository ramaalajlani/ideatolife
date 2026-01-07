// src/components/GanttChart/TaskModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';

const TaskModal = ({ task, phase, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    task_name: '',
    description: '',
    start_date: '',
    end_date: '',
    priority: 1,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        task_name: task.task_name || '',
        description: task.description || '',
        start_date: task.start_date ? task.start_date.split('T')[0] : '',
        end_date: task.end_date ? task.end_date.split('T')[0] : '',
        priority: task.priority || 1,
      });
    } else if (phase) {
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
      [name]: value,
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.task_name.trim()) {
      newErrors.task_name = 'Task name is required';
    }
    
    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }
    
    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
    } else if (formData.start_date && new Date(formData.end_date) < new Date(formData.start_date)) {
      newErrors.end_date = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ ...formData });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-gradient-to-r from-[#FF7F50] to-[#FF9933] text-white">
          <div>
            <h2 className="text-xl font-bold">
              {task ? 'Edit Task' : 'Add New Task'}
            </h2>
            {phase && (
              <p className="text-sm mt-1">
                In Phase: <span className="font-semibold">{phase.phase_name}</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-orange-600/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Task Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Task Name *</label>
            <input
              type="text"
              name="task_name"
              value={formData.task_name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg outline-none transition ${
                errors.task_name ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-[#FF9E55] focus:border-[#FF9E55]`}
              placeholder="Example: Homepage Design"
            />
            {errors.task_name && <p className="mt-1 text-sm text-red-600">{errors.task_name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition resize-none focus:ring-2 focus:ring-[#FF9E55] focus:border-[#FF9E55]"
              placeholder="Detailed description of the task..."
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date *</label>
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg outline-none transition pr-10 ${
                    errors.start_date ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-[#FF9E55] focus:border-[#FF9E55]`}
                />
              </div>
              {errors.start_date && <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">End Date *</label>
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  min={formData.start_date}
                  className={`w-full px-4 py-2 border rounded-lg outline-none transition pr-10 ${
                    errors.end_date ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-[#FF9E55] focus:border-[#FF9E55]`}
                />
              </div>
              {errors.end_date && <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium mb-2">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition focus:ring-2 focus:ring-[#FF9E55] focus:border-[#FF9E55]"
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? '(Lowest)' : num === 5 ? '(Highest)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gradient-to-r from-[#FF8C42] to-[#FF6F31] hover:from-[#FF9E55] hover:to-[#FF8333] text-white rounded-lg font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-[#FF8C42] to-[#FF6F31] hover:from-[#FF9E55] hover:to-[#FF8333] text-white rounded-lg font-medium transition-all"
            >
              {task ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
