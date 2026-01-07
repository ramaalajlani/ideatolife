import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import businessPlanService from '../../services/businessPlanService';

// استيراد اللوتي أنيميشن
import Lottie from 'lottie-react';
import animationData from '../../assets/animations/Web Development (3).json';

const BMCGridEdit = () => {
  const { ideaId } = useParams();
  
  const [formData, setFormData] = useState({
    key_partners: '',
    key_activities: '',
    key_resources: '',
    value_proposition: '',
    customer_relationships: '',
    channels: '',
    customer_segments: '',
    cost_structure: '',
    revenue_streams: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Professional Color Scheme - Only what you requested
  const sections = [
    { id: 1, title: 'Key Partners', name: 'key_partners', color: '#6DA9E4' },
    { id: 2, title: 'Key Activities', name: 'key_activities', color: '#ADE4DB' },
    { id: 3, title: 'Key Resources', name: 'key_resources', color: '#FFEBEB' },
    { id: 4, title: 'Value Propositions', name: 'value_proposition', color: '#F6BA6F' },
    { id: 5, title: 'Customer Relationships', name: 'customer_relationships', color: '#FFEBEB' },
    { id: 6, title: 'Channels', name: 'channels', color: '#6DA9E4' },
    { id: 7, title: 'Customer Segments', name: 'customer_segments', color: '#ADE4DB' },
    { id: 8, title: 'Cost Structure', name: 'cost_structure', color: '#F6BA6F' },
    { id: 9, title: 'Revenue Streams', name: 'revenue_streams', color: '#FFEBEB' }
  ];

  // Load existing BMC data
  useEffect(() => {
    if (ideaId) {
      loadExistingBusinessPlan();
    }
  }, [ideaId]);

  const loadExistingBusinessPlan = async () => {
    if (!ideaId) return;
    
    setLoading(true);
    
    try {
      const response = await businessPlanService.getBusinessPlan(ideaId);
      
      if (response && response.idea) {
        const bmc = response.idea.business_model_canvas;
        
        if (bmc) {
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
        }
      }
    } catch (error) {
      console.error('Error loading business plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!ideaId) return;

    // Check required fields
    const requiredFields = ['value_proposition', 'customer_segments', 'revenue_streams'];
    const emptyFields = requiredFields.filter(field => !formData[field]?.trim());
    
    if (emptyFields.length > 0) {
      alert('Please complete all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      let response;
      
      // Check if data exists
      const hasData = Object.values(formData).some(value => value.trim().length > 0);
      
      if (hasData) {
        response = await businessPlanService.updateBusinessPlan(ideaId, formData);
      } else {
        response = await businessPlanService.saveBusinessPlan(ideaId, formData);
      }
      
      // Reload data
      await loadExistingBusinessPlan();
      
    } catch (error) {
      console.error('Error saving business plan:', error);
      if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state - minimal
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E67E22]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Much Larger Animation */}
      <div className="bg-[#FFD586] py-5 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800">BMC Edit</h1>
              <p className="text-gray-600 mt-1">Edit all nine building blocks of your Business Model Canvas</p>
            </div>
            {/* الأنيميشن الأكبر والواضح */}
            <div className="w-40 h-40 ml-8">
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
      <div className="h-8"></div>

      <div className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Only the 9 sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {sections.map((section) => (
              <div 
                key={section.id} 
                className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 flex flex-col h-72"
              >
                {/* Card Header - Color bar */}
                <div 
                  className="p-4"
                  style={{ backgroundColor: section.color }}
                >
                  <h3 className="font-medium text-gray-800 text-base">
                    {section.title}
                  </h3>
                </div>
                
                {/* Textarea - Main content */}
                <div className="flex-1 p-4">
                  <textarea
                    name={section.name}
                    value={formData[section.name] || ''}
                    onChange={handleChange}
                    className="w-full h-full p-3 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Describe ${section.title.toLowerCase()}...`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Save Button with Darker Orange and Black Text */}
          <div className="mt-10 flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-10 py-4 bg-[#E67E22] text-gray-900 font-bold rounded-lg hover:bg-[#D35400] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : 'Save All Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Spacing at bottom */}
      <div className="h-10"></div>
    </div>
  );
};

export default BMCGridEdit;