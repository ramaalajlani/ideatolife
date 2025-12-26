// src/components/ReportsDashboard/utils.js
export const getScoreColor = (score) => {
  if (score >= 90) return 'bg-emerald-500';
  if (score >= 70) return 'bg-blue-500';
  if (score >= 50) return 'bg-amber-500';
  return 'bg-rose-500';
};

export const getStatusColor = (status) => {
  const statusMap = {
    'مكتمل': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'قيد المراجعة': 'bg-amber-100 text-amber-800 border-amber-200', 
    'مقبول': 'bg-blue-100 text-blue-800 border-blue-200',
    'معلق': 'bg-slate-100 text-slate-800 border-slate-200'
  };
  return statusMap[status] || statusMap['معلق'];
};