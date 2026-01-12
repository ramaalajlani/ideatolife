// src/components/ProfitDistribution/ProfitDistribution.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  DollarSign, 
  Users, 
  Percent, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  ChevronRight,
  Lightbulb,
  ArrowLeft,
  RefreshCw
} from "lucide-react";

const ProfitDistribution = ({ ideas, onClose, onRefresh }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState("ideas"); // 'ideas' أو 'distribution'
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [distributionData, setDistributionData] = useState(null);
  const [loadingDistribution, setLoadingDistribution] = useState(false);

  // تحميل الأفكار عند التحميل الأولي
  useEffect(() => {
    if (ideas.length === 0) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [ideas]);

  // اختيار فكرة وعرض توزيع الأرباح
  const handleSelectIdea = async (idea) => {
    setSelectedIdea(idea);
    setLoadingDistribution(true);
    setError("");
    
    try {
      const token = localStorage.getItem("committee_token");
      const response = await axios.get(
        `http://127.0.0.1:8000/api/ideas/${idea.id}/profit-distribution-summary/comittee`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setDistributionData(response.data);
      setView("distribution");
    } catch (err) {
      setError("فشل في تحميل بيانات توزيع الأرباح");
      console.error(err);
    } finally {
      setLoadingDistribution(false);
    }
  };

  // العودة إلى قائمة الأفكار
  const handleBackToIdeas = () => {
    setView("ideas");
    setSelectedIdea(null);
    setDistributionData(null);
    setError("");
  };

  // إعادة تحميل البيانات
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
    if (selectedIdea && view === "distribution") {
      handleSelectIdea(selectedIdea);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-slate-600">جاري تحميل البيانات...</p>
      </div>
    );
  }

  // عرض قائمة الأفكار
  if (view === "ideas") {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-xl mr-4">
              <Lightbulb className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">توزيع الأرباح</h2>
              <p className="text-slate-600">اختر فكرة لعرض توزيع أرباحها</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition flex items-center"
            >
              <RefreshCw size={18} className="ml-1" />
              تحديث
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            >
              رجوع للرئيسية
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center text-red-700">
              <AlertCircle className="mr-2" />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* قائمة الأفكار */}
        {ideas.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="text-slate-400" size={28} />
            </div>
            <h3 className="text-lg font-semibold text-slate-600">لا توجد أفكار متاحة</h3>
            <p className="text-slate-500 mt-2">لا توجد أفكار معينة لك لعرض توزيع أرباحها</p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">الأفكار المعينة لك ({ideas.length})</h3>
              <p className="text-sm text-slate-500">انقر على أي فكرة لعرض توزيع أرباحها</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ideas.map((idea, index) => (
                <div
                  key={idea.id}
                  onClick={() => handleSelectIdea(idea)}
                  className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg hover:border-orange-300 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-gradient-to-r from-orange-100 to-amber-100 p-2 rounded-lg mr-3">
                        <span className="text-orange-700 font-bold text-lg">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 group-hover:text-orange-600 transition">
                          {idea.title}
                        </h4>
                        <p className="text-sm text-slate-500 mt-1">
                          ID: {idea.id}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="text-slate-400 group-hover:text-orange-500 transition" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <span className="text-slate-600 w-24">الحالة:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        idea.status === 'approved' ? 'bg-green-100 text-green-800' :
                        idea.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {idea.status}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-slate-600 w-24">النوع:</span>
                      <span className="font-medium">{idea.type || 'غير محدد'}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-slate-600 w-24">تاريخ الإضافة:</span>
                      <span className="font-medium">
                        {new Date(idea.created_at).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">عرض توزيع الأرباح</span>
                      <div className="flex items-center text-orange-600">
                        <DollarSign size={16} className="ml-1" />
                        <span className="text-sm font-medium">توزيع الأرباح</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // عرض توزيع الأرباح للفكرة المحددة
  if (view === "distribution" && selectedIdea && distributionData) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <button
              onClick={handleBackToIdeas}
              className="p-2 hover:bg-slate-100 rounded-lg transition mr-4"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-xl mr-4">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">توزيع الأرباح</h2>
                <p className="text-slate-600">
                  فكرة: <span className="font-semibold text-orange-600">{distributionData.idea_title}</span>
                  <span className="mr-3 text-sm">(ID: {distributionData.idea_id})</span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition flex items-center"
            >
              <RefreshCw size={18} className="ml-1" />
              تحديث البيانات
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            >
              رجوع للرئيسية
            </button>
          </div>
        </div>

        {/* Status Banner */}
        <div className={`mb-8 p-5 rounded-xl ${
          distributionData.profit_distributed 
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' 
            : 'bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {distributionData.profit_distributed ? (
                <>
                  <CheckCircle className="text-green-600 mr-3" size={24} />
                  <div>
                    <h3 className="text-green-800 font-bold text-lg">تم توزيع الأرباح</h3>
                    <p className="text-green-700 mt-1">
                      تم توزيع الأرباح بنجاح على جميع الأطراف المعنية
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="text-yellow-600 mr-3" size={24} />
                  <div>
                    <h3 className="text-yellow-800 font-bold text-lg">لم يتم توزيع الأرباح بعد</h3>
                    <p className="text-yellow-700 mt-1">
                      {distributionData.message || 'في انتظار توزيع الأرباح من الإدارة'}
                    </p>
                  </div>
                </>
              )}
            </div>
            <div className="bg-white px-4 py-2 rounded-lg border">
              <span className="text-sm font-medium text-slate-700">
                {distributionData.profit_distributed ? 'مكتمل' : 'قيد الانتظار'}
              </span>
            </div>
          </div>
        </div>

        {/* Your Distribution (if available) */}
        {distributionData.your_percentage && (
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <h3 className="text-xl font-bold text-blue-800 mb-5 flex items-center">
              <FileText className="mr-3" size={24} />
              توزيعك الشخصي
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-xl shadow-sm border">
                <div className="flex items-center text-slate-600 mb-2">
                  <Percent className="mr-2 text-blue-500" size={20} />
                  <span className="text-sm font-medium">النسبة المئوية المخصصة لك</span>
                </div>
                <p className="text-3xl font-bold text-blue-700 mt-2">
                  {distributionData.your_percentage}
                </p>
                <div className="mt-4">
                  <div className="w-full bg-blue-100 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full" 
                      style={{ width: distributionData.your_percentage }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">نصيبك من إجمالي الأرباح</p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-sm border">
                <div className="flex items-center text-slate-600 mb-2">
                  <DollarSign className="mr-2 text-green-500" size={20} />
                  <span className="text-sm font-medium">المبلغ المالي المستحق لك</span>
                </div>
                <p className="text-3xl font-bold text-green-700 mt-2">
                  {parseFloat(distributionData.your_amount || 0).toLocaleString('ar-SA')} <span className="text-lg">ريال</span>
                </p>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-slate-500">قيمة مستحقة:</span>
                  <span className="mr-2 font-bold text-green-600">
                    {parseFloat(distributionData.your_amount || 0).toLocaleString('ar-SA')} ر.س
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Distributions Table */}
        {distributionData.distributions.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center">
                <Users className="mr-3 text-orange-500" size={24} />
                توزيع الأرباح للجميع ({distributionData.distributions.length})
              </h3>
              <span className="text-sm text-slate-500">
                آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
              </span>
            </div>
            
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 uppercase tracking-wider">
                      الاسم
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 uppercase tracking-wider">
                      الدور
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 uppercase tracking-wider">
                      النسبة
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-slate-700 uppercase tracking-wider">
                      المبلغ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {distributionData.distributions.map((dist, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-slate-100 rounded-full text-slate-700 font-bold">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center ml-3">
                            <span className="text-blue-700 font-bold text-lg">
                              {dist.user_name?.charAt(0) || '?'}
                            </span>
                          </div>
                          <div>
                            <div className="text-slate-800 font-semibold">{dist.user_name}</div>
                            <div className="text-sm text-slate-500">{dist.user_email || ''}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center ${
                          dist.role?.includes('committee') ? 'bg-purple-100 text-purple-800' :
                          dist.role?.includes('owner') ? 'bg-orange-100 text-orange-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {dist.role === 'committee_member' ? 'عضو لجنة' : 
                           dist.role === 'idea_owner' ? 'صاحب الفكرة' : 
                           dist.role || 'غير محدد'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Percent className="ml-2 text-blue-500" size={18} />
                          <span className="text-lg font-bold text-blue-700">
                            {dist.percentage}
                          </span>
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-blue-100 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: dist.percentage }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <DollarSign className="ml-2 text-green-500" size={18} />
                          <span className="text-lg font-bold text-green-700">
                            {parseFloat(dist.amount || 0).toLocaleString('ar-SA')} ر.س
                          </span>
                        </div>
                        <div className="text-sm text-slate-500 mt-1">
                          مبلغ بالريال السعودي
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Summary */}
            <div className="mt-8 p-5 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border">
              <h4 className="font-bold text-slate-800 mb-3">ملخص التوزيع</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">{distributionData.distributions.length}</div>
                  <div className="text-sm text-slate-600">عدد المستفيدين</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-green-700">
                    {distributionData.distributions
                      .reduce((sum, dist) => sum + parseFloat(dist.amount || 0), 0)
                      .toLocaleString('ar-SA')} ر.س
                  </div>
                  <div className="text-sm text-slate-600">إجمالي المبالغ الموزعة</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-purple-700">100%</div>
                  <div className="text-sm text-slate-600">إجمالي النسبة المئوية</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-xl">
            <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <DollarSign className="text-slate-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-slate-600 mb-3">لا توجد بيانات توزيع</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              لم يتم توزيع الأرباح بعد لهذه الفكرة. سيتم عرض تفاصيل توزيع الأرباح هنا بمجرد اكتمال العملية.
            </p>
            <button
              onClick={handleRefresh}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:opacity-90 transition flex items-center mx-auto"
            >
              <RefreshCw size={18} className="ml-2" />
              تحديث البيانات
            </button>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default ProfitDistribution;