// src/components/GanttChart/DraggableTaskBar.jsx
import React from 'react';
import { Calendar, GripVertical, Edit, Lock, User, DollarSign, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { TASK_COLORS, formatDateShort, getWorkingDayDifference, parseDateSafe } from '../../utils/ganttUtils';

const DraggableTaskBar = React.memo(({ 
    task, 
    style, 
    onClick,
    onEditClick,
    onDragStart,
    onResizeStart,
    isDragging,
    isResizing,
    isApproved,
    fundingStatus,
    onFundingRequest
}) => {
    const progressStyle = {
        width: `${task.progress_percentage || 0}%`,
    };

    const baseColorClass = task.color || TASK_COLORS[0];
    const hoverClass = baseColorClass.replace('bg-', 'hover:bg-');
    const isCompleted = task.status === 'completed';
    
    // تحقق من وجود تمويل
    const hasFunding = fundingStatus && fundingStatus.status;
    
    // يمكن طلب التمويل في جميع الحالات (قبل وبعد الاعتماد)
    const canRequestFunding = onFundingRequest && !hasFunding;
    
    // تغيير لون الخلفية إذا كان هناك تمويل
    const barClass = hasFunding 
        ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600'
        : `${baseColorClass} ${isCompleted ? 'opacity-70' : ''}`;
    
    const finalBarClass = `${barClass} ${
        isDragging ? 'opacity-80 z-50 shadow-2xl' : 
        isResizing ? 'opacity-80 z-50 border-2 border-blue-400' : 
        `${hoverClass} hover:scale-[1.02]`
    } transition-all duration-200`;

    const startDate = parseDateSafe(task.start_date);
    const endDate = parseDateSafe(task.end_date);
    const duration = getWorkingDayDifference(task.start_date, task.end_date);

    // دالة للتعامل مع نقر زر التمويل
    const handleFundingClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (onFundingRequest) {
            onFundingRequest(task);
        }
    };

    // دالة للتعامل مع نقر شريط المهمة
    const handleTaskClick = (e) => {
        e.stopPropagation();
        if (onClick) {
            onClick(task);
        }
    };

    // دالة لعرض حالة التمويل
    const getFundingStatusText = (status) => {
        const statusMap = {
            'draft': 'مسودة',
            'pending': 'قيد الانتظار',
            'under_review': 'قيد المراجعة',
            'approved': 'تمت الموافقة',
            'rejected': 'مرفوض',
            'funded': 'تم التمويل',
            'requested': 'تم الطلب'
        };
        return statusMap[status] || status;
    };

    // دالة لعرض لون حالة التمويل
    const getFundingStatusColor = (status) => {
        const colorMap = {
            'draft': 'bg-gray-100 text-gray-800',
            'pending': 'bg-yellow-100 text-yellow-800',
            'under_review': 'bg-blue-100 text-blue-800',
            'approved': 'bg-green-100 text-green-800',
            'rejected': 'bg-red-100 text-red-800',
            'funded': 'bg-emerald-100 text-emerald-800',
            'requested': 'bg-purple-100 text-purple-800'
        };
        return colorMap[status] || 'bg-gray-100 text-gray-800';
    };

    // دالة لعرض أيقونة حالة التمويل
    const getFundingStatusIcon = (status) => {
        if (status === 'funded') {
            return <DollarSign className="w-3 h-3" />;
        } else if (status === 'approved') {
            return <CheckCircle className="w-3 h-3" />;
        } else if (status === 'rejected') {
            return <AlertCircle className="w-3 h-3" />;
        } else if (status === 'pending' || status === 'under_review') {
            return <Clock className="w-3 h-3" />;
        } else {
            return <DollarSign className="w-3 h-3" />;
        }
    };

    return (
        <div
            className="w-full h-12 flex items-center p-1 relative"
            style={style}
        >
            {/* زر التمويل - يظهر في جميع الحالات */}
            {canRequestFunding && (
                <button
                    onClick={handleFundingClick}
                    className="absolute -left-12 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white z-50 cursor-pointer"
                    title="طلب تمويل لهذه المهمة"
                >
                    <DollarSign className="w-5 h-5" />
                    <div className="absolute -bottom-6 text-[10px] bg-white text-emerald-700 px-1 py-0.5 rounded whitespace-nowrap shadow-sm border border-emerald-200 min-w-max">
                        طلب تمويل
                    </div>
                </button>
            )}

            {/* حالة التمويل الحالية */}
            {hasFunding && (
                <div className="absolute -left-28 top-1/2 transform -translate-y-1/2 z-40 min-w-32">
                    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
                        <div className="flex items-center gap-2 mb-1">
                            {getFundingStatusIcon(fundingStatus.status)}
                            <span className="text-xs font-bold text-gray-700">التمويل</span>
                        </div>
                        <div className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${getFundingStatusColor(fundingStatus.status)}`}>
                            {getFundingStatusText(fundingStatus.status)}
                        </div>
                        {fundingStatus.requested_amount && (
                            <div className="mt-1 text-[10px] text-emerald-700 font-bold">
                                {fundingStatus.requested_amount?.toLocaleString()} SYP
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* زر تعديل التاريخ (البداية) */}
            {!isApproved && (
                <div 
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-8 bg-blue-500 rounded-l-md cursor-col-resize z-30 hover:bg-blue-600"
                    onMouseDown={(e) => {
                        e.stopPropagation();
                        if (onResizeStart) {
                            onResizeStart(task, 'start');
                        }
                    }}
                    title="سحب لتغيير تاريخ البداية"
                >
                    <GripVertical className="w-4 h-4 text-white mt-2" />
                </div>
            )}

            {/* شريط المهمة الرئيسي */}
            <div 
                className={`h-10 flex items-center px-3 text-white text-xs font-semibold rounded-lg shadow-lg cursor-pointer relative flex-1 ${finalBarClass} ${
                    isApproved ? 'cursor-default hover:scale-100' : 'cursor-move'
                }`}
                onClick={handleTaskClick}
                onMouseDown={(e) => {
                    if (!isApproved && e.target === e.currentTarget && !isResizing && onDragStart) {
                        onDragStart(task);
                    }
                }}
                title={`${task.task_name}
من: ${startDate.toLocaleDateString('ar-SA')}
إلى: ${endDate.toLocaleDateString('ar-SA')}
المدة: ${duration} يوم عمل
الإنجاز: ${task.progress_percentage || 0}%
${hasFunding ? `\nالتمويل: ${fundingStatus.requested_amount?.toLocaleString()} SYP\nحالة: ${getFundingStatusText(fundingStatus.status)}` : ''}`}
            >
                <div className="flex-1 min-w-0">
                    <div className="truncate font-bold text-sm flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            {task.task_name}
                            {hasFunding && (
                                <span className="flex items-center gap-1 bg-white/30 px-2 py-0.5 rounded-full text-xs">
                                    {getFundingStatusIcon(fundingStatus.status)}
                                    <span>تمويل</span>
                                </span>
                            )}
                            {canRequestFunding && (
                                <span className="flex items-center gap-1 bg-white/30 px-2 py-0.5 rounded-full text-xs">
                                    <DollarSign className="w-3 h-3" />
                                    <span>يتاح التمويل</span>
                                </span>
                            )}
                        </span>
                        {(isDragging || isResizing) && (
                            <span className="ml-2 text-xs opacity-90 animate-pulse bg-black/20 px-2 py-0.5 rounded">
                                {isDragging ? 'جاري السحب...' : 'جاري التغيير...'}
                            </span>
                        )}
                        {isApproved && !hasFunding && !canRequestFunding && (
                            <Lock className="w-3 h-3 text-white/70 ml-2" />
                        )}
                    </div>
                </div>
                
                <div className="flex items-center gap-2 ml-3 text-xs opacity-90">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDateShort(startDate)}</span>
                    </div>
                    <span className="opacity-70">→</span>
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDateShort(endDate)}</span>
                    </div>
                    <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] ml-1">
                        {duration}يوم
                    </span>
                    {task.progress_percentage > 0 && (
                        <div className="bg-white/30 px-1.5 py-0.5 rounded text-[10px] font-bold">
                            {task.progress_percentage}%
                        </div>
                    )}
                </div>
                
                {/* شريط التقدم */}
                {task.progress_percentage > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/30 rounded-b-lg overflow-hidden">
                        <div 
                            className="h-full bg-white/90 transition-all duration-300"
                            style={progressStyle}
                        ></div>
                    </div>
                )}
                
                {/* الموكلين بالمهمة */}
                {task.assignees && task.assignees.length > 0 && (
                    <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 flex -space-x-2 z-20">
                        {task.assignees.slice(0, 3).map((assignee, i) => (
                            <div 
                                key={i} 
                                className="w-7 h-7 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-gray-800 shadow-lg"
                                title={assignee.name}
                            >
                                {assignee.name?.charAt(0) || <User className="w-3 h-3" />}
                            </div>
                        ))}
                        {task.assignees.length > 3 && (
                            <div className="w-7 h-7 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-gray-800 shadow-lg">
                                +{task.assignees.length - 3}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* زر تعديل المهمة */}
            {!isApproved && onEditClick && (
                <button
                    className="absolute -right-10 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white shadow-lg z-20"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onEditClick) {
                            onEditClick(task);
                        }
                    }}
                    title="تعديل المهمة"
                >
                    <Edit className="w-4 h-4" />
                </button>
            )}

            {/* زر تعديل التاريخ (النهاية) */}
            {!isApproved && (
                <div 
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-8 bg-blue-500 rounded-r-md cursor-col-resize z-30 hover:bg-blue-600"
                    onMouseDown={(e) => {
                        e.stopPropagation();
                        if (onResizeStart) {
                            onResizeStart(task, 'end');
                        }
                    }}
                    title="سحب لتغيير تاريخ النهاية"
                >
                    <GripVertical className="w-4 h-4 text-white mt-2" />
                </div>
            )}
        </div>
    );
});

DraggableTaskBar.defaultProps = {
    onDragStart: null,
    onResizeStart: null,
    onEditClick: null,
    onClick: null,
    onFundingRequest: null,
    isDragging: false,
    isResizing: false,
    isApproved: false,
    fundingStatus: null
};

export default DraggableTaskBar;