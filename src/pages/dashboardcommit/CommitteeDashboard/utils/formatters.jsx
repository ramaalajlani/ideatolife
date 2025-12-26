// src/pages/dashboardcommit/CommitteeDashboard/utils/formatters.js
export const formatDate = (dateString, locale = 'ar-SA') => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
};

export const formatDateTime = (dateString, locale = 'ar-SA') => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return dateString;
  }
};

export const formatCurrency = (amount, currency = 'SAR') => {
  if (!amount) return '0.00';
  
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-emerald-100 text-emerald-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800'
  };
  
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getStatusText = (status) => {
  const texts = {
    pending: 'قيد الانتظار',
    approved: 'معتمد',
    rejected: 'مرفوض',
    in_progress: 'قيد التنفيذ',
    completed: 'مكتمل',
    active: 'نشط',
    inactive: 'غير نشط',
    under_review: 'قيد المراجعة',
    funded: 'ممول'
  };
  
  return texts[status] || status;
};