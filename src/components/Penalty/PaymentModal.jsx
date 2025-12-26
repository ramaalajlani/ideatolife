// src/components/Penalty/PaymentModal.jsx
import React, { useState } from 'react';
import { 
    CreditCard, X, Wallet, CheckCircle, 
    AlertTriangle, RefreshCw, DollarSign,
    Shield, TrendingUp, UserCheck
} from 'lucide-react';

const PaymentModal = ({ 
    isOpen, 
    onClose, 
    ideaId, 
    penaltyAmount, 
    onPaymentSuccess,
    onPaymentError
}) => {
    const [processing, setProcessing] = useState(false);
    const [step, setStep] = useState(1); // 1: تأكيد، 2: معالجة، 3: نجاح
    const [error, setError] = useState(null);
    const [transactionDetails, setTransactionDetails] = useState(null);

    const handlePayment = async () => {
        if (!ideaId || !penaltyAmount) return;
        
        try {
            setProcessing(true);
            setError(null);
            setStep(2);

            // محاكاة عملية الدفع مع API
            // const response = await penaltyService.payPenaltyForPhase(ideaId);
            
            // محاكاة للاختبار
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // بيانات المحاكاة
            const mockResponse = {
                message: `تم دفع الغرامة (${penaltyAmount}) بنجاح وتم استئناف المشروع.`,
                transactionId: 'TX-' + Date.now(),
                amount: penaltyAmount,
                timestamp: new Date().toISOString()
            };
            
            setTransactionDetails(mockResponse);
            setStep(3);
            
            // إشعار النجاح
            if (onPaymentSuccess) {
                onPaymentSuccess(mockResponse);
            }
            
            // إغلاق تلقائي بعد النجاح
            setTimeout(() => {
                onClose();
            }, 3000);
            
        } catch (err) {
            console.error('Payment error:', err);
            setError(err.message || 'فشل في عملية الدفع');
            setStep(1);
            
            if (onPaymentError) {
                onPaymentError(err);
            }
        } finally {
            setProcessing(false);
        }
    };

    const handleRetry = () => {
        setError(null);
        setStep(1);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
                {/* الهيدر */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">دفع الغرامة</h2>
                                <p className="text-blue-100 text-sm">إعادة تفعيل المشروع</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            disabled={processing}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* المحتوى */}
                <div className="p-6">
                    {step === 1 && (
                        <div className="space-y-6">
                            {/* تفاصيل الغرامة */}
                            <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                    <h3 className="font-bold text-red-800">تفاصيل الغرامة</h3>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">مشروع ID:</span>
                                        <span className="font-mono font-bold">{ideaId}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">سبب الغرامة:</span>
                                        <span className="text-red-600 font-medium">تأخر 3 مراحل أو أكثر</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">حالة المشروع:</span>
                                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                                            متوقف للدفع
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* مبلغ الدفع */}
                            <div className="bg-white border-2 border-blue-200 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-5 h-5 text-blue-600" />
                                        <h3 className="font-bold text-gray-800">مبلغ الدفع</h3>
                                    </div>
                                    <div className="text-2xl font-bold text-blue-600">
                                        {penaltyAmount?.toLocaleString()} ر.س
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600">
                                    سيتم خصم المبلغ من محفظتك ونقله للمستثمر الممول
                                </div>
                            </div>

                            {/* معلومات المستلم */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <UserCheck className="w-5 h-5 text-gray-600" />
                                    <h3 className="font-bold text-gray-800">المستلم</h3>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium">المستثمر الممول</div>
                                        <div className="text-sm text-gray-600">الجهة المستلمة للغرامة</div>
                                    </div>
                                    <TrendingUp className="w-5 h-5 text-green-500" />
                                </div>
                            </div>

                            {/* تحذير مهم */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex items-start gap-2">
                                        <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="font-medium text-red-800 mb-1">خطأ في الدفع</div>
                                            <p className="text-red-700 text-sm">{error}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleRetry}
                                        className="mt-3 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        المحاولة مرة أخرى
                                    </button>
                                </div>
                            )}

                            {/* أزرار الإجراء */}
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handlePayment}
                                    disabled={processing}
                                    className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <CreditCard className="w-5 h-5" />
                                    <span className="font-bold text-lg">تأكيد الدفع</span>
                                </button>
                                
                                <button
                                    onClick={onClose}
                                    disabled={processing}
                                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    إلغاء
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="py-8 text-center">
                            <div className="relative inline-block mb-6">
                                <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                <Wallet className="w-8 h-8 text-blue-600 absolute inset-0 m-auto" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">جاري معالجة الدفع</h3>
                            <p className="text-gray-600 mb-2">يرجى الانتظار أثناء معالجة عملية الدفع</p>
                            <p className="text-sm text-gray-500">قد تستغرق العملية بضع ثوانٍ</p>
                            
                            <div className="mt-6 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">التحقق من الرصيد</span>
                                    <span className="text-green-600 font-medium">✓ مكتمل</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">تحويل المبلغ</span>
                                    <span className="text-blue-600 font-medium">جاري التنفيذ</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">تفعيل المشروع</span>
                                    <span className="text-gray-400">في الانتظار</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && transactionDetails && (
                        <div className="py-8 text-center">
                            <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-green-800 mb-3">تم الدفع بنجاح!</h3>
                            <p className="text-gray-700 mb-6">تمت عملية الدفع واستئناف المشروع</p>
                            
                            {/* تفاصيل المعاملة */}
                            <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 mb-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">رقم المعاملة:</span>
                                        <span className="font-mono font-bold text-green-700">
                                            {transactionDetails.transactionId}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">المبلغ:</span>
                                        <span className="text-xl font-bold text-green-700">
                                            {transactionDetails.amount?.toLocaleString()} ر.س
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">الوقت:</span>
                                        <span className="text-green-700">
                                            {new Date().toLocaleTimeString('ar-SA')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="text-green-600 font-medium animate-pulse">
                                جاري إغلاق النافذة...
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;