// src/components/BusinessModel/steps/StepForm.jsx
import React from 'react';

const StepForm = ({ stepData, formData, onChange, readOnly = false }) => {
  const { title, description, name, placeholder } = stepData;

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {readOnly ? (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {formData[name] || 'لا توجد بيانات'}
            </p>
          </div>
        ) : (
          <textarea
            name={name}
            value={formData[name] || ''}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            rows="10"
          />
        )}
        
        {!readOnly && (
          <div className="mt-4 text-sm text-gray-500 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            {name === 'value_proposition' && 'اكتب القيمة المقدمة للعملاء بوضوح'}
            {name === 'customer_segments' && 'حدد شرائح العملاء المستهدفة'}
            {name === 'revenue_streams' && 'صف مصادر الدخل وكيفية تحقيق الإيرادات'}
            {name === 'key_partners' && 'اذكر الشركاء الرئيسيين والعلاقات معهم'}
            {name === 'key_activities' && 'صف الأنشطة الرئيسية لتنفيذ الفكرة'}
            {name === 'key_resources' && 'حدد الموارد الأساسية المطلوبة'}
            {name === 'customer_relationships' && 'صف كيفية بناء علاقات مع العملاء'}
            {name === 'channels' && 'اذكر قنوات الوصول للعملاء والتوزيع'}
            {name === 'cost_structure' && 'حدد الهيكل التكلفي للفكرة'}
          </div>
        )}
      </div>
    </div>
  );
};

export default StepForm;