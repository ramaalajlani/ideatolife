import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CalendarGrid from './CalendarGrid';
import MeetingsList from './MeetingsList';
import MeetingDetails from './MeetingDetails';
import meetingService from '../services/meetingService';
import { useIdea } from '../context/IdeaContext';

const MeetingCalendar = () => {
  const { ideaId: paramsIdeaId } = useParams(); // الحصول على ideaId من المسار
  const navigate = useNavigate();
  const { currentIdea } = useIdea(); // الحصول على الفكرة النشطة من السياق
  
  // تحديد الفكرة المستخدمة: من الـ params أولاً، ثم من context
  const ideaId = paramsIdeaId || currentIdea?.id;
  
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (ideaId) {
      fetchMeetings();
    } else {
      setError("يرجى اختيار فكرة أولاً لعرض اجتماعاتها");
      setLoading(false);
    }
  }, [ideaId]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await meetingService.getUpcomingMeetings(ideaId);
      const meetingsData = response.upcoming_meetings || [];
      const formattedMeetings = meetingsData.map(meeting => ({
        ...meeting,
        date: new Date(meeting.meeting_date),
        title: meeting.idea_title,
        description: meeting.notes,
        participants: [meeting.committee_name],
        type: meeting.type,
        is_upcoming: true
      }));
      
      setMeetings(formattedMeetings);
    } catch (err) {
      console.error('Error fetching meetings:', err);
      setError(err.message || 'فشل في تحميل الاجتماعات');
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleMeetingSelect = (meeting) => {
    setSelectedMeeting(meeting);
  };

  const handleCloseDetails = () => {
    setSelectedMeeting(null);
  };

  const handleBackToProfile = () => {
    navigate('/profile');
  };

  const handleSelectIdea = () => {
    navigate('/profile');
  };

  // الحصول على الاجتماعات للتاريخ المحدد
  const getMeetingsForSelectedDate = () => {
    return meetings.filter(meeting => {
      const meetingDate = new Date(meeting.meeting_date);
      return meetingDate.toDateString() === selectedDate.toDateString();
    });
  };

  // عرض حالة "لم يتم اختيار فكرة"
  if (!ideaId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-gray-400 text-6xl mb-4">📅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">لم يتم اختيار فكرة</h2>
          <p className="text-gray-600 mb-6">
            يرجى اختيار فكرة أولاً لعرض الاجتماعات الخاصة بها
          </p>
          <div className="space-y-3">
            <button
              onClick={handleSelectIdea}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              اختر فكرة من بروفايلك
            </button>
            <button
              onClick={handleBackToProfile}
              className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              العودة للبروفايل
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 text-lg">جاري تحميل الاجتماعات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">حدث خطأ</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={fetchMeetings}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              إعادة المحاولة
            </button>
            <button
              onClick={handleBackToProfile}
              className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              العودة للبروفايل
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                اجتماعات الفكرة
                {currentIdea?.title && (
                  <span className="text-blue-600 block text-lg mt-1">
                    {currentIdea.title}
                  </span>
                )}
              </h1>
              <p className="text-gray-600 mt-2">
                عرض وإدارة جميع الاجتماعات القادمة للفكرة
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchMeetings}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center gap-2 transition-colors"
              >
                <span>⟳</span>
                <span>تحديث</span>
              </button>
              <div className="text-gray-700 bg-gray-100 px-4 py-2 rounded-lg font-medium">
                {meetings.length} اجتماع{meetings.length !== 1 ? 'ات' : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Calendar */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <CalendarGrid
                currentDate={currentDate}
                selectedDate={selectedDate}
                meetings={meetings}
                onDateSelect={handleDateSelect}
                onMeetingSelect={handleMeetingSelect}
              />
            </div>
          </div>

          {/* Right Column - Meetings List */}
          <div className="lg:w-1/3 space-y-6">
            {/* اليوم المحدد */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                الاجتماعات في {selectedDate.toLocaleDateString('ar-SA', { 
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </h2>
              {getMeetingsForSelectedDate().length > 0 ? (
                <MeetingsList
                  meetings={getMeetingsForSelectedDate()}
                  onMeetingSelect={handleMeetingSelect}
                />
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-3">📅</div>
                  <p className="text-gray-500">لا توجد اجتماعات في هذا التاريخ</p>
                </div>
              )}
            </div>

            {/* جميع الاجتماعات القادمة */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">جميع الاجتماعات القادمة</h2>
              {meetings.length > 0 ? (
                <MeetingsList
                  meetings={meetings.slice(0, 3)} // عرض أول 3 اجتماعات فقط
                  onMeetingSelect={handleMeetingSelect}
                />
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">لا توجد اجتماعات قادمة</p>
                </div>
              )}
              {meetings.length > 3 && (
                <button
                  onClick={() => setSelectedDate(new Date())}
                  className="w-full mt-4 py-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  عرض جميع الاجتماعات ({meetings.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Meeting Details Modal */}
        {selectedMeeting && (
          <MeetingDetails
            meeting={selectedMeeting}
            onClose={handleCloseDetails}
          />
        )}
      </div>
    </div>
  );
};

export default MeetingCalendar;