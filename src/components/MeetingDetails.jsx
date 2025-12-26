import React from 'react';

const MeetingDetails = ({ meeting, onClose }) => {
  if (!meeting) return null;

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMeetingType = (type) => {
    const types = {
      'initial': 'اجتماع مبدئي',
      'technical_review': 'مراجعة فنية',
      'funding_review': 'مراجعة تمويل',
      'marketing_review': 'مراجعة تسويقية'
    };
    return types[type] || type;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">تفاصيل الاجتماع</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  📅
                  <span>{formatDateTime(meeting.meeting_date)}</span>
                </div>
                {meeting.is_soon && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                    ⚡ خلال {meeting.hours_left} ساعة
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{meeting.idea_title}</h3>
            <div className="space-y-4">
              <DetailItem label="اللجنة" value={meeting.committee_name} />
              <DetailItem label="نوع الاجتماع" value={getMeetingType(meeting.type)} />
              <DetailItem label="طلب بواسطة" value={meeting.requested_by === 'committee' ? 'اللجنة' : 'صاحب الفكرة'} />
              
              {meeting.notes && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">الملاحظات</h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{meeting.notes}</p>
                </div>
              )}
            </div>
          </div>

          {meeting.meeting_link && (
            <a
              href={meeting.meeting_link}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 font-medium text-lg"
            >
              🎥 انضم للاجتماع الآن
            </a>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100">
    <span className="text-gray-600 font-medium">{label}:</span>
    <span className="text-gray-800">{value}</span>
  </div>
);

export default MeetingDetails;