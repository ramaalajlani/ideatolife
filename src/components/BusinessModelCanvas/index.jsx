
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { businessModelSteps } from '../../data/businessModelSteps';
import StepProgress from './StepProgress';
import StepNavigation from './StepNavigation';
import StepForm from './steps/StepForm';
import businessPlanService from '../../services/businessPlanService';

const BusinessModelCanvas = () => {
  const navigate = useNavigate();
  const { ideaId } = useParams(); 
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentStepData = businessModelSteps.find(step => step.number === currentStep);

  // تهيئة formData بجميع الحقول المطلوبة
  useEffect(() => {
    const initialData = {};
    businessModelSteps.forEach(step => {
      if (step.name) {
        initialData[step.name] = '';
      }
    });
    setFormData(initialData);
    
    // جلب بيانات BMC المحفوظة إذا كانت موجودة
    if (ideaId) {
      loadExistingBusinessPlan();
    }
  }, [ideaId]);

  // دالة لجلب بيانات BMC المحفوظة
  const loadExistingBusinessPlan = async () => {
    if (!ideaId) return;
    
    setLoading(true);
    try {
      const response = await businessPlanService.getBusinessPlan(ideaId);
      
      if (response && response.data) {
        // ملء الحقول ببيانات BMC المحفوظة
        setFormData(prev => ({
          ...prev,
          ...response.data
        }));
      }
    } catch (error) {
      console.log('No existing business plan or error:', error);
      // لا مشكلة إذا لم تكن هناك بيانات محفوظة
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!ideaId) {
      alert('❌ يرجى اختيار فكرة أولاً');
      return;
    }

    // التحقق من ملء الحقول المهمة
    const requiredFields = ['value_proposition', 'customer_segments', 'revenue_streams'];
    const emptyFields = requiredFields.filter(field => !formData[field]?.trim());
    
    if (emptyFields.length > 0) {
      alert('❌ يرجى ملء جميع الحقول المطلوبة قبل الإرسال');
      return;
    }

    setIsSubmitting(true);
    try {
      // إرسال البيانات إلى API
      const response = await businessPlanService.saveBusinessPlan(ideaId, formData);
      
      if (response.message || response.status === 201) {
        alert(`✅ ${response.message || 'تم حفظ خطة العمل بنجاح!'}`);
        navigate(`/ideas/${ideaId}/reports`);
      }
    } catch (error) {
      console.error('Error saving business plan:', error);
      
      // معالجة الأخطاء المختلفة
      if (error.response?.status === 403) {
        alert('❌ ليس لديك صلاحية إنشاء خطة العمل لهذه الفكرة.');
      } else if (error.response?.status === 400) {
        if (error.response.data?.message.includes('تقييم')) {
          alert('❌ لم تحقق الفكرة الحد الأدنى من التقييم (80) للانتقال إلى خطة العمل.');
        } else {
          alert(`❌ ${error.response.data?.message || 'خطأ في البيانات'}`);
        }
      } else if (error.response?.data?.message) {
        alert(`❌ ${error.response.data.message}`);
      } else if (error.message) {
        alert(`❌ ${error.message}`);
      } else {
        alert('❌ حدث خطأ أثناء حفظ خطة العمل');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < businessModelSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // إذا كان في حالة تحميل
  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-0">
        <div className="w-full h-full flex bg-white">
          <div className="w-full flex flex-col justify-center items-center p-10 lg:p-16 bg-white">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 text-lg">جاري تحميل البيانات...</p>
          </div>
        </div>
      </div>
    );
  }

  // إذا لم يكن هناك ideaId
  if (!ideaId) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">لم يتم تحديد فكرة</h2>
          <p className="text-gray-600 mb-6">
            يرجى اختيار فكرة من القائمة الجانبية أو العودة لقائمة الأفكار.
          </p>
          <button
            onClick={() => navigate('/ideas')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            العودة إلى قائمة الأفكار
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-0">
      <div className="w-full h-full flex bg-white">
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-10 lg:p-16 bg-white overflow-y-auto">
          <StepProgress 
            currentStep={currentStep} 
            totalSteps={businessModelSteps.length} 
            currentTitle={currentStepData.title} 
          />
          <StepForm
            stepData={currentStepData}
            formData={formData}
            onChange={handleChange}
          />
          <StepNavigation
            currentStep={currentStep}
            totalSteps={businessModelSteps.length}
            onNext={nextStep}
            onPrev={prevStep}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
          <div className="flex justify-center mt-8 space-x-2">
            {businessModelSteps.map((step) => (
              <div
                key={step.number}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  step.number === currentStep 
                    ? 'bg-blue-600' 
                    : step.number < currentStep 
                    ? 'bg-green-500' 
                    : 'bg-gray-300'
                }`}
              ></div>
            ))}
          </div>
          {isSubmitting && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600 mr-3"></div>
                <span className="text-green-700 font-medium">جاري حفظ خطة العمل...</span>
              </div>
            </div>
          )}
        </div>
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100 items-center justify-center p-10 border-l border-slate-200">
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src={currentStepData.image} 
              alt={currentStepData.title} 
              className="w-full h-full object-cover rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessModelCanvas;