// src/components/GanttChart/PhaseModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';

const PhaseModal = ({ phase, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    phase_name: '',
    start_date: '',
    end_date: '',
    priority: 1,
  });

  useEffect(() => {
    if (phase) {
      setFormData({
        phase_name: phase.phase_name || '',
        start_date: phase.start_date ? phase.start_date.split('T')[0] : '',
        end_date: phase.end_date ? phase.end_date.split('T')[0] : '',
        priority: phase.priority || 1,
      });
    }
  }, [phase]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-gradient-to-r from-[#FF7F50] to-[#FF9933] text-white">
          <h2 className="text-xl font-bold">{phase ? 'Edit Phase' : 'New Phase'}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-orange-600/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Phase Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Phase Name</label>
            <input
              type="text"
              value={formData.phase_name}
              onChange={(e) => setFormData({...formData, phase_name: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition focus:ring-2 focus:ring-[#FF9E55] focus:border-[#FF9E55]"
              placeholder="Enter phase name"
              required
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition pr-10 focus:ring-2 focus:ring-[#FF9E55] focus:border-[#FF9E55]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  min={formData.start_date}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition pr-10 focus:ring-2 focus:ring-[#FF9E55] focus:border-[#FF9E55]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium mb-2">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition focus:ring-2 focus:ring-[#FF9E55] focus:border-[#FF9E55]"
            >
              {[1,2,3,4,5].map(num => (
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
              {phase ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhaseModal;
