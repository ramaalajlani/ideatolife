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

export const MOCK_DATA = {
  message: 'All reports for this idea have been retrieved successfully.',
  total_reports: 3,
  data: [
    {
      id: 1,
      type: 'Initial Report',
      description: 'Initial assessment report for idea evaluation and analysis start',
      score: 85,
      status: 'Completed',
      idea: {
        id: 101,
        title: 'Project Management App Idea',
        status: 'Under Review'
      },
      committee: 'Technical Evaluation Committee',
      strengths: ['Innovative idea', 'Clear target audience', 'High added value'],
      weaknesses: ['Needs financial feasibility study', 'Market competition'],
      recommendations: ['Conduct broader market research', 'Develop prototype'],
      createdAt: '2024-01-15 14:30'
    },
    {
      id: 2,
      type: 'Progress Report',
      description: 'Progress tracking report for idea development and performance evaluation',
      score: 92,
      status: 'Completed',
      idea: {
        id: 101,
        title: 'Project Management App Idea',
        status: 'Accepted'
      },
      committee: 'Follow-up and Development Committee',
      strengths: ['Significant progress', 'Good implementation', 'Complete team'],
      weaknesses: ['Limited budget', 'Few human resources'],
      recommendations: ['Expand project scope', 'Search for investors'],
      createdAt: '2024-02-01 10:15'
    },
    {
      id: 3,
      type: 'Final Report',
      description: 'Comprehensive final evaluation report for the idea',
      score: 78,
      status: 'Under Review',
      idea: {
        id: 101,
        title: 'Project Management App Idea',
        status: 'Pending'
      },
      committee: 'Final Evaluation Committee',
      strengths: ['Excellent design', 'Complete features', 'Good user interface'],
      weaknesses: ['Strong competition', 'High development costs'],
      recommendations: ['Improve user interface', 'Add new features'],
      createdAt: '2024-02-20 16:45'
    }
  ]
};