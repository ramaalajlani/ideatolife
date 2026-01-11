import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Lottie from "lottie-react";
import CalendarGrid from './CalendarGrid';
import MeetingsList from './MeetingsList';
import MeetingDetails from './MeetingDetails';
import meetingService from '../services/meetingService';
import { useIdea } from '../context/IdeaContext';
import OnlineMeetingAnimation from '../assets/animations/Online Team meeting.json';

const MeetingCalendar = () => {
  const { ideaId: paramsIdeaId } = useParams();
  const navigate = useNavigate();
  const { currentIdea } = useIdea();
  
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
      setError("Please select an idea first to view its meetings");
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
      setError(err.message || 'Failed to load meetings');
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

  const handleMonthChange = (newDate) => {
    setCurrentDate(newDate); // تحديث الشهر
  };

  const getMeetingsForSelectedDate = () => {
    return meetings.filter(meeting => {
      const meetingDate = new Date(meeting.meeting_date);
      return meetingDate.toDateString() === selectedDate.toDateString();
    });
  };

  if (!ideaId) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center border border-gray-200">
          <div className="w-40 h-40 mx-auto mb-4">
            <Lottie 
              animationData={OnlineMeetingAnimation} 
              loop 
              autoplay 
              className="w-full h-full"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Idea Selected</h2>
          <p className="text-gray-600 mb-6">
            Please select an idea first to view its meetings
          </p>
          <div className="space-y-3">
            <button
              onClick={handleSelectIdea}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Choose Idea from Profile
            </button>
            <button
              onClick={handleBackToProfile}
              className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Back to Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading meetings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-gray-200">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">Error Occurred</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={fetchMeetings}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Try Again
            </button>
            <button
              onClick={handleBackToProfile}
              className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Back to Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Animation */}
        <div className="bg-[#FFD586] rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 flex-shrink-0">
                <Lottie 
                  animationData={OnlineMeetingAnimation} 
                  loop 
                  autoplay 
                  className="w-full h-full"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Idea Meetings
                  {currentIdea?.title && (
                    <span className="text-gray-700 block text-lg mt-1">
                      {currentIdea.title}
                    </span>
                  )}
                </h1>
                <p className="text-gray-700 mt-2">
                  View and manage all upcoming meetings for the idea
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchMeetings}
                className="px-4 py-2 bg-white/80 text-gray-800 rounded-lg hover:bg-white flex items-center gap-2 transition-colors border border-gray-300"
              >
                <span>⟳</span>
                <span>Refresh</span>
              </button>
              <div className="text-gray-800 bg-white/80 px-4 py-2 rounded-lg font-medium border border-gray-300">
                {meetings.length} meeting{meetings.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Calendar */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <CalendarGrid
                currentDate={currentDate}
                selectedDate={selectedDate}
                meetings={meetings}
                onDateSelect={handleDateSelect}
                onMeetingSelect={handleMeetingSelect}
                onMonthChange={handleMonthChange} // ✅ هنا
              />
            </div>
          </div>

          {/* Right Column - Meetings List */}
          <div className="lg:w-1/3 space-y-6">
            {/* Selected Day Meetings */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Meetings on {selectedDate.toLocaleDateString([], { 
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
                  <p className="text-gray-500">No meetings on this date</p>
                </div>
              )}
            </div>

            {/* All Upcoming Meetings */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">All Upcoming Meetings</h2>
              {meetings.length > 0 ? (
                <MeetingsList
                  meetings={meetings.slice(0, 3)}
                  onMeetingSelect={handleMeetingSelect}
                />
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">No upcoming meetings</p>
                </div>
              )}
              {meetings.length > 3 && (
                <button
                  onClick={() => setSelectedDate(new Date())}
                  className="w-full mt-4 py-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Show all meetings ({meetings.length})
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
