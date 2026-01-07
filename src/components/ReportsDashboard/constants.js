// src/components/ReportsDashboard/constants.js
export const COLOR_CONFIG = {
  status: {
    completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    underReview: 'bg-amber-100 text-amber-800 border-amber-200',
    accepted: 'bg-blue-100 text-blue-800 border-blue-200',
    pending: 'bg-slate-100 text-slate-800 border-slate-200'
  },
  score: {
    excellent: { min: 90, class: 'bg-emerald-500 text-white' },
    good: { min: 70, class: 'bg-blue-500 text-white' },
    average: { min: 50, class: 'bg-amber-500 text-white' },
    poor: { min: 0, class: 'bg-rose-500 text-white' }
  }
};

export const STATUS_MAPPING = {
  'Completed': 'completed',
  'Under Review': 'underReview',
  'Accepted': 'accepted',
  'Pending': 'pending'
};

export const ICON_CONFIG = {
  strengths: 'CheckCircle',
  weaknesses: 'AlertCircle',
  recommendations: 'Lightbulb',
  default: 'FileText'
};

