// src/components/Funding/FundingRequestModal.jsx
import React, { useState, useEffect } from 'react';
import { 
  X, DollarSign, AlertCircle, CheckCircle, 
  Calendar, FileText, Clock, Users, Target,
  Info, Loader2
} from 'lucide-react';
import fundingService from '../../services/fundingService';
import ganttService from '../../services/ganttService';
import taskService from '../../services/taskService';

const FundingRequestModal = ({ 
  isOpen, 
  onClose, 
  type, // 'phase' أو 'task'
  itemId, // ganttId أو taskId
  itemName,
  ideaId,
  onSuccess 
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [eligibility, setEligibility] = useState({ can_request: true, reasons: [] });
  const [activeFunding, setActiveFunding] = useState(null);
  const [itemDetails, setItemDetails] = useState(null);
  
  const [formData, setFormData] = useState({
    requested_amount: '',
    justification: '',
  });

  // تحميل البيانات الأولية
  useEffect(() => {
    if (isOpen) {
      loadInitialData();
    } else {
      // إعادة تعيين الحالات عند الإغلاق
      resetForm();
    }
  }, [isOpen, type, itemId]);

  const loadInitialData = async () => {
    setLoadingData(true);
    try {
      // 1. تحميل تفاصيل العنصر (مرحلة أو مهمة)
      if (type === 'phase') {
        const details = await ganttService.getPhaseById(itemId);
        setItemDetails(details);
      } else {
        const details = await taskService.getTaskById(itemId);
        setItemDetails(details);
      }

      // 2. التحقق من طلبات التمويل النشطة
      await checkActiveFunding();
      
      // 3. التحقق من الأهلية
      await checkEligibility();

    } catch (err) {
      console.error('Error loading initial data:', err);
      setError('فشل في تحميل البيانات الأولية');
    } finally {
      setLoadingData(false);
    }
  };

  const checkEligibility = async () => {
    const reasons = [];
    
    try {
      // التحقق من المراحل السيئة (نحتاج endpoint جديد)
      // مؤقتاً سنستخدم طريقة بديلة
      const phases = await ganttService.getPhases(ideaId);
      const badPhases = phases.filter(phase => phase.failure_count > 0);
      
      if (badPhases.length >= 3) {
        reasons.push('يوجد 3 مراحل أو أكثر ذات أداء ضعيف. يجب معالجة هذه المراحل أولاً.');
      }

      // التحقق من وجود طلب تمويل نشط (تم في checkActiveFunding)
      if (activeFunding) {
        reasons.push('لديك طلب تمويل قيد المراجعة حالياً');
      }

      // التحقق من أن المخطط الزمني معتمد
      // (يمكن إضافة هذا التحقق إذا كان متاحاً)

      setEligibility({
        can_request: reasons.length === 0,
        reasons
      });

    } catch (err) {
      console.error('Error checking eligibility:', err);
    }
  };

  const checkActiveFunding = async () => {
    try {
      // محاولة الحصول على طلبات التمويل النشطة
      // مؤقتاً نستخدم الخدمة الحالية
      const fundings = await fundingService.getFundingForIdea(ideaId);
      const active = fundings.fundings?.find(f => 
        f.status === 'requested' || f.status === 'under_review'
      );
      
      if (active) {
        setActiveFunding(active);
      } else {
        setActiveFunding(null);
      }
    } catch (err) {
      console.error('Error checking active funding:', err);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, requested_amount: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // التحقق من القيود
    if (activeFunding) {
      setError('لديك طلب تمويل قيد المراجعة بالفعل');
      return;
    }

    if (!eligibility.can_request) {
      setError(eligibility.reasons[0] || 'غير مؤهل لطلب التمويل');
      return;
    }

    // التحقق من البيانات المدخلة
    const amount = parseFloat(formData.requested_amount);
    if (!amount || amount <= 0) {
      setError('الرجاء إدخال مبلغ صحيح');
      return;
    }

    if (!formData.justification.trim()) {
      setError('الرجاء تقديم مبررات للتمويل');
      return;
    }

    if (formData.justification.length < 10) {
      setError('الرجاء كتابة مبررات مفصلة للتمويل');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const fundingData = {
        requested_amount: amount,
        justification: formData.justification.trim()
      };

      let response;
      
      if (type === 'phase') {
        response = await fundingService.requestFundingGantt(itemId, fundingData);
      } else {
        response = await fundingService.requestFundingTask(itemId, fundingData);
      }

      setSuccess('تم تقديم طلب التمويل بنجاح! سيتم مراجعته من قبل اللجنة.');
      
      // إعادة تعيين النموذج
      resetForm();
      
      // إغلاق بعد 2 ثواني أو استدعاء onSuccess
      setTimeout(() => {
        if (onSuccess) onSuccess(response);
        onClose();
      }, 2000);

    } catch (err) {
      console.error('Funding request error:', err);
      
      // عرض رسالة الخطأ المناسبة
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('حدث خطأ أثناء تقديم طلب التمويل. الرجاء المحاولة مرة أخرى.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      requested_amount: '',
      justification: '',
    });
    setError('');
    setSuccess('');
    setActiveFunding(null);
    setEligibility({ can_request: true, reasons: [] });
  };

  if (!isOpen) return null;

  // رسالة أثناء التحميل
  if (loadingData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <p className="text-gray-700 font-medium">جاري تحميل البيانات...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  طلب تمويل جديد
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {type === 'phase' ? 'المرحلة:' : 'المهمة:'} {itemName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              disabled={loading}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* رسائل التنبيه */}
          {activeFunding && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-yellow-800">طلب تمويل قيد المراجعة</h4>
                  <p className="text-sm text-yellow-700 mt-1 mb-2">
                    لديك طلب تمويل قيد المراجعة حالياً. يجب الانتظار حتى يتم الرد على الطلب الحالي قبل تقديم طلب جديد.
                  </p>
                  <div className="bg-white p-3 rounded-lg border border-yellow-300">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">المبلغ:</span>
                        <span className="font-bold text-blue-600 mr-2">
                          {activeFunding.requested_amount?.toLocaleString()} SYP
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">الحالة:</span>
                        <span className={`font-bold px-2 py-1 rounded text-xs ${
                          activeFunding.status === 'requested' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {activeFunding.status === 'requested' ? 'مطلوب' : 'قيد المراجعة'}
                        </span>
                      </div>
                      {activeFunding.created_at && (
                        <div className="col-span-2">
                          <span className="font-medium text-gray-600">تاريخ الطلب:</span>
                          <span className="text-gray-700 mr-2">
                            {new Date(activeFunding.created_at).toLocaleDateString('ar-SA')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!eligibility.can_request && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-800">غير مؤهل لطلب التمويل</h4>
                  {eligibility.reasons.map((reason, index) => (
                    <p key={index} className="text-sm text-red-700 mt-1">
                      • {reason}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-800">خطأ</h4>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-3 text-green-700">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">تم بنجاح</h4>
                  <p className="text-sm mt-1">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* معلومات الاجتماع */}
          {eligibility.can_request && !activeFunding && (
            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" />
                معلومات مهمة
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-blue-600 mt-0.5" />
                  <span className="text-sm text-gray-700">
                    <span className="font-medium">سيتم عقد اجتماع:</span> خلال يومين من تقديم الطلب
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-blue-600 mt-0.5" />
                  <span className="text-sm text-gray-700">
                    <span className="font-medium">مع:</span> جميع أعضاء اللجنة
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-blue-600 mt-0.5" />
                  <span className="text-sm text-gray-700">
                    <span className="font-medium">الهدف:</span> مناقشة طلب التمويل
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-blue-600 mt-0.5" />
                  <span className="text-sm text-gray-700">
                    <span className="font-medium">الإشعارات:</span> سيتم إرسالها لجميع الأعضاء
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* نموذج طلب التمويل */}
          {eligibility.can_request && !activeFunding && !success && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* المبلغ المطلوب */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  المبلغ المطلوب (ليرة سورية) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.requested_amount}
                    onChange={handleAmountChange}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أدخل المبلغ المطلوب بالليرة السورية"
                    disabled={loading}
                    min="1"
                    step="1000"
                    required
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <span className="font-medium text-gray-700">ل.س</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  المبلغ يجب أن يكون بالليرة السورية
                </p>
              </div>

              {/* مبررات التمويل */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  مبررات التمويل <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    value={formData.justification}
                    onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="اشرح بالتفصيل:
• سبب حاجتك لهذا التمويل
• كيف سيتم استخدام المبلغ
• التأثير المتوقع على تقدم المشروع
• أي معلومات أخرى تدعم طلبك"
                    disabled={loading}
                    maxLength="1000"
                    required
                  />
                  <div className="absolute top-3 right-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-500">
                    اكتب تبريراً مفصلاً (10 أحرف على الأقل)
                  </p>
                  <p className={`text-xs ${
                    formData.justification.length < 10 ? 'text-red-500' : 
                    formData.justification.length > 800 ? 'text-yellow-500' : 
                    'text-gray-500'
                  }`}>
                    {formData.justification.length}/1000 حرف
                  </p>
                </div>
              </div>

              {/* الشروط */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">ملاحظات هامة</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>سيتم إنشاء اجتماع تلقائياً لمناقشة الطلب مع اللجنة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>لا يمكن طلب تمويل جديد إذا كان هناك طلب قيد المراجعة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>يجب ألا تزيد المراحل المتأخرة عن مرتين</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>سيتم إرسال إشعارات فورية لأعضاء اللجنة</span>
                  </li>
                </ul>
              </div>

              {/* أزرار الإجراء */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={loading || formData.justification.length < 10}
                  className={`flex-1 px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                    loading || formData.justification.length < 10
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>جاري الإرسال...</span>
                    </>
                  ) : (
                    <>
                      <DollarSign className="w-5 h-5" />
                      <span>تقديم طلب التمويل</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* زر الإغلاق في حالة وجود طلب نشط أو غير مؤهل */}
          {(activeFunding || !eligibility.can_request || success) && (
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                إغلاق
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FundingRequestModal;