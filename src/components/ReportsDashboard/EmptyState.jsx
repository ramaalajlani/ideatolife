import React from 'react';

const EmptyState = ({ ideaId }) => (
  <div className="w-full h-full flex items-center justify-center p-4">
    <div className="text-center py-12 md:py-16 max-w-md w-full">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-2xl p-8 md:p-12">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute -inset-6 bg-orange-500/10 rounded-full blur-xl"></div>
            <div className="relative bg-gradient-to-br from-orange-500 to-orange-700 p-4 rounded-2xl">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>
        <h3 className="text-orange-400 font-bold text-lg md:text-xl mb-3">لا توجد تقارير متاحة</h3>
        <p className="text-gray-400 text-sm md:text-base mb-6">
          لم يتم إنشاء أي تقارير للفكرة #{ideaId} بعد. ستظهر التقارير هنا بمجرد توفرها من قبل اللجان المختصة.
        </p>
        <div className="flex items-center justify-center gap-3 bg-gray-900/50 rounded-lg p-4 border border-gray-800">
          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <p className="text-gray-300 text-sm">
            يمكن أن تستغرق عملية التقييم بعض الوقت. يرجى التحقق لاحقاً.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default EmptyState;