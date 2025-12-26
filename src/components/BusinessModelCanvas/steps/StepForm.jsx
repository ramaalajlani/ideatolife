
import React from 'react';
const StepForm = ({ stepData, formData, onChange }) => {
  const fieldName = stepData.name;

  if (!fieldName) {
    return (
      <div className="w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{stepData.title}</h2>
        <p className="text-gray-600 mb-6">خطأ: لم يتم تعريف الحقل</p>
      </div>
    );
  }
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{stepData.title}</h2>
      <p className="text-gray-600 mb-6">{stepData.description}</p>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="mb-6">
          <label className="block text-gray-700 text-lg font-semibold mb-3" htmlFor={fieldName}>
            {stepData.title}
          </label>
          <textarea
            id={fieldName}
            name={fieldName}
            value={formData[fieldName] || ''}
            onChange={onChange}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-48 resize-none text-lg"
            placeholder={stepData.placeholder}
            rows="8"
          />
        </div>
      </div>
    </div>
  );
};
export default StepForm;