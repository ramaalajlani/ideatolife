import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { businessModelSteps } from '../../data/businessModelSteps';
import StepProgress from './StepProgress';
import StepNavigation from './StepNavigation';
import StepForm from './steps/StepForm';
import businessPlanService from '../../services/businessPlanService';

// استيراد اللوتي أنيميشن
import Lottie from 'lottie-react';
import animationData from '../../assets/animations/Animation - 1707760121042.json';

const BusinessModelCanvas = () => {
  const navigate = useNavigate();
  const { ideaId } = useParams(); 
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bmcData, setBmcData] = useState(null);
  const [viewMode, setViewMode] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const currentStepData = businessModelSteps.find(step => step.number === currentStep);

  useEffect(() => {
    if (ideaId) {
      loadExistingBusinessPlan();
    } else {
      setLoading(false);
    }
  }, [ideaId]);

  const loadExistingBusinessPlan = async () => {
    if (!ideaId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await businessPlanService.getBusinessPlan(ideaId);
      
      if (response && response.idea) {
        const bmc = response.idea.business_model_canvas;
        
        if (bmc) {
          setBmcData({
            ...bmc,
            ideaInfo: {
              title: response.idea.title,
              status: response.idea.status,
              roadmap_stage: response.idea.roadmap_stage
            }
          });
          
          setFormData({
            key_partners: bmc.key_partners || '',
            key_activities: bmc.key_activities || '',
            key_resources: bmc.key_resources || '',
            value_proposition: bmc.value_proposition || '',
            customer_relationships: bmc.customer_relationships || '',
            channels: bmc.channels || '',
            customer_segments: bmc.customer_segments || '',
            cost_structure: bmc.cost_structure || '',
            revenue_streams: bmc.revenue_streams || '',
          });
          
          if (bmc.status === 'needs_revision') {
            setViewMode(false);
          } else {
            setViewMode(true);
          }
        } else {
          setBmcData(null);
          setViewMode(false);
          
          const initialData = {};
          businessModelSteps.forEach(step => {
            if (step.name) {
              initialData[step.name] = '';
            }
          });
          setFormData(initialData);
        }
      } else {
        setBmcData(null);
        setViewMode(false);
        
        const initialData = {};
        businessModelSteps.forEach(step => {
          if (step.name) {
            initialData[step.name] = '';
          }
        });
        setFormData(initialData);
      }
    } catch (error) {
      console.error('Error loading business plan:', error);
      
      if (error.message === 'لم يتم العثور على بيانات خطة العمل') {
        setBmcData(null);
        setViewMode(false);
        
        const initialData = {};
        businessModelSteps.forEach(step => {
          if (step.name) {
            initialData[step.name] = '';
          }
        });
        setFormData(initialData);
      } else {
        setBmcData(null);
        setViewMode(false);
        
        const initialData = {};
        businessModelSteps.forEach(step => {
          if (step.name) {
            initialData[step.name] = '';
          }
        });
        setFormData(initialData);
      }
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
      alert('Please select an idea first');
      return;
    }

    const requiredFields = ['value_proposition', 'customer_segments', 'revenue_streams'];
    const emptyFields = requiredFields.filter(field => !formData[field]?.trim());
    
    if (emptyFields.length > 0) {
      alert('Please complete all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      let response;
      
      if (bmcData) {
        response = await businessPlanService.updateBusinessPlan(ideaId, formData);
      } else {
        response = await businessPlanService.saveBusinessPlan(ideaId, formData);
      }
      
      // إظهار رسالة النجاح
      setShowSuccess(true);
      
      // الانتظار 2 ثانية ثم التوجيه إلى صفحة الـ roadmap
      setTimeout(() => {
        navigate(`/ideas/${ideaId}/roadmap`);
      }, 2000);
      
    } catch (error) {
      console.error('Error saving/updating business plan:', error);
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleError = (error) => {
    if (error.response?.status === 403) {
      if (error.response.data?.message.includes('الموافقة')) {
        alert('Business plan has been finally approved, BMC cannot be edited anymore.');
      } else {
        alert('You do not have permission to perform this action.');
      }
    } else if (error.response?.status === 400) {
      if (error.response.data?.message.includes('تقييم')) {
        alert('The idea did not achieve the minimum evaluation (80) to move to business plan.');
      } else {
        alert(`Error: ${error.response.data?.message || 'Data error'}`);
      }
    } else if (error.response?.data?.message) {
      alert(`Error: ${error.response.data.message}`);
    } else {
      alert('An error occurred');
    }
  };

  const handleCancelEdit = () => {
    setViewMode(true);
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

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">Success!</h2>
          <p className="text-gray-600 mb-6">
            Business plan has been saved successfully!
          </p>
          <div className="text-sm text-gray-500">
            Redirecting to roadmap...
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading business plan data...</p>
      </div>
    );
  }

  if (error && !bmcData) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.404 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">Error loading data</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/ideas')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Back to ideas list
          </button>
        </div>
      </div>
    );
  }

  if (!ideaId) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">No idea selected</h2>
          <p className="text-gray-600 mb-6">
            Please select an idea from the sidebar or return to ideas list.
          </p>
          <button
            onClick={() => navigate('/ideas')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Back to ideas list
          </button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      'draft': { color: 'bg-gray-100 text-gray-800 border-gray-200', text: 'Draft' },
      'submitted': { color: 'bg-blue-100 text-blue-800 border-blue-200', text: 'Submitted' },
      'under_review': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: 'Under Review' },
      'needs_revision': { color: 'bg-orange-100 text-orange-800 border-orange-200', text: 'Needs Revision' },
      'approved': { color: 'bg-green-100 text-green-800 border-green-200', text: 'Approved' },
      'rejected': { color: 'bg-red-100 text-red-800 border-red-200', text: 'Rejected' }
    };

    const config = statusConfig[status] || statusConfig['draft'];
    
    return (
      <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const DisplayBMC = ({ data }) => {
    const currentField = businessModelSteps.find(step => step.number === currentStep);
    const fieldValue = data[currentField?.name] || '';
    
    // إذا كانت القيمة فارغة أو "n" فلا نعرض شيئاً
    if (!fieldValue || fieldValue.trim() === '' || fieldValue.trim() === 'n') {
      return null;
    }
    
    return (
      <div className="mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{currentField?.title}</h3>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{fieldValue}</p>
          </div>
        </div>
      </div>
    );
  };

  if (!viewMode && bmcData?.status === 'needs_revision') {
    window.location.href = `/ideas/${ideaId}/bmc/edit-grid`;
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Animation */}
      <div className="bg-[#FFD586] py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Business Model Canvas</h1>
              <p className="text-gray-600 text-sm mt-1">Create and manage your business model step by step</p>
            </div>
            <div className="w-16 h-16">
              <Lottie 
                animationData={animationData}
                loop={true}
                autoplay={true}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Spacing between header and content */}
      <div className="h-6"></div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="w-full h-full flex bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-10 bg-white overflow-y-auto">
            <div className="mb-8">
              {/* Header مع خلفية مرنة */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* الجانب الأيسر: اسم الفكرة والحالة */}
                  <div className="space-y-2">
                    {bmcData?.ideaInfo?.title && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 text-sm font-medium">Idea:</span>
                        <span className="text-gray-800 font-semibold text-sm bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                          {bmcData.ideaInfo.title}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 text-sm font-medium">Status:</span>
                      {bmcData && getStatusBadge(bmcData.status)}
                    </div>
                  </div>
                  
                  {/* الجانب الأيمن: زر الرجوع مع أيقونة */}
                  <div className="flex justify-end">
               
                  </div>
                </div>
                
                {/* رسالة الحالة مع تحسين التنسيق */}
                {bmcData && bmcData.status !== 'draft' && (
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${bmcData.status === 'approved' ? 'bg-green-100' : ''}`}>
                        {bmcData.status === 'approved' ? (
                          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : null}
                      </div>
                      <div>
                        <p className={`font-medium text-sm ${bmcData.status === 'approved' ? 'text-green-700' : 'text-gray-700'}`}>
                          {bmcData.status === 'needs_revision' ? '📝 Business plan needs revision' :
                           bmcData.status === 'approved' ? '✅ Business plan approved' :
                           bmcData.status === 'rejected' ? '❌ Business plan rejected' :
                           bmcData.status === 'under_review' ? '⏳ Business plan under review' :
                           '📄 Business plan saved'}
                        </p>
                        {bmcData.status === 'approved' && (
                          <p className="text-xs text-green-600 mt-1">
                            Your business plan has been approved and is ready for implementation.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {!viewMode && (
              <StepProgress 
                currentStep={currentStep} 
                totalSteps={businessModelSteps.length} 
                currentTitle={currentStepData.title} 
              />
            )}
            
            {viewMode && bmcData ? (
              <DisplayBMC data={bmcData} />
            ) : (
              <StepForm
                stepData={currentStepData}
                formData={formData}
                onChange={handleChange}
                readOnly={false}
              />
            )}
            
            {!viewMode && (
              <StepNavigation
                currentStep={currentStep}
                totalSteps={businessModelSteps.length}
                onNext={nextStep}
                onPrev={prevStep}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
          
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100 items-center justify-center p-8 border-l border-slate-200">
            <div className="w-full h-full flex items-center justify-center">
              <img 
                src={currentStepData.image} 
                alt={currentStepData.title} 
                className="w-full h-full object-cover rounded-xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Spacing at bottom */}
      <div className="h-8"></div>
    </div>
  );
};

export default BusinessModelCanvas;