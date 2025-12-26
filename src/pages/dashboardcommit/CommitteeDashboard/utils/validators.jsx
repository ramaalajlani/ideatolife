// src/pages/dashboardcommit/CommitteeDashboard/utils/validators.js
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

export const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

export const isRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

export const validateMeetingData = (data) => {
  const errors = {};
  
  if (!isRequired(data.meeting_date)) {
    errors.meeting_date = 'تاريخ الاجتماع مطلوب';
  } else if (!isValidDate(data.meeting_date)) {
    errors.meeting_date = 'تاريخ غير صحيح';
  }
  
  if (!isRequired(data.meeting_link)) {
    errors.meeting_link = 'رابط الاجتماع مطلوب';
  } else if (!isValidUrl(data.meeting_link)) {
    errors.meeting_link = 'رابط غير صحيح';
  }
  
  return errors;
};