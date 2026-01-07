import React, { useState } from "react";
import {
  CalendarDays,
  Users,
  TrendingUp,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  User,
  Target
} from "lucide-react";
import postLaunchService from "/src/services/postLaunchService";

const PostLaunchFollowupsTab = ({ followups = [], isLoading, refreshData }) => {
  const [selectedFollowup, setSelectedFollowup] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEvaluateModal, setShowEvaluateModal] = useState(false);
  const [evaluationData, setEvaluationData] = useState({
    performance_status: "",
    risk_level: "",
    risk_description: "",
    committee_decision: "",
    actions_taken: "",
    committee_notes: "",
    marketing_support_given: false,
    product_issue_detected: false
  });

  // فتح تفاصيل المتابعة
  const handleViewDetails = (followup) => {
    setSelectedFollowup(followup);
    setShowDetailsModal(true);
  };

  // فتح نموذج التقييم
  const handleEvaluate = (followup) => {
    setSelectedFollowup(followup);
    setShowEvaluateModal(true);
  };

  // التحقق مما إذا كان يمكن التقييم
  const canEvaluate = (followup) => {
    // يمكن التقييم إذا كانت البيانات مملوءة ولم تتم التقييم بعد
    return followup.active_users !== null && 
           followup.revenue !== null && 
           followup.growth_rate !== null &&
           !followup.committee_decision;
  };

  // إرسال التقييم
  const handleSubmitEvaluation = async () => {
    if (!selectedFollowup) return;
    
    try {
      await postLaunchService.committeeSubmitFollowup(
        selectedFollowup.followup.id,
        evaluationData
      );
      
      alert("تم تقديم التقييم بنجاح");
      setShowEvaluateModal(false);
      refreshData();
    } catch (error) {
      alert(`خطأ: ${error.message}`);
    }
  };

  // تصنيف المتابعات حسب الحالة
  const pendingFollowups = followups.filter(item => 
    item.followup?.status === 'pending' && 
    item.followup?.active_users === null
  );

  const waitingFollowups = followups.filter(item => 
    item.followup?.status === 'pending' && 
    item.followup?.active_users !== null
  );

  const completedFollowups = followups.filter(item => 
    item.followup?.status === 'done'
  );

  // عرض حالة التحميل
  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8A65] mx-auto"></div>
          <p className="mt-4 text-gray-500">جاري تحميل متابعات ما بعد الإطلاق...</p>
        </div>
      </div>
    );
  }

  // إذا لم توجد متابعات
  if (followups.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
        <Target className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          لا توجد متابعات بعد الإطلاق
        </h3>
        <p className="text-gray-500 max-w-md">
          لم يتم إنشاء أي متابعات بعد الإطلاق للأفكار المشرفة عليها من قبل لجنتك.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* عناوين الأقسام */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* المتابعات المعلقة (تحتاج إلى تعبئة البيانات) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-orange-50 border-b border-orange-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                في انتظار تعبئة البيانات
              </h3>
              <span className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">
                {pendingFollowups.length}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              تنتظر تعبئة البيانات من أصحاب الأفكار
            </p>
          </div>
          
          <div className="p-6 space-y-4">
            {pendingFollowups.map((item, index) => (
              <div 
                key={index} 
                className="bg-orange-50 border border-orange-100 rounded-xl p-4 hover:bg-orange-100 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-800">{item.idea?.title}</h4>
                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {item.idea?.owner?.name}
                    </p>
                  </div>
                  <span className="bg-orange-200 text-orange-800 text-xs font-medium px-2 py-1 rounded">
                    {postLaunchService.getPhaseLabel(item.followup?.phase)}
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <CalendarDays className="w-4 h-4 mr-1" />
                  <span>موعد المتابعة: {postLaunchService.formatDate(item.followup?.scheduled_date)}</span>
                </div>
                
                <div className="text-sm text-gray-600 bg-white rounded-lg p-3 border">
                  <p className="flex items-center gap-1">
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                    في انتظار تعبئة البيانات من صاحب الفكرة
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* المتابعات الجاهزة للتقييم */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-blue-50 border-b border-blue-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                جاهزة للتقييم
              </h3>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {waitingFollowups.length}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              تنتظر تقييم اللجنة
            </p>
          </div>
          
          <div className="p-6 space-y-4">
            {waitingFollowups.map((item, index) => (
              <div 
                key={index} 
                className="bg-blue-50 border border-blue-100 rounded-xl p-4 hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-800">{item.idea?.title}</h4>
                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {item.idea?.owner?.name}
                    </p>
                  </div>
                  <span className="bg-blue-200 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                    {postLaunchService.getPhaseLabel(item.followup?.phase)}
                  </span>
                </div>
                
                {/* بيانات الأداء */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-white rounded-lg p-2 text-center border">
                    <Users className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                    <div className="text-sm font-medium">{item.followup?.active_users || 0}</div>
                    <div className="text-xs text-gray-500">مستخدمون</div>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center border">
                    <DollarSign className="w-4 h-4 text-green-500 mx-auto mb-1" />
                    <div className="text-sm font-medium">
                      {postLaunchService.formatCurrency(item.followup?.revenue || 0)}
                    </div>
                    <div className="text-xs text-gray-500">إيرادات</div>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center border">
                    <TrendingUp className="w-4 h-4 text-purple-500 mx-auto mb-1" />
                    <div className="text-sm font-medium">{item.followup?.growth_rate || 0}%</div>
                    <div className="text-xs text-gray-500">نمو</div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleEvaluate(item)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  تقييم المتابعة
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* المتابعات المكتملة */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-green-50 border-b border-green-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                مكتملة
              </h3>
              <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                {completedFollowups.length}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              تم تقييمها وإكمالها
            </p>
          </div>
          
          <div className="p-6 space-y-4">
            {completedFollowups.map((item, index) => (
              <div 
                key={index} 
                className="bg-green-50 border border-green-100 rounded-xl p-4 hover:bg-green-100 transition-colors cursor-pointer"
                onClick={() => handleViewDetails(item)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-800">{item.idea?.title}</h4>
                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {item.idea?.owner?.name}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="bg-green-200 text-green-800 text-xs font-medium px-2 py-1 rounded">
                      {postLaunchService.getPhaseLabel(item.followup?.phase)}
                    </span>
                    {item.followup?.committee_decision && (
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        item.followup.committee_decision === 'graduate' ? 'bg-green-200 text-green-800' :
                        item.followup.committee_decision === 'terminate' ? 'bg-red-200 text-red-800' :
                        'bg-blue-200 text-blue-800'
                      }`}>
                        {postLaunchService.getDecisionText(item.followup.committee_decision)}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* البيانات الأساسية */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-white rounded-lg p-2 text-center border">
                    <div className="text-sm font-medium">
                      {postLaunchService.formatCurrency(item.followup?.revenue || 0)}
                    </div>
                    <div className="text-xs text-gray-500">إيرادات</div>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center border">
                    <div className="text-sm font-medium">{item.followup?.growth_rate || 0}%</div>
                    <div className="text-xs text-gray-500">نمو</div>
                  </div>
                </div>
                
                {item.followup?.performance_status && (
                  <div className="text-sm">
                    <span className="text-gray-600">الأداء: </span>
                    <span className="font-medium">
                      {postLaunchService.getPerformanceStatusText(item.followup.performance_status)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* نموذج تفاصيل المتابعة */}
      {showDetailsModal && selectedFollowup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">
                تفاصيل المتابعة
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              {/* معلومات الفكرة */}
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-800 mb-2">{selectedFollowup.idea?.title}</h4>
                <p className="text-gray-600">صاحب الفكرة: {selectedFollowup.idea?.owner?.name}</p>
              </div>
              
              {/* تفاصيل المتابعة */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-sm text-gray-500">المرحلة</label>
                  <p className="font-medium">{postLaunchService.getPhaseLabel(selectedFollowup.followup?.phase)}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">التاريخ</label>
                  <p className="font-medium">{postLaunchService.formatDate(selectedFollowup.followup?.scheduled_date)}</p>
                </div>
              </div>
              
              {/* بيانات الأداء */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h5 className="font-medium text-gray-800 mb-3">بيانات الأداء</h5>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">المستخدمون النشطون</label>
                    <p className="text-lg font-medium">{selectedFollowup.followup?.active_users || 0}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">الإيرادات</label>
                    <p className="text-lg font-medium">{postLaunchService.formatCurrency(selectedFollowup.followup?.revenue || 0)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">معدل النمو</label>
                    <p className="text-lg font-medium">{selectedFollowup.followup?.growth_rate || 0}%</p>
                  </div>
                </div>
              </div>
              
              {/* تقييم اللجنة */}
              {selectedFollowup.followup?.committee_decision && (
                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                  <h5 className="font-medium text-gray-800 mb-3">تقييم اللجنة</h5>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-500">حالة الأداء</label>
                      <p className="font-medium">{postLaunchService.getPerformanceStatusText(selectedFollowup.followup?.performance_status)}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">قرار اللجنة</label>
                      <p className="font-medium">{postLaunchService.getDecisionText(selectedFollowup.followup?.committee_decision)}</p>
                    </div>
                    {selectedFollowup.followup?.committee_notes && (
                      <div>
                        <label className="text-sm text-gray-500">ملاحظات اللجنة</label>
                        <p className="font-medium">{selectedFollowup.followup.committee_notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostLaunchFollowupsTab;