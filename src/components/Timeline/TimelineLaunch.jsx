// src/components/Timeline/TimelineLaunch.jsx
import React, { useState } from "react";
import roadmapService from "../../services/roadmapService";

const TimelineLaunch = ({ ideaId, canLaunch, onSuccess }) => {
  const [launching, setLaunching] = useState(false);

  const handleLaunchClick = async () => {
    if (!ideaId || !canLaunch) return;

    setLaunching(true);
    try {
      const data = await roadmapService.requestLaunch(ideaId);
      console.log('تم إرسال طلب الإطلاق بنجاح:', data.launch);

      if (onSuccess) onSuccess(data.launch);

    } catch (err) {
      console.error('خطأ في طلب الإطلاق:', err);
      // لا تعرض أي رسالة للمستخدم
    } finally {
      setLaunching(false);
    }
  };

  if (!canLaunch) return null; // لا يظهر الزر إذا لا يمكن الإطلاق

  return (
    <div className="my-6 flex justify-center">
      <button
        onClick={handleLaunchClick}
        disabled={launching}
        className={`py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
          launching ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {launching ? 'جارٍ إرسال الطلب...' : 'طلب إطلاق المشروع'}
      </button>
    </div>
  );
};

export default TimelineLaunch;
