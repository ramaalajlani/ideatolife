// src/pages/PenaltyStatusPage.jsx (التحديثات)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    AlertTriangle, ArrowLeft, CreditCard, Calendar, 
    XCircle, CheckCircle, AlertCircle, DollarSign,
    BarChart3, List, Clock, Shield, Home, TrendingDown,
    Wallet, RefreshCw
} from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import PaymentModal from '../components/Penalty/PaymentModal';
import penaltyService from '../services/penaltyService';

const PenaltyStatusPage = () => {
    const { ideaId } = useParams();
    const navigate = useNavigate();
    
    const [penaltyData, setPenaltyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [walletInfo, setWalletInfo] = useState(null);
    const [loadingWallet, setLoadingWallet] = useState(false);

    useEffect(() => {
        if (ideaId) {
            fetchPenaltyStatus();
            fetchWalletBalance();
        }
    }, [ideaId]);

    const fetchPenaltyStatus = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const data = await penaltyService.getPenaltyStatus(ideaId);
            setPenaltyData(data);
            
        } catch (err) {
            console.error('Error fetching penalty status:', err);
            setError(err.message || 'فشل في تحميل حالة الغرامة');
        } finally {
            setLoading(false);
        }
    };

    const fetchWalletBalance = async () => {
        try {
            setLoadingWallet(true);
            // هنا يمكنك إضافة API لجلب رصيد المحفظة
            // محاكاة للرصيد
            await new Promise(resolve => setTimeout(resolve, 500));
            setWalletInfo({
                balance: 25000,
                currency: 'ر.س'
            });
        } catch (err) {
            console.error('Error fetching wallet:', err);
        } finally {
            setLoadingWallet(false);
        }
    };

    const handlePayPenalty = async () => {
        setShowPaymentModal(true);
    };

    const handlePaymentSuccess = async (transactionDetails) => {
        // تحديث البيانات بعد الدفع الناجح
        await fetchPenaltyStatus();
        await fetchWalletBalance();
        
        // عرض رسالة نجاح
        alert('تم دفع الغرامة بنجاح! المشروع مستأنف الآن.');
        
        // إعادة التوجيه بعد النجاح
        setTimeout(() => {
            navigate(`/gantt/${ideaId}`);
        }, 2000);
    };

    const handlePaymentError = (error) => {
        console.error('Payment failed:', error);
        alert(`فشل في الدفع: ${error.message}`);
    };

    const handleViewGanttChart = () => {
        navigate(`/gantt/${ideaId}`);
    };

    const goToHome = () => {
        navigate('/dashboard');
    };

    // باقي الكود كما هو...

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* ... الهيدر والواجهة كما هي ... */}
            
            {/* في مكان زر الدفع، استبدل الكود القديم بهذا */}
            <button
                onClick={handlePayPenalty}
                disabled={processingPayment}
                className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl transition-all ${
                    processingPayment 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg hover:shadow-xl'
                }`}
            >
                {processingPayment ? (
                    <>
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span className="font-bold">جاري المعالجة...</span>
                    </>
                ) : (
                    <>
                        <CreditCard className="w-6 h-6" />
                        <div className="text-right">
                            <div className="font-bold text-lg">دفع الغرامة</div>
                            <div className="text-sm opacity-90">
                                {penaltyData?.penalty_amount?.toLocaleString()} ر.س
                            </div>
                        </div>
                    </>
                )}
            </button>

            {/* أضف معلومات المحفظة */}
            {walletInfo && (
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Wallet className="w-6 h-6 text-blue-600" />
                            <div>
                                <div className="font-bold text-blue-800">رصيد المحفظة</div>
                                <div className="text-2xl font-bold text-blue-700">
                                    {walletInfo.balance?.toLocaleString()} {walletInfo.currency}
                                </div>
                            </div>
                        </div>
                        {penaltyData?.penalty_amount && (
                            <div className="text-right">
                                <div className="text-sm text-gray-600">المبلغ المطلوب</div>
                                <div className={`text-xl font-bold ${
                                    walletInfo.balance >= penaltyData.penalty_amount 
                                        ? 'text-green-600' 
                                        : 'text-red-600'
                                }`}>
                                    {penaltyData.penalty_amount?.toLocaleString()} ر.س
                                </div>
                                {walletInfo.balance < penaltyData.penalty_amount && (
                                    <div className="text-xs text-red-600 mt-1">
                                        الرصيد غير كافٍ
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* مودال الدفع */}
            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                ideaId={ideaId}
                penaltyAmount={penaltyData?.penalty_amount}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
            />
        </div>
    );
};

export default PenaltyStatusPage;