import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import postLaunchFollowupService from "../services/postLaunchFollowupService";

const PostLaunchFollowups = () => {
  const { ideaId } = useParams();
  const [loading, setLoading] = useState(true);
  const [followups, setFollowups] = useState([]);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [acknowledging, setAcknowledging] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // "all", "committee", "owner"
  const [ownerResponse, setOwnerResponse] = useState("");

  useEffect(() => {
    const fetchFollowups = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await postLaunchFollowupService.getFollowupsByIdeaId(ideaId);
        setFollowups(data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "حدث خطأ أثناء جلب البيانات");
      } finally {
        setLoading(false);
      }
    };

    if (ideaId) fetchFollowups();
  }, [ideaId]);

  const handleInputChange = (index, field, value) => {
    const newFollowups = [...followups];
    newFollowups[index].followup[field] = value;
    setFollowups(newFollowups);
  };

  const handleUpdate = async (followupId, index) => {
    // التحقق من أن المستخدم ملأ جميع الحقول المطلوبة (كما في الباك إند)
    const followupData = {
      active_users: followups[index].followup.active_users,
      revenue: followups[index].followup.revenue,
      growth_rate: followups[index].followup.growth_rate,
    };

    // التحقق من عدم وجود قيم null (كما في الباك إند)
    if (!followupData.active_users || !followupData.revenue || !followupData.growth_rate) {
      alert("يجب ملء جميع الحقول المطلوبة: المستخدمون النشطون، الإيرادات، معدل النمو");
      return;
    }

    setUpdating(true);
    try {
      const result = await postLaunchFollowupService.updateFollowupByOwner(followupId, followupData);
      alert(result.message);
      
      // تحديث حالة المتابعة بعد النجاح
      const newFollowups = [...followups];
      newFollowups[index].followup.status = "pending_review"; // أو حالة مناسبة
      setFollowups(newFollowups);
    } catch (err) {
      alert(err.response?.data?.message || "حدث خطأ أثناء التحديث");
    } finally {
      setUpdating(false);
    }
  };

  const handleAcknowledge = async (followupId, index) => {
    if (!ownerResponse.trim()) {
      alert("يرجى كتابة رد على ملاحظات اللجنة");
      return;
    }

    setAcknowledging(true);
    try {
      const data = {
        owner_response: ownerResponse,
        owner_acknowledged: true
      };
      
      const result = await postLaunchFollowupService.acknowledgeFollowup(followupId, data);
      alert(result.message);
      
      // تحديث حالة المتابعة
      const newFollowups = [...followups];
      newFollowups[index].followup.owner_acknowledged = true;
      newFollowups[index].followup.owner_response = ownerResponse;
      setFollowups(newFollowups);
      setOwnerResponse("");
    } catch (err) {
      alert(err.response?.data?.message || "حدث خطأ أثناء إرسال الرد");
    } finally {
      setAcknowledging(false);
    }
  };

  // تصفية المتابعات حسب التبويب النشط
  const filteredFollowups = followups.filter((item) => {
    const f = item.followup;
    
    if (activeTab === "committee") {
      // تبويب ردود اللجنة - فقط المتابعات التي لديها قرار لجنة
      return f.committee_decision && f.committee_decision !== "";
    } else if (activeTab === "owner") {
      // تبويب إدخال صاحب الفكرة - المتابعات pending أو التي تحتاج رد
      return f.status === "pending" || 
             (f.committee_decision && !f.owner_acknowledged);
    } else if (activeTab === "completed") {
      // تبويب جديد: المتابعات المكتملة
      return f.status === "done";
    } else if (activeTab === "graduate") {
      // تبويب جديد: المشاريع المتخرجة
      return f.committee_decision === "graduate";
    }
    return true; // تبويب "كل المتابعات"
  });

  // حساب الإحصائيات
  const stats = {
    total: followups.length,
    pending: followups.filter(f => f.followup.status === "pending").length,
    completed: followups.filter(f => f.followup.status === "done").length,
    graduated: followups.filter(f => f.followup.committee_decision === "graduate").length,
    needsResponse: followups.filter(f => f.followup.committee_decision && !f.followup.owner_acknowledged).length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">جاري تحميل المتابعات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-red-800 text-center mb-2">خطأ في تحميل البيانات</h3>
          <p className="text-red-600 text-center">{error}</p>
        </div>
      </div>
    );
  }

  if (followups.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 max-w-md w-full text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 text-blue-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">لا توجد متابعات حالياً</h3>
          <p className="text-gray-600">لم يتم إنشاء أي متابعات لهذه الفكرة بعد.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* رأس الصفحة مع الإحصائيات */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">متابعات ما بعد الإطلاق</h1>
              <p className="text-gray-600 mt-2">عرض وتحديث بيانات المتابعة للفكرة المقترحة</p>
            </div>
            
            <div className="mt-4 md:mt-0 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white rounded-lg p-3 shadow-sm border text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-600">إجمالي المتابعات</div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm border text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <div className="text-sm text-gray-600">قيد الانتظار</div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm border text-center">
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <div className="text-sm text-gray-600">مكتملة</div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm border text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.graduated}</div>
                <div className="text-sm text-gray-600">متخرجة</div>
              </div>
            </div>
          </div>

          {/* فلترة حسب التاريخ */}
          <div className="bg-white p-4 rounded-lg shadow-sm border mb-4">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-gray-700 font-medium">فلترة:</span>
              <button className="px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
                هذا الشهر
              </button>
              <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                آخر 3 أشهر
              </button>
              <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                هذا العام
              </button>
              <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                الكل
              </button>
            </div>
          </div>
        </div>

        {/* نظام التبويب المحسن */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap -mb-px overflow-x-auto">
              <button
                onClick={() => setActiveTab("all")}
                className={`flex-shrink-0 mr-6 py-4 px-1 font-medium text-sm border-b-2 transition-colors duration-200 ${activeTab === "all" 
                  ? "border-blue-600 text-blue-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                  كل المتابعات
                  <span className={`ml-2 text-xs font-semibold px-2 py-1 rounded-full ${activeTab === "all" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>
                    {stats.total}
                  </span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab("owner")}
                className={`flex-shrink-0 mr-6 py-4 px-1 font-medium text-sm border-b-2 transition-colors duration-200 ${activeTab === "owner" 
                  ? "border-green-600 text-green-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  إدخال/ردود صاحب الفكرة
                  <span className={`ml-2 text-xs font-semibold px-2 py-1 rounded-full ${activeTab === "owner" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                    {stats.pending + stats.needsResponse}
                  </span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab("committee")}
                className={`flex-shrink-0 mr-6 py-4 px-1 font-medium text-sm border-b-2 transition-colors duration-200 ${activeTab === "committee" 
                  ? "border-purple-600 text-purple-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                  قرارات اللجنة
                  <span className={`ml-2 text-xs font-semibold px-2 py-1 rounded-full ${activeTab === "committee" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"}`}>
                    {followups.filter(f => f.followup.committee_decision && f.followup.committee_decision !== "").length}
                  </span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab("completed")}
                className={`flex-shrink-0 mr-6 py-4 px-1 font-medium text-sm border-b-2 transition-colors duration-200 ${activeTab === "completed" 
                  ? "border-teal-600 text-teal-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  المكتملة
                  <span className={`ml-2 text-xs font-semibold px-2 py-1 rounded-full ${activeTab === "completed" ? "bg-teal-100 text-teal-800" : "bg-gray-100 text-gray-800"}`}>
                    {stats.completed}
                  </span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab("graduate")}
                className={`flex-shrink-0 py-4 px-1 font-medium text-sm border-b-2 transition-colors duration-200 ${activeTab === "graduate" 
                  ? "border-indigo-600 text-indigo-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                  المشاريع المتخرجة
                  <span className={`ml-2 text-xs font-semibold px-2 py-1 rounded-full ${activeTab === "graduate" ? "bg-indigo-100 text-indigo-800" : "bg-gray-100 text-gray-800"}`}>
                    {stats.graduated}
                  </span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* عرض المتابعات المصفاة */}
        <div className="space-y-6">
          {filteredFollowups.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="mb-4">
                <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">لا توجد بيانات في هذا التبويب</h3>
              <p className="text-gray-500">لا توجد متابعات تطابق معايير التبويب الحالي.</p>
            </div>
          ) : (
            filteredFollowups.map((item, index) => {
              const f = item.followup;
              
              // تحديد ألوان بناءً على حالة المتابعة
              let cardColorClass = "bg-white";
              let statusColor = "bg-gray-100 text-gray-800";
              let statusText = f.status;
              
              if (f.status === "pending") {
                cardColorClass = "bg-white border-l-4 border-yellow-500";
                statusColor = "bg-yellow-100 text-yellow-800";
                statusText = "قيد الانتظار";
              } else if (f.status === "done") {
                cardColorClass = "bg-white border-l-4 border-green-500";
                statusColor = "bg-green-100 text-green-800";
                statusText = "مكتمل";
              } else if (f.status === "pending_review") {
                cardColorClass = "bg-white border-l-4 border-blue-500";
                statusColor = "bg-blue-100 text-blue-800";
                statusText = "بانتظار مراجعة اللجنة";
              }
              
              // تحديد لون قرار اللجنة
              let decisionColor = "bg-gray-100 text-gray-800";
              let decisionText = f.committee_decision;
              
              if (f.committee_decision === "graduate") {
                decisionColor = "bg-green-100 text-green-800";
                decisionText = "تخرج";
              } else if (f.committee_decision === "continue") {
                decisionColor = "bg-blue-100 text-blue-800";
                decisionText = "استمرار";
              } else if (f.committee_decision === "extra_support") {
                decisionColor = "bg-yellow-100 text-yellow-800";
                decisionText = "دعم إضافي";
              } else if (f.committee_decision === "pivot_required") {
                decisionColor = "bg-orange-100 text-orange-800";
                decisionText = "تغيير مسار مطلوب";
              } else if (f.committee_decision === "terminate") {
                decisionColor = "bg-red-100 text-red-800";
                decisionText = "إنهاء";
              }

              // التحقق إذا كانت المتابعة تتطلب إدخال بيانات
              const requiresOwnerInput = f.status === "pending" && 
                (!f.active_users || !f.revenue || !f.growth_rate);
              
              // التحقق إذا كانت المتابعة تحتاج رد على قرار اللجنة
              const requiresOwnerResponse = f.committee_decision && 
                !f.owner_acknowledged && f.status === "done";

              return (
                <div key={f.id} className={`rounded-xl shadow-sm overflow-hidden ${cardColorClass}`}>
                  <div className="p-6">
                    {/* رأس البطاقة */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{item.idea.title}</h3>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
                                {statusText}
                              </span>
                              <span className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                                {f.phase}
                              </span>
                              <span className="text-sm text-gray-500">
                                {new Date(f.scheduled_date).toLocaleDateString('ar-SA')}
                              </span>
                            </div>
                          </div>
                          
                          {f.committee_decision && (
                            <div className="mt-2 md:mt-0">
                              <span className={`px-4 py-2 text-sm font-semibold rounded-full ${decisionColor}`}>
                                قرار اللجنة: {decisionText}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* تحذيرات مهمة */}
                        <div className="mt-4">
                          {requiresOwnerInput && (
                            <div className="flex items-center text-yellow-700 bg-yellow-50 p-3 rounded-lg">
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.928-.833-2.698 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                              </svg>
                              <span className="text-sm font-medium">يجب عليك تعبئة بيانات المتابعة قبل الموعد المحدد</span>
                            </div>
                          )}
                          
                          {requiresOwnerResponse && (
                            <div className="flex items-center text-purple-700 bg-purple-50 p-3 rounded-lg mt-2">
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                              </svg>
                              <span className="text-sm font-medium">يجب الرد على قرار اللجنة وتأكيد الاطلاع</span>
                            </div>
                          )}
                          
                          {f.profit_distributed && (
                            <div className="flex items-center text-green-700 bg-green-50 p-3 rounded-lg mt-2">
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              <span className="text-sm font-medium">تم توزيع الأرباح للمشاركين في المشروع</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* تفاصيل المتابعة */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                      {/* المؤشرات الرئيسية */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                          </svg>
                          المؤشرات الرئيسية
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">المستخدمون النشطون</span>
                            <span className={`font-semibold ${!f.active_users ? 'text-gray-400' : 'text-gray-900'}`}>
                              {f.active_users ?? "لم يتم الإدخال"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">الإيرادات ($)</span>
                            <span className={`font-semibold ${!f.revenue ? 'text-gray-400' : 'text-gray-900'}`}>
                              {f.revenue ? `$${f.revenue}` : "لم يتم الإدخال"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">معدل النمو (%)</span>
                            <span className={`font-semibold ${!f.growth_rate ? 'text-gray-400' : 'text-gray-900'}`}>
                              {f.growth_rate ? `${f.growth_rate}%` : "لم يتم الإدخال"}
                            </span>
                          </div>
                          {f.evaluation_score !== null && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">درجة التقييم</span>
                              <span className="font-semibold text-blue-600">{f.evaluation_score}/100</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* حالة الأداء والمخاطر */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.928-.833-2.698 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                          </svg>
                          الأداء والمخاطر
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">حالة الأداء</span>
                            <span className="font-medium capitalize">{f.performance_status?.replace('_', ' ') ?? "-"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">مستوى المخاطر</span>
                            <span className="font-medium capitalize">{f.risk_level ?? "-"}</span>
                          </div>
                          <div>
                            <span className="text-gray-600 block mb-1">وصف المخاطر</span>
                            <p className="text-sm text-gray-700 bg-white p-2 rounded border border-gray-200 min-h-[60px]">
                              {f.risk_description || "لا يوجد وصف للمخاطر"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* معلومات إضافية */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          معلومات إضافية
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">دعم التسويق</span>
                            <span className={`font-medium ${f.marketing_support_given ? "text-green-600" : "text-gray-600"}`}>
                              {f.marketing_support_given ? "مقدّم" : "غير مقدّم"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">مشاكل في المنتج</span>
                            <span className={`font-medium ${f.product_issue_detected ? "text-red-600" : "text-green-600"}`}>
                              {f.product_issue_detected ? "مكتشف" : "غير مكتشف"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">استقرار المشروع</span>
                            <span className={`font-medium ${f.is_stable ? "text-green-600" : "text-yellow-600"}`}>
                              {f.is_stable ? "مستقر" : "غير مستقر"}
                            </span>
                          </div>
                          {f.committee_decision === "graduate" && f.graduation_date && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">تاريخ التخرج</span>
                              <span className="font-medium">{new Date(f.graduation_date).toLocaleDateString('ar-SA')}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-600">راجع بواسطة</span>
                            <span className="font-medium">{f.reviewed_by?.name ?? "-"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* تقييم اللجنة (إذا كان موجودًا) */}
                    {f.committee_decision && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="bg-purple-50 rounded-xl p-5">
                          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                            </svg>
                            تقييم اللجنة
                          </h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">نقاط القوة</label>
                              <div className="bg-white p-3 rounded border border-gray-200 min-h-[80px]">
                                {f.strengths || "لم يتم تحديد نقاط القوة"}
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">نقاط الضعف</label>
                              <div className="bg-white p-3 rounded border border-gray-200 min-h-[80px]">
                                {f.weaknesses || "لم يتم تحديد نقاط الضعف"}
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">التوصيات</label>
                              <div className="bg-white p-3 rounded border border-gray-200 min-h-[80px]">
                                {f.recommendations || "لا توجد توصيات"}
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">الإجراءات المتخذة</label>
                              <div className="bg-white p-3 rounded border border-gray-200 min-h-[80px]">
                                {f.actions_taken || "لم يتم اتخاذ إجراءات"}
                              </div>
                            </div>
                            
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">ملاحظات اللجنة</label>
                              <div className="bg-white p-3 rounded border border-gray-200 min-h-[80px]">
                                {f.committee_notes || "لا توجد ملاحظات إضافية"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* رد صاحب الفكرة (إذا كان موجودًا) */}
                    {f.owner_response && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="bg-green-50 rounded-xl p-5">
                          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                            </svg>
                            رد صاحب الفكرة
                          </h4>
                          
                          <div className="bg-white p-4 rounded border border-green-200">
                            <p className="text-gray-700 whitespace-pre-line">{f.owner_response}</p>
                            <div className="mt-3 text-sm text-gray-500">
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                تم تأكيد الاطلاع على ملاحظات اللجنة
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* فورم تعديل صاحب الفكرة للمتابعات pending */}
                    {f.status === "pending" && (
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="bg-blue-50 rounded-xl p-5">
                          <div className="flex items-center mb-4">
                            <div className="bg-blue-100 p-2 rounded-lg mr-3">
                              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                              </svg>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900">تحديث بيانات المتابعة</h4>
                          </div>
                          
                          <p className="text-gray-600 mb-5">
                            يرجى تعبئة جميع الحقول التالية قبل {new Date(f.scheduled_date).toLocaleDateString('ar-SA')}
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                عدد المستخدمين النشطين *
                              </label>
                              <input
                                type="number"
                                min="0"
                                required
                                value={f.active_users || ""}
                                onChange={(e) => handleInputChange(index, "active_users", e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="أدخل عدد المستخدمين"
                              />
                              <p className="text-xs text-gray-500 mt-1">إجمالي المستخدمين النشطين</p>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                الإيرادات ($) *
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                required
                                value={f.revenue || ""}
                                onChange={(e) => handleInputChange(index, "revenue", e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="أدخل قيمة الإيرادات"
                              />
                              <p className="text-xs text-gray-500 mt-1">الإيرادات الإجمالية بالدولار</p>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                معدل النمو (%) *
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                required
                                value={f.growth_rate || ""}
                                onChange={(e) => handleInputChange(index, "growth_rate", e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="أدخل معدل النمو"
                              />
                              <p className="text-xs text-gray-500 mt-1">نسبة مئوية بين -100 و 100</p>
                            </div>
                          </div>
                          
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleUpdate(f.id, index)}
                              disabled={updating || (!f.active_users || !f.revenue || !f.growth_rate)}
                              className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg flex items-center transition duration-200 ${
                                (!f.active_users || !f.revenue || !f.growth_rate) ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              {updating ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  جاري التحديث...
                                </>
                              ) : (
                                <>
                                  <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                  </svg>
                                  إرسال البيانات للجنة
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* فورم الرد على قرار اللجنة */}
                    {requiresOwnerResponse && (
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="bg-purple-50 rounded-xl p-5">
                          <div className="flex items-center mb-4">
                            <div className="bg-purple-100 p-2 rounded-lg mr-3">
                              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                              </svg>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900">الرد على قرار اللجنة</h4>
                          </div>
                          
                          <p className="text-gray-600 mb-5">
                            يرجى كتابة ردك على قرار اللجنة وتأكيد الاطلاع على ملاحظاتهم
                          </p>
                          
                          <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              ردك على قرار اللجنة *
                            </label>
                            <textarea
                              value={ownerResponse}
                              onChange={(e) => setOwnerResponse(e.target.value)}
                              rows="4"
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                              placeholder="اكتب ردك على ملاحظات اللجنة هنا..."
                            />
                            <p className="text-xs text-gray-500 mt-1">يمكنك كتابة رد يصل إلى 2000 حرف</p>
                          </div>
                          
                          <div className="flex items-center mb-6">
                            <input
                              type="checkbox"
                              id="acknowledge"
                              checked={true}
                              readOnly
                              className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <label htmlFor="acknowledge" className="mr-2 block text-sm text-gray-700">
                              أوكد الاطلاع على ملاحظات اللجنة وفهم قرارهم
                            </label>
                          </div>
                          
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleAcknowledge(f.id, index)}
                              disabled={acknowledging || !ownerResponse.trim()}
                              className={`bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg flex items-center transition duration-200 ${
                                !ownerResponse.trim() ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              {acknowledging ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  جاري الإرسال...
                                </>
                              ) : (
                                <>
                                  <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                  </svg>
                                  إرسال الرد للجنة
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default PostLaunchFollowups;