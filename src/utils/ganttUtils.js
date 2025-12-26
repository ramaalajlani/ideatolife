// src/utils/ganttUtils.js
export const TASK_COLORS = [
    'bg-orange-600',
    'bg-amber-500', 
    'bg-yellow-600',
    'bg-red-500',
    'bg-lime-600',
    'bg-indigo-600',
    'bg-orange-400',
];

export const LIST_COLUMN_WIDTH = '320px';
export const DAY_IN_MILLIS = 1000 * 60 * 60 * 24;

export const parseDateSafe = (dateString) => {
    if (!dateString) return new Date();
    try {
        const date = new Date(dateString);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    } catch (error) {
        return new Date();
    }
};

export const formatDateShort = (date) => {
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
    });
};

export const formatDateTime = (dateString) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return dateString;
    }
};

export const getWorkingDayDifference = (startDate, endDate) => {
    let start = parseDateSafe(startDate);
    let end = parseDateSafe(endDate);
    if (start > end) [start, end] = [end, start];

    let workingDays = 0;
    const currentDate = new Date(start);
    
    while (currentDate <= end) {
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            workingDays++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return workingDays;
};

export const getDayDifference = (date1, date2) => {
    const start = date1 instanceof Date ? date1 : parseDateSafe(date1);
    const end = date2 instanceof Date ? date2 : parseDateSafe(date2);
    const timeDiff = Math.abs(end.getTime() - start.getTime());
    return Math.floor(timeDiff / DAY_IN_MILLIS) + 1;
};

export const getStatusIcon = (status) => {
    const iconConfig = {
        completed: { icon: 'CheckCircle', color: 'text-green-500' },
        in_progress: { icon: 'Clock', color: 'text-yellow-500 animate-pulse' },
        default: { icon: 'Clock', color: 'text-gray-400' }
    };
    return iconConfig[status] || iconConfig.default;
};

export const generateDays = (currentDate, viewMode) => {
    const daysArray = [];
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (viewMode === 'month') {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            daysArray.push({
                day,
                date,
                isToday: date.getTime() === today.getTime(),
                isWeekend: date.getDay() === 0 || date.getDay() === 6
            });
        }
    } else if (viewMode === 'week') {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            daysArray.push({
                day: date.getDate(),
                date,
                isToday: date.getTime() === today.getTime(),
                isWeekend: date.getDay() === 0 || date.getDay() === 6
            });
        }
    } else {
        daysArray.push({
            day: currentDate.getDate(),
            date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
            isToday: currentDate.getTime() === today.getTime(),
            isWeekend: currentDate.getDay() === 0 || currentDate.getDay() === 6
        });
    }
    
    return daysArray;
};

export const getTaskStyle = (task, days) => {
    if (!days?.length) return { display: 'none' };
    
    const viewStartDate = days[0].date.getTime();
    const taskStart = parseDateSafe(task.start_date).getTime();
    const taskEnd = parseDateSafe(task.end_date).getTime();
    
    const diffTimeStart = taskStart - viewStartDate;
    const diffDaysStart = Math.round(diffTimeStart / DAY_IN_MILLIS);
    const durationTime = taskEnd - taskStart;
    const durationDays = Math.round(durationTime / DAY_IN_MILLIS) + 1;
    
    const gridStart = diffDaysStart + 2;
    const gridEnd = gridStart + durationDays;
    
    const maxGridEnd = days.length + 7;
    
    if (gridEnd <= 1) {
        return { display: 'none' };
    }
    
    return {
        gridColumnStart: Math.max(2, gridStart),
        gridColumnEnd: Math.min(maxGridEnd, gridEnd),
    };
};