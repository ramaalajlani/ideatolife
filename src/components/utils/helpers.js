// src/utils/helpers.js
export const getScoreColor = (score) => {
  const numScore = typeof score === 'string' ? parseFloat(score) : score;
  
  if (numScore >= 90) return 'bg-gradient-to-r from-emerald-500 to-emerald-600';
  if (numScore >= 85) return 'bg-gradient-to-r from-green-500 to-green-600';
  if (numScore >= 70) return 'bg-gradient-to-r from-blue-500 to-blue-600';
  if (numScore >= 50) return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
  return 'bg-gradient-to-r from-red-500 to-red-600';
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500/10 text-green-600 border-green-500/30';
    case 'in_progress':
      return 'bg-blue-500/10 text-blue-600 border-blue-500/30';
    case 'pending':
      return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30';
    default:
      return 'bg-gray-500/10 text-gray-600 border-gray-500/30';
  }
};