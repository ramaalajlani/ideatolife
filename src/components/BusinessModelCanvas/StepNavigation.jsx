import React from 'react';

const StepNavigation = ({ currentStep, totalSteps, onNext, onPrev, onSubmit, isSubmitting = false }) => {
  return (
    <div className="flex justify-between space-x-4">
      <button
        type="button"
        onClick={onPrev}
        disabled={currentStep === 1 || isSubmitting}
        className={`flex-1 py-3 px-6 border border-orange-500 text-orange-500 text-lg font-bold rounded-lg hover:bg-orange-50 transition-all duration-300 flex items-center justify-center ${
          currentStep === 1 || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
        </svg>
        السابق
      </button>

      {currentStep < totalSteps ? (
        <button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
          className={`flex-1 py-3 px-6 bg-gradient-to-r from-orange-500 to-orange-800 text-white text-lg font-bold rounded-lg hover:from-orange-600 hover:to-orange-900 transform hover:scale-105 transition-all duration-300 flex items-center justify-center ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          التالي
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      ) : (
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className={`flex-1 py-3 px-6 bg-gradient-to-r from-orange-500 to-orange-800 text-white text-lg font-bold rounded-lg hover:from-orange-600 hover:to-orange-900 transform hover:scale-105 transition-all duration-300 flex items-center justify-center ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              جاري الإرسال...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
              </svg>
              حفظ وإرسال للجنة
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default StepNavigation;