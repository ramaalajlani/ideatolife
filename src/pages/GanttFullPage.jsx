// src/pages/GanttFullPage.jsx
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import lottie from 'lottie-web';
import { 
    ChevronLeft, ChevronRight, Calendar, Plus, Edit,
    CheckCircle, Clock, BarChart3, Send, AlertTriangle,
    AlertCircle, Trash2, DollarSign, CreditCard, Wallet
} from 'lucide-react';

import ganttService from '../services/ganttService';
import taskService from '../services/taskService';
import penaltyService from '../services/penaltyService';
import fundingService from '../services/fundingService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import PhaseModal from '../components/GanttChart/PhaseModal';
import TaskModal from '../components/GanttChart/TaskModal';
import TaskEditModal from '../components/GanttChart/TaskEditModal';
import TimelineHeader from '../components/GanttChart/TimelineHeader';
import PhaseEvaluation from '../components/GanttChart/PhaseEvaluation';
import DraggableTaskBar from '../components/GanttChart/DraggableTaskBar';
import FundingModal from '../components/GanttChart/FundingModal';

import { 
    TASK_COLORS, DAY_IN_MILLIS, LIST_COLUMN_WIDTH,
    parseDateSafe, formatDateTime, generateDays, getTaskStyle,
    formatDateShort, getWorkingDayDifference
} from '../utils/ganttUtils';

const GanttAnimationURL = 'https://assets10.lottiefiles.com/packages/lf20_x17ybolp.json';

const GanttFullPage = () => {
    const { ideaId } = useParams();
    const navigate = useNavigate();
    
    const [phases, setPhases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState('month');
    const [selectedPhase, setSelectedPhase] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showPhaseModal, setShowPhaseModal] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showTaskEditModal, setShowTaskEditModal] = useState(false);
    const [showFundingModal, setShowFundingModal] = useState(false);
    
    const [draggingTask, setDraggingTask] = useState(null);
    const [resizingTask, setResizingTask] = useState(null);
    const [resizeType, setResizeType] = useState(null);
    
    const [submittingTimeline, setSubmittingTimeline] = useState(false);
    const [timelineError, setTimelineError] = useState(null);
    const [approvalStatus, setApprovalStatus] = useState(null);
    const [submittedAt, setSubmittedAt] = useState(null);
    
    const [phaseEvaluations, setPhaseEvaluations] = useState({});
    const [loadingEvaluations, setLoadingEvaluations] = useState({});
    const [showAllEvaluations, setShowAllEvaluations] = useState(false);
    
    // حالات التمويل - أصبحت لتخزين طلبات التمويل فقط (لا تحميل)
    const [fundingItem, setFundingItem] = useState(null);
    const [fundingItemType, setFundingItemType] = useState(null);
    const [fundingLoading, setFundingLoading] = useState(false);
    
    // تخزين طلبات التمويل التي تم تقديمها محلياً
    const [fundingRequests, setFundingRequests] = useState({});
    
    // حالات الغرامة
    const [penaltyData, setPenaltyData] = useState(null);
    const [walletData, setWalletData] = useState(null);
    const [payingPenalty, setPayingPenalty] = useState(false);
    
    const containerRef = useRef(null);
    
    const animationContainer1 = useRef(null);
    const animationContainer2 = useRef(null);
    const animationContainer3 = useRef(null);
    const animationInstance1 = useRef(null);
    const animationInstance2 = useRef(null);
    const animationInstance3 = useRef(null);
    
    const [animationLoaded, setAnimationLoaded] = useState(false);

    // تهيئة الأنميشنات
    useEffect(() => {
        let isMounted = true;
        
        const loadAnimations = async () => {
            try {
                const response = await fetch(GanttAnimationURL);
                if (!response.ok) throw new Error('Failed to load animation');
                const animationData = await response.json();
                
                if (!isMounted) return;
                
                if (animationContainer1.current) {
                    animationInstance1.current = lottie.loadAnimation({
                        container: animationContainer1.current,
                        renderer: 'svg',
                        loop: true,
                        autoplay: true,
                        animationData: animationData,
                        rendererSettings: { preserveAspectRatio: 'xMidYMid slice' }
                    });
                }
                
                if (animationContainer2.current) {
                    animationInstance2.current = lottie.loadAnimation({
                        container: animationContainer2.current,
                        renderer: 'svg',
                        loop: true,
                        autoplay: true,
                        animationData: animationData,
                        rendererSettings: { preserveAspectRatio: 'xMidYMid slice' }
                    });
                }
                
                if (animationContainer3.current) {
                    animationInstance3.current = lottie.loadAnimation({
                        container: animationContainer3.current,
                        renderer: 'svg',
                        loop: true,
                        autoplay: true,
                        animationData: animationData,
                        rendererSettings: { preserveAspectRatio: 'xMidYMid slice' }
                    });
                }
                
                setAnimationLoaded(true);
                
            } catch (err) {
                console.error('Error loading Gantt animations:', err);
                if (isMounted) setAnimationLoaded(false);
            }
        };

        loadAnimations();
        
        return () => {
            isMounted = false;
            if (animationInstance1.current) animationInstance1.current.destroy();
            if (animationInstance2.current) animationInstance2.current.destroy();
            if (animationInstance3.current) animationInstance3.current.destroy();
        };
    }, []);

    useEffect(() => {
        if (ideaId) {
            fetchPhases();
            fetchPenaltyStatus();
            fetchWallet();
        }
    }, [ideaId]);

    const fetchPhases = async () => {
        try {
            setLoading(true);
            const response = await ganttService.getPhases(ideaId);
            
            if (response?.data?.length) {
                const cleanedPhases = response.data.map(phase => ({
                    ...phase,
                    start_date: phase.start_date || new Date().toISOString().split('T')[0],
                    end_date: phase.end_date || new Date(Date.now() + 7 * DAY_IN_MILLIS).toISOString().split('T')[0],
                    tasks: (phase.tasks || []).map((task, index) => ({
                        ...task,
                        start_date: task.start_date || phase.start_date,
                        end_date: task.end_date || phase.end_date,
                        color: task.color || TASK_COLORS[index % TASK_COLORS.length],
                        progress_percentage: task.progress_percentage || 0,
                        attachments: task.attachments || []
                    }))
                }));
                setPhases(cleanedPhases);
                
                if (response.idea_status) {
                    setApprovalStatus(response.idea_status.committee_approval_status);
                    setSubmittedAt(response.idea_status.submitted_at);
                }
                
                fetchPhaseEvaluations(cleanedPhases);
            } else {
                setPhases([]);
            }
        } catch (err) {
            console.error('Error fetching phases:', err);
            setError(err.message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const fetchPenaltyStatus = async () => {
        if (!ideaId) return;
        
        try {
            const data = await penaltyService.getPenaltyStatus(ideaId);
            setPenaltyData(data);
        } catch (err) {
            console.error('Error fetching penalty status:', err);
        }
    };

    const fetchWallet = async () => {
        try {
            const data = await penaltyService.getWallet();
            setWalletData(data);
        } catch (err) {
            console.error('Error fetching wallet:', err);
        }
    };

    const fetchPhaseEvaluations = async (phasesList) => {
        const evaluations = {};
        const loadingStates = {};
        
        for (const phase of phasesList) {
            loadingStates[phase.id] = true;
            
            try {
                const evaluation = await ganttService.getPhaseEvaluation(ideaId, phase.id);
                if (evaluation) {
                    evaluations[phase.id] = evaluation;
                }
            } catch (err) {
                console.error(`Error fetching evaluation for phase ${phase.id}:`, err);
            } finally {
                loadingStates[phase.id] = false;
            }
        }
        
        setPhaseEvaluations(evaluations);
        setLoadingEvaluations(loadingStates);
    };

    const handlePayPenalty = async () => {
        if (!ideaId || !penaltyData?.penalty_amount) return;
        
        try {
            setPayingPenalty(true);
            
            await penaltyService.payPenalty(ideaId);
            
            alert('تم دفع الغرامة بنجاح!');
            
            await fetchPenaltyStatus();
            await fetchWallet();
            await fetchPhases();
            
        } catch (err) {
            console.error('Error paying penalty:', err);
            alert(err.message || 'Failed to pay penalty');
        } finally {
            setPayingPenalty(false);
        }
    };

    const handleFundingRequest = async (item, type) => {
        try {
            setFundingLoading(true);
            
            // تحقق من وجود طلب تمويل سابق محلياً
            const requestKey = `${type}_${item.id}`;
            const existingFunding = fundingRequests[requestKey];
            
            if (existingFunding && 
                (existingFunding.status === 'pending' || existingFunding.status === 'under_review')) {
                alert('يوجد طلب تمويل قيد المراجعة بالفعل');
                return;
            }
            
            // التحقق من وجود 3 مراحل سيئة أو أكثر
            const badPhasesCount = phases.filter(phase => 
                penaltyData?.bad_phases?.includes(phase.phase_name)
            ).length;
            
            if (badPhasesCount >= 3) {
                alert('لا يمكنك طلب تمويل لأن هناك 3 مراحل أو أكثر ذات أداء ضعيف');
                return;
            }
            
            setFundingItem(item);
            setFundingItemType(type);
            setShowFundingModal(true);
            
        } catch (err) {
            console.error('Error checking funding:', err);
            alert('فشل في التحقق من طلبات التمويل');
        } finally {
            setFundingLoading(false);
        }
    };

    const handleSubmitFunding = async (fundingData) => {
        if (!fundingItem || !fundingItemType) return;
        
        try {
            setFundingLoading(true);
            
            let response;
            if (fundingItemType === 'phase') {
                response = await fundingService.requestPhaseFunding(fundingItem.id, fundingData);
            } else {
                response = await fundingService.requestTaskFunding(fundingItem.id, fundingData);
            }
            
            alert('تم تقديم طلب التمويل بنجاح!');
            setShowFundingModal(false);
            setFundingItem(null);
            setFundingItemType(null);
            
            // تخزين طلب التمويل محلياً
            const requestKey = `${fundingItemType}_${fundingItem.id}`;
            setFundingRequests(prev => ({
                ...prev,
                [requestKey]: {
                    ...response.funding,
                    type: fundingItemType,
                    requested_amount: fundingData.requested_amount,
                    description: fundingData.description,
                    status: 'pending', // افتراضي
                    submitted_at: new Date().toISOString()
                }
            }));
            
            await fetchPhases();
            
        } catch (err) {
            console.error('Error submitting funding request:', err);
            alert(err.message || 'فشل في تقديم طلب التمويل');
        } finally {
            setFundingLoading(false);
        }
    };

    const handleSubmitTimeline = async () => {
        if (!ideaId) return;
        
        if (phases.length === 0) {
            setTimelineError('Add phases first');
            return;
        }
        
        const emptyPhases = phases.filter(phase => !phase.tasks || phase.tasks.length === 0);
        if (emptyPhases.length > 0) {
            setTimelineError(`There are ${emptyPhases.length} phases without tasks. Fill all tasks first.`);
            return;
        }
        
        if (approvalStatus === 'pending' || approvalStatus === 'approved') {
            setTimelineError('Timeline already submitted');
            return;
        }
        
        try {
            setSubmittingTimeline(true);
            setTimelineError(null);
            
            await ganttService.submitFullTimeline(ideaId);
            
            setApprovalStatus('pending');
            setSubmittedAt(new Date().toISOString());
            
            alert('Timeline submitted successfully');
            
            await fetchPhases();
            
        } catch (err) {
            console.error('Error submitting timeline:', err);
            setTimelineError(err.message || 'Failed to submit timeline');
        } finally {
            setSubmittingTimeline(false);
        }
    };

    const days = useMemo(() => generateDays(currentDate, viewMode), [currentDate, viewMode]);

    const handleMouseMove = useCallback((e) => {
        if (approvalStatus === 'approved') return;
        
        if (!containerRef.current || (!draggingTask && !resizingTask)) return;
        
        const containerRect = containerRef.current.getBoundingClientRect();
        const columnWidth = viewMode === 'month' ? 45 : viewMode === 'week' ? 85 : 180;
        const listColumnWidth = 320;
        
        const x = e.clientX - containerRect.left - listColumnWidth;
        const columnIndex = Math.floor(x / columnWidth);
        
        if (columnIndex >= 0 && columnIndex < days.length + 5) {
            if (draggingTask) {
                const newStartDate = new Date(days[0].date);
                newStartDate.setDate(newStartDate.getDate() + columnIndex);
                
                const oldStartDate = parseDateSafe(draggingTask.start_date);
                const oldEndDate = parseDateSafe(draggingTask.end_date);
                const duration = Math.floor((oldEndDate - oldStartDate) / DAY_IN_MILLIS) + 1;
                
                const newEndDate = new Date(newStartDate);
                newEndDate.setDate(newStartDate.getDate() + duration - 1);
                
                updateTaskDate(draggingTask, newStartDate, newEndDate);
            } else if (resizingTask) {
                const targetDate = new Date(days[0].date);
                targetDate.setDate(targetDate.getDate() + columnIndex);
                
                const currentStart = parseDateSafe(resizingTask.start_date);
                const currentEnd = parseDateSafe(resizingTask.end_date);
                
                if (resizeType === 'start') {
                    if (targetDate > currentEnd) return;
                    const newEnd = new Date(currentEnd);
                    const newStart = new Date(targetDate);
                    updateTaskDate(resizingTask, newStart, newEnd);
                } else {
                    if (targetDate < currentStart) return;
                    const newStart = new Date(currentStart);
                    const newEnd = new Date(targetDate);
                    updateTaskDate(resizingTask, newStart, newEnd);
                }
            }
        }
    }, [draggingTask, resizingTask, resizeType, days, viewMode, approvalStatus]);

    const handleMouseUp = useCallback(() => {
        if (draggingTask) {
            saveTaskChanges(draggingTask);
            setDraggingTask(null);
        }
        if (resizingTask) {
            saveTaskChanges(resizingTask);
            setResizingTask(null);
            setResizeType(null);
        }
    }, [draggingTask, resizingTask]);

    useEffect(() => {
        if (draggingTask || resizingTask) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [draggingTask, resizingTask, handleMouseMove, handleMouseUp]);

    const updateTaskDate = (task, newStartDate, newEndDate) => {
        setPhases(prev => prev.map(phase => ({
            ...phase,
            tasks: phase.tasks.map(t => 
                t.id === task.id 
                    ? { 
                        ...t, 
                        start_date: newStartDate.toISOString().split('T')[0],
                        end_date: newEndDate.toISOString().split('T')[0]
                    }
                    : t
            )
        })));
    };

    const saveTaskChanges = async (task) => {
        try {
            await taskService.updateTask(task.id, {
                start_date: task.start_date,
                end_date: task.end_date
            });
            await fetchPhases();
        } catch (err) {
            alert('Failed to update task dates');
            await fetchPhases();
        }
    };

    const handleDragStart = (task) => {
        if (approvalStatus !== 'approved') {
            setDraggingTask(task);
        }
    };

    const handleResizeStart = (task, type) => {
        if (approvalStatus !== 'approved') {
            setResizingTask(task);
            setResizeType(type);
        }
    };

    const changeDate = (direction) => {
        const newDate = new Date(currentDate);
        if (viewMode === 'month') {
            newDate.setMonth(newDate.getMonth() + direction);
        } else if (viewMode === 'week') {
            newDate.setDate(newDate.getDate() + (direction * 7));
        } else {
            newDate.setDate(newDate.getDate() + direction);
        }
        setCurrentDate(newDate);
    };

    const columnWidth = useMemo(() => 
        viewMode === 'month' ? 45 : viewMode === 'week' ? 85 : 180, 
    [viewMode]);

    const handleCreatePhase = async (phaseData) => {
        if (approvalStatus === 'pending' || approvalStatus === 'approved') {
            alert('Cannot add phases after timeline submission');
            return;
        }
        
        try {
            await ganttService.createPhase(ideaId, phaseData);
            await fetchPhases();
            setShowPhaseModal(false);
        } catch (err) {
            alert(err.message || 'Failed to create phase');
        }
    };
    
    const handleUpdatePhase = async (phaseData) => {
        if (approvalStatus === 'pending' || approvalStatus === 'approved') {
            alert('Cannot modify phases after timeline submission');
            return;
        }
        
        try {
            await ganttService.updatePhase(selectedPhase.id, phaseData);
            await fetchPhases();
            setSelectedPhase(null);
            setShowPhaseModal(false);
        } catch (err) {
            alert(err.message || 'Failed to update phase');
        }
    };

    const handleDeletePhase = async (phaseId) => {
        if (approvalStatus === 'pending' || approvalStatus === 'approved') {
            alert('Cannot delete phases after timeline submission');
            return;
        }
        
        if (window.confirm('Are you sure you want to delete this phase?')) {
            try {
                await ganttService.deletePhase(phaseId);
                await fetchPhases();
            } catch (err) {
                alert(err.message || 'Failed to delete phase');
            }
        }
    };
    
    const handleCreateTask = async (taskData) => {
        if (approvalStatus === 'pending' || approvalStatus === 'approved') {
            alert('Cannot add tasks after timeline submission');
            return;
        }
        
        try {
            await taskService.createTask(selectedPhase.id, taskData);
            await fetchPhases();
            setSelectedPhase(null);
            setShowTaskModal(false);
        } catch (err) {
            alert(err.message || 'Failed to create task');
        }
    };
    
    const handleUpdateTask = async (taskData) => {
        try {
            await taskService.updateTask(selectedTask.id, taskData);
            await fetchPhases();
            setSelectedTask(null);
            setShowTaskModal(false);
        } catch (err) {
            alert(err.message || 'Failed to update task');
        }
    };

    const handleEditTask = (task) => {
        setSelectedTask(task);
        setShowTaskEditModal(true);
    };

    const handleTaskUpdate = async (taskData) => {
        try {
            await taskService.updateTask(selectedTask.id, taskData);
            await fetchPhases();
            setShowTaskEditModal(false);
            setSelectedTask(null);
        } catch (err) {
            alert(err.message || 'Failed to update task');
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (approvalStatus === 'pending' || approvalStatus === 'approved') {
            alert('Cannot delete tasks after timeline submission');
            return;
        }
        
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await taskService.deleteTask(taskId);
                await fetchPhases();
                setShowTaskEditModal(false);
                setSelectedTask(null);
            } catch (err) {
                alert(err.message || 'Failed to delete task');
            }
        }
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setShowTaskEditModal(true);
    };

    const getFundingStatusForItem = (item, type) => {
        const key = `${type}_${item.id}`;
        return fundingRequests[key];
    };

    const getFundingStatusBadge = (funding) => {
        if (!funding) return null;
        
        const statusColors = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'under_review': 'bg-blue-100 text-blue-800',
            'approved': 'bg-green-100 text-green-800',
            'rejected': 'bg-red-100 text-red-800',
            'funded': 'bg-emerald-100 text-emerald-800'
        };
        
        const statusTexts = {
            'pending': 'قيد الانتظار',
            'under_review': 'قيد المراجعة',
            'approved': 'تمت الموافقة',
            'rejected': 'مرفوض',
            'funded': 'تم التمويل'
        };
        
        return (
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[funding.status] || 'bg-gray-100 text-gray-800'}`}>
                {statusTexts[funding.status] || funding.status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <LoadingSpinner message="Loading Gantt Chart..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <ErrorMessage message={error} onRetry={fetchPhases} />
            </div>
        );
    }
    
    const hasPenalty = penaltyData?.penalty_amount && penaltyData?.penalty_amount > 0;
    const walletBalance = walletData?.wallet?.balance || 0;
    const canPayPenalty = walletBalance >= (penaltyData?.penalty_amount || 0);
    
    return (
        <div 
            className="min-h-screen bg-gray-50 text-gray-900 flex flex-col"
            ref={containerRef}
        >
            {/* الهيدر */}
            <div className="bg-[#FFD586] border-b border-gray-300 shadow-lg flex-shrink-0 relative min-h-[120px]">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div 
                        ref={animationContainer1}
                        className="absolute -top-6 -left-6 w-36 h-36 opacity-15"
                    />
                    <div 
                        ref={animationContainer2}
                        className="absolute -top-8 right-1/4 w-48 h-48 opacity-10"
                    />
                    <div 
                        ref={animationContainer3}
                        className="absolute -bottom-8 -right-8 w-40 h-40 opacity-20"
                    />
                </div>
                
                <div className="relative z-10 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors border border-gray-300 bg-white shadow-sm"
                            >
                                <ChevronLeft className="w-5 h-5" />
                                <span className="font-medium">Back</span>
                            </button>
                            
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="p-2 bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg border border-blue-200 shadow-sm">
                                        <BarChart3 className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-800">
                                        Gantt Chart: <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">Project Timeline</span>
                                    </h1>
                                    <p className="text-xs text-gray-500 mt-1">Interactive project planning</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            {/* زر دفع الغرامة */}
                            {hasPenalty && (
                                <button
                                    onClick={handlePayPenalty}
                                    disabled={payingPenalty || !canPayPenalty}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 shadow-lg ${
                                        payingPenalty 
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                            : canPayPenalty
                                                ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white hover:shadow-xl'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                    title={!canPayPenalty ? 'Insufficient wallet balance' : 'Pay penalty'}
                                >
                                    {payingPenalty ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Paying...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="w-4 h-4" />
                                            <span>Pay Penalty ({penaltyData.penalty_amount?.toLocaleString()} SYP)</span>
                                        </>
                                    )}
                                </button>
                            )}
                            
                            {approvalStatus === 'approved' && (
                                <div className="flex items-center gap-2 bg-gradient-to-r from-green-100 to-green-50 text-green-700 px-4 py-2.5 rounded-lg border border-green-200 shadow-sm">
                                    <CheckCircle className="w-5 h-5" />
                                    <div className="text-right">
                                        <div className="font-semibold text-sm">Approved by Committee</div>
                                        {submittedAt && (
                                            <div className="text-xs text-green-600">
                                                {formatDateTime(submittedAt)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            
                            {approvalStatus === 'pending' && (
                                <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 px-4 py-2.5 rounded-lg border border-yellow-200 shadow-sm">
                                    <Clock className="w-5 h-5 animate-pulse" />
                                    <div className="text-right">
                                        <div className="font-semibold text-sm">Pending Committee Review</div>
                                        {submittedAt && (
                                            <div className="text-xs text-yellow-600">
                                                Submitted: {formatDateTime(submittedAt)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            
                            {!approvalStatus && (
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => {
                                            setSelectedPhase(null);
                                            setShowPhaseModal(true);
                                        }}
                                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-4 py-2.5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span className="font-medium">New Phase</span>
                                    </button>
                                    
                                    <button
                                        onClick={handleSubmitTimeline}
                                        disabled={submittingTimeline || phases.length === 0}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all duration-300 shadow-lg ${
                                            submittingTimeline || phases.length === 0
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-400'
                                                : 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white hover:shadow-xl border border-green-700'
                                        }`}
                                        title={phases.length === 0 ? 'Add phases first' : 'Submit timeline for evaluation'}
                                    >
                                        {submittingTimeline ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                <span>Submitting...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                <span className="font-medium">Submit for Evaluation</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* معلومات الغرامة والرصيد */}
                    <div className="flex flex-wrap items-center justify-between mt-3 gap-3">
                        <div className="flex items-center gap-4">
                            {!approvalStatus ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <p className="font-medium text-sm text-gray-600">Ready to submit timeline</p>
                                    {phases.length > 0 && (
                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                            {phases.length} phase{phases.length !== 1 ? 's' : ''} · {phases.reduce((acc, phase) => acc + (phase.tasks?.length || 0), 0)} tasks
                                        </span>
                                    )}
                                </div>
                            ) : approvalStatus === 'pending' ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                                    <p className="font-medium text-sm text-gray-600">Timeline under committee review</p>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <p className="font-medium text-sm text-gray-600">Timeline approved</p>
                                    {Object.keys(phaseEvaluations).length > 0 && (
                                        <button
                                            onClick={() => setShowAllEvaluations(!showAllEvaluations)}
                                            className="ml-2 text-blue-600 hover:text-blue-800 text-xs underline"
                                        >
                                            {showAllEvaluations ? 'Hide Evaluations' : 'Show All Evaluations'}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-3">
                            {/* معلومات الرصيد */}
                            {walletData && (
                                <div className="flex items-center gap-2 text-sm bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
                                    <Wallet className="w-4 h-4 text-blue-500" />
                                    <span className="text-gray-600">Balance:</span>
                                    <span className="font-bold text-blue-600">
                                        {walletBalance.toLocaleString()} SYP
                                    </span>
                                </div>
                            )}
                            
                            {/* معلومات الغرامة */}
                            {penaltyData && (
                                <div className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border ${
                                    hasPenalty 
                                        ? 'bg-red-50 border-red-200 text-red-700' 
                                        : 'bg-green-50 border-green-200 text-green-700'
                                }`}>
                                    <AlertTriangle className={`w-4 h-4 ${hasPenalty ? 'text-red-500' : 'text-green-500'}`} />
                                    <span>Penalty:</span>
                                    <span className="font-bold">
                                        {penaltyData.penalty_amount?.toLocaleString() || '0'} SYP
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {timelineError && (
                        <div className="mt-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-pulse">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                            <span className="font-medium">{timelineError}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* عرض التقييمات */}
            {showAllEvaluations && approvalStatus === 'approved' && (
                <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            <span>All Phase Evaluations</span>
                        </h3>
                        <button
                            onClick={() => setShowAllEvaluations(false)}
                            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {phases.map(phase => {
                            const evaluation = phaseEvaluations[phase.id];
                            if (!evaluation) return null;
                            
                            return (
                                <div key={phase.id} className="bg-gradient-to-r from-gray-50 to-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="font-semibold text-sm mb-2 text-gray-800">{phase.phase_name}</div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-gray-600">Evaluation Score:</span>
                                        <div className="flex items-center gap-1">
                                            <span className="font-bold text-blue-600 text-lg">{evaluation.score}</span>
                                            <span className="text-xs text-gray-500">/100</span>
                                        </div>
                                    </div>
                                    {evaluation.comments && evaluation.comments.trim() !== '' && (
                                        <div className="mt-2 text-xs text-gray-700 bg-gray-100 p-2 rounded" title={evaluation.comments}>
                                            {evaluation.comments}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* محتوى مخطط غانت */}
            <div className="flex-1 overflow-x-auto custom-scroll">
                <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex bg-gray-100 rounded-xl p-1 shadow-inner border border-gray-200">
                                {['month', 'week', 'day'].map(mode => (
                                    <button
                                        key={mode}
                                        onClick={() => setViewMode(mode)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                                            viewMode === mode 
                                                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md' 
                                                : 'hover:bg-gray-200 text-gray-700 hover:shadow-sm'
                                        }`}
                                    >
                                        {mode === 'month' ? 'Monthly' : mode === 'week' ? 'Weekly' : 'Daily'}
                                    </button>
                                ))}
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => changeDate(-1)}
                                    className="p-2 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors shadow-sm hover:shadow"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                                
                                <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                    <span className="font-semibold text-lg text-gray-800">
                                        {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </span>
                                </div>
                                
                                <button
                                    onClick={() => changeDate(1)}
                                    className="p-2 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors shadow-sm hover:shadow"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                
                                <button
                                    onClick={() => setCurrentDate(new Date())}
                                    className="px-4 py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                                >
                                    Today
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 pt-0 min-w-max">
                    {phases.length === 0 ? (
                        <div className="bg-white rounded-xl p-8 text-center m-4 shadow-lg border border-gray-200">
                            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">No Phases Found</h3>
                            <p className="text-gray-600 mb-4">Add new phases to start planning your project.</p>
                            <button
                                onClick={() => setShowPhaseModal(true)}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                            >
                                Add First Phase
                            </button>
                        </div>
                    ) : (
                        <div className="relative min-w-max">
                            <TimelineHeader days={days} viewMode={viewMode} columnWidth={columnWidth} />

                            <div className="space-y-4 pt-2 min-w-max">
                                {phases.map(phase => {
                                    const isBadPhase = penaltyData?.bad_phases?.includes(phase.phase_name);
                                    const phaseFunding = getFundingStatusForItem(phase, 'phase');
                                    
                                    return (
                                        <div 
                                            key={phase.id} 
                                            className={`bg-white border ${isBadPhase ? 'border-red-300' : 'border-gray-300'} rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 min-w-max relative`}
                                        >
                                            {isBadPhase && (
                                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
                                            )}
                                            
                                            <div 
                                                className="grid relative"
                                                style={{ 
                                                    gridTemplateColumns: `${LIST_COLUMN_WIDTH} repeat(${days.length + 5}, ${columnWidth}px)`,
                                                    minWidth: `calc(${LIST_COLUMN_WIDTH} + ${(days.length + 5) * columnWidth}px)`
                                                }}
                                            >
                                                <div 
                                                    className={`w-full h-full px-4 py-3 ${isBadPhase ? 'bg-gradient-to-r from-red-50 to-red-100' : 'bg-gradient-to-r from-gray-50 to-gray-100'} border-l ${isBadPhase ? 'border-red-200' : 'border-gray-300'} sticky right-0 z-10 shadow-sm`}
                                                    style={{ gridColumnStart: 1, gridColumnEnd: 2 }}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex flex-col gap-1 truncate flex-1 mr-2">
                                                            <div className="flex items-center gap-3">
                                                                <div className="font-bold truncate text-base text-gray-800">{phase.phase_name}</div>
                                                                {isBadPhase && (
                                                                    <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold">
                                                                        Late
                                                                    </span>
                                                                )}
                                                                {phaseFunding && getFundingStatusBadge(phaseFunding)}
                                                            </div>
                                                            <div className="text-xs text-gray-600 mt-1 flex items-center gap-2">
                                                                <div className="flex items-center gap-1">
                                                                    <Calendar className="w-3 h-3" />
                                                                    <span>{formatDateShort(parseDateSafe(phase.start_date))}</span>
                                                                </div>
                                                                <span>→</span>
                                                                <div className="flex items-center gap-1">
                                                                    <Calendar className="w-3 h-3" />
                                                                    <span>{formatDateShort(parseDateSafe(phase.end_date))}</span>
                                                                </div>
                                                                <span className={`${isBadPhase ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'} px-1.5 py-0.5 rounded text-[10px] font-medium`}>
                                                                    {getWorkingDayDifference(phase.start_date, phase.end_date)}d
                                                                </span>
                                                            </div>
                                                            
                                                            {phaseFunding && phaseFunding.requested_amount && (
                                                                <div className="mt-1 text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded inline-block">
                                                                    طلب تمويل: {phaseFunding.requested_amount?.toLocaleString()} SYP
                                                                </div>
                                                            )}
                                                            
                                                            {phaseEvaluations[phase.id] && (
                                                                <PhaseEvaluation 
                                                                    phaseId={phase.id}
                                                                    evaluation={phaseEvaluations[phase.id]}
                                                                    loading={loadingEvaluations[phase.id]}
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1 flex-shrink-0">
                                                            {/* زر طلب تمويل المرحلة */}
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleFundingRequest(phase, 'phase');
                                                                }}
                                                                className="p-1.5 hover:bg-emerald-100 rounded-lg text-emerald-600 transition-colors"
                                                                title="طلب تمويل للمرحلة"
                                                                disabled={fundingLoading}
                                                            >
                                                                <DollarSign className="w-4 h-4" />
                                                            </button>
                                                            
                                                            {!approvalStatus && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setSelectedPhase(phase);
                                                                        setSelectedTask(null);
                                                                        setShowTaskModal(true);
                                                                    }}
                                                                    className="p-1.5 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                                                                    title="Add Task"
                                                                >
                                                                    <Plus className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                            {!approvalStatus && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setSelectedPhase(phase);
                                                                        setShowPhaseModal(true);
                                                                    }}
                                                                    className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"
                                                                    title="Edit Phase"
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {[...days, ...Array.from({ length: 5 }).map((_, i) => ({
                                                    day: '-',
                                                    date: new Date(days[days.length - 1].date.getTime() + (i + 1) * DAY_IN_MILLIS),
                                                    isToday: false,
                                                    isWeekend: false
                                                }))].map((day, index) => (
                                                    <div 
                                                        key={`phase-bg-${phase.id}-${index}`}
                                                        className={`h-full border-r border-b border-gray-100 ${
                                                            day.isWeekend ? 'bg-gray-50' : 'bg-white'
                                                        } ${day.isToday ? 'bg-pink-50/50' : ''} ${index >= days.length ? 'bg-gray-50/30' : ''}`}
                                                        style={{ gridColumnStart: index + 2, gridColumnEnd: index + 3 }}
                                                    ></div>
                                                ))}

                                                {phase.tasks.map(task => {
                                                    const taskFunding = getFundingStatusForItem(task, 'task');
                                                    
                                                    return (
                                                        <DraggableTaskBar 
                                                            key={task.id}
                                                            task={task}
                                                            style={getTaskStyle(task, days, columnWidth)}
                                                            onClick={() => handleTaskClick(task)}
                                                            onEditClick={handleEditTask}
                                                            onDragStart={handleDragStart}
                                                            onResizeStart={handleResizeStart}
                                                            isDragging={draggingTask?.id === task.id}
                                                            isResizing={resizingTask?.id === task.id && resizeType}
                                                            isApproved={approvalStatus === 'approved'}
                                                            fundingStatus={taskFunding}
                                                            onFundingRequest={() => handleFundingRequest(task, 'task')}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {showPhaseModal && (
                <PhaseModal
                    phase={selectedPhase}
                    onClose={() => {
                        setSelectedPhase(null);
                        setShowPhaseModal(false);
                    }}
                    onSubmit={selectedPhase ? handleUpdatePhase : handleCreatePhase}
                    onDelete={selectedPhase ? handleDeletePhase : null}
                />
            )}
            
            {showTaskModal && selectedPhase && (
                <TaskModal
                    task={selectedTask}
                    phaseId={selectedPhase.id}
                    onClose={() => {
                        setSelectedTask(null);
                        setSelectedPhase(null);
                        setShowTaskModal(false);
                    }}
                    onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
                />
            )}
            
            {showTaskEditModal && selectedTask && (
                <TaskEditModal
                    task={selectedTask}
                    phaseId={selectedPhase?.id}
                    phaseApprovalStatus={approvalStatus}
                    onClose={() => {
                        setSelectedTask(null);
                        setShowTaskEditModal(false);
                    }}
                    onSubmit={handleTaskUpdate}
                    onDelete={handleDeleteTask}
                />
            )}
            
            {showFundingModal && fundingItem && fundingItemType && (
                <FundingModal
                    item={fundingItem}
                    itemType={fundingItemType}
                    onClose={() => {
                        setShowFundingModal(false);
                        setFundingItem(null);
                        setFundingItemType(null);
                    }}
                    onSubmit={handleSubmitFunding}
                    existingFunding={fundingRequests[`${fundingItemType}_${fundingItem.id}`]}
                    loading={fundingLoading}
                />
            )}
        </div>
    );
};

export default GanttFullPage;