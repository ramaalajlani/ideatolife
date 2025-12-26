// src/pages/dashboardcommit/CommitteeDashboard/components/DashboardTabs/MeetingsTab.jsx
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek
} from "date-fns";

const MeetingsTab = () => {
  const [meetings, setMeetings] = useState([]);
  const [myIdeasMeetings, setMyIdeasMeetings] = useState([]);
  const [userIdeas, setUserIdeas] = useState([]);
  const [selectedIdeaId, setSelectedIdeaId] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMyIdeas, setLoadingMyIdeas] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("committee"); // 'committee' or 'myIdeas'
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch committee meetings
  const fetchCommitteeMeetings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('committee_token');
      
      if (!token) {
        setError("Authentication required. Please log in.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "http://localhost:8000/api/committee/upcoming-meetings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.upcoming_meetings) {
        setMeetings(response.data.upcoming_meetings);
      } else {
        setMeetings([]);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching committee meetings:", err);
      setError(err.response?.data?.message || "An error occurred while fetching data");
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user ideas
  const fetchUserIdeas = async () => {
    try {
      const token = localStorage.getItem('committee_token');
      const response = await axios.get(
        "http://localhost:8000/api/user/ideas",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.ideas) {
        setUserIdeas(response.data.ideas);
      }
    } catch (err) {
      console.error("Error fetching user ideas:", err);
    }
  };

  // Fetch meetings for specific idea
  const fetchIdeaMeetings = async (ideaId) => {
    if (!ideaId) {
      setMyIdeasMeetings([]);
      return;
    }

    try {
      setLoadingMyIdeas(true);
      const token = localStorage.getItem('committee_token');
      const response = await axios.get(
        `http://localhost:8000/api/idea/${ideaId}/meetings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.upcoming_meetings) {
        setMyIdeasMeetings(response.data.upcoming_meetings);
      } else {
        setMyIdeasMeetings([]);
      }
    } catch (err) {
      console.error("Error fetching idea meetings:", err);
      setMyIdeasMeetings([]);
    } finally {
      setLoadingMyIdeas(false);
    }
  };

  // Update meeting
  const updateMeeting = async () => {
    if (!editingMeeting) return;

    try {
      setSaving(true);
      const token = localStorage.getItem('committee_token');
      
      await axios.put(
        `http://localhost:8000/api/committee/meetings/${editingMeeting.id}`,
        {
          meeting_date: editingMeeting.meeting_date,
          meeting_link: editingMeeting.meeting_link || null,
          notes: editingMeeting.notes || null
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      await fetchCommitteeMeetings();
      setShowEditModal(false);
      setEditingMeeting(null);
      
      alert("Meeting updated successfully");
    } catch (err) {
      console.error("Error updating meeting:", err);
      alert("Failed to update meeting");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchCommitteeMeetings();
    fetchUserIdeas();
  }, []);

  useEffect(() => {
    if (activeTab === 'myIdeas' && selectedIdeaId) {
      fetchIdeaMeetings(selectedIdeaId);
    }
  }, [selectedIdeaId, activeTab]);

  // Function to get active meetings based on tab
  const getActiveMeetings = () => {
    return activeTab === 'committee' ? meetings : myIdeasMeetings;
  };

  // Function to get meetings for specific date
  const getMeetingsForDate = (date) => {
    const activeMeetings = getActiveMeetings();
    return activeMeetings.filter(meeting => {
      const meetingDate = new Date(meeting.meeting_date);
      return isSameDay(meetingDate, date);
    });
  };

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
    
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentDate]);

  const getStatusBadge = (meeting) => {
    const base = "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border ";
    
    if (meeting.is_soon) {
      return base + "bg-red-50 text-red-700 border-red-200";
    }
    
    // Meeting types from API response
    const typeConfig = {
      'discussion': "bg-blue-50 text-blue-700 border-blue-200",
      'review': "bg-orange-50 text-orange-700 border-orange-200",
      'evaluation': "bg-emerald-50 text-emerald-700 border-emerald-200",
      'other': "bg-gray-50 text-gray-700 border-gray-200"
    };
    
    return base + (typeConfig[meeting.type] || typeConfig.other);
  };

  const formatMeetingDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd MMM yyyy, hh:mm a");
    } catch (err) {
      return dateString;
    }
  };

  const formatTimeLeft = (hours) => {
    if (hours < 1) {
      const minutes = Math.floor(hours * 60);
      return `${minutes} MINUTES`;
    } else if (hours < 24) {
      return `${Math.floor(hours)} HOURS`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days} DAYS`;
    }
  };

  const getTypeText = (type) => {
    const types = {
      'discussion': 'DISCUSSION',
      'review': 'REVIEW',
      'evaluation': 'EVALUATION',
      'other': 'OTHER'
    };
    return types[type] || 'MEETING';
  };

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // English week days
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Meetings for selected date
  const selectedDateMeetings = getMeetingsForDate(selectedDate);

  if (loading && activeTab === 'committee') {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-600 border-solid"></div>
        <p className="text-gray-500 text-sm font-bold uppercase tracking-wide">LOADING SCHEDULE</p>
      </div>
    );
  }

  if (error && activeTab === 'committee') {
    return (
      <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 md:p-12 text-center max-w-xl mx-auto">
        <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">CONNECTION ERROR</h3>
        <p className="text-gray-500 text-sm mt-3 uppercase font-bold">{error}</p>
        <button
          onClick={fetchCommitteeMeetings}
          className="mt-6 md:mt-10 px-8 md:px-12 py-3 md:py-4 bg-[#0F1115] text-white text-sm font-bold uppercase tracking-wide rounded-full hover:bg-orange-600 transition-all shadow-lg"
        >
          RETRY SYNC
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 space-y-8 md:space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-gray-200 pb-6 md:pb-10 gap-4">
        <div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 uppercase">MEETINGS CALENDAR</h2>
          <p className="text-orange-600 text-sm mt-2 md:mt-3 font-bold uppercase tracking-wider">
            {activeTab === 'committee' 
              ? `${meetings.length} COMMITTEE SCHEDULES` 
              : `${myIdeasMeetings.length} IDEA SESSIONS`}
          </p>
        </div>
        
        {/* Tabs */}
        <div className="flex space-x-2 md:space-x-4">
          <button
            onClick={() => setActiveTab("committee")}
            className={`px-4 md:px-8 py-2 md:py-3 text-xs md:text-sm font-bold uppercase tracking-wide rounded-full transition-all ${
              activeTab === "committee"
                ? "bg-[#0F1115] text-white shadow-lg"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            COMMITTEE
          </button>
          <button
            onClick={() => setActiveTab("myIdeas")}
            className={`px-4 md:px-8 py-2 md:py-3 text-xs md:text-sm font-bold uppercase tracking-wide rounded-full transition-all ${
              activeTab === "myIdeas"
                ? "bg-[#0F1115] text-white shadow-lg"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            MY IDEAS
          </button>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Calendar Container */}
        <div className="lg:col-span-2">
          <div className="bg-white border-2 border-gray-200 rounded-3xl overflow-hidden">
            {/* Calendar Header */}
            <div className="bg-[#0F1115] p-4 md:p-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
                <button
                  onClick={handlePrevMonth}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gray-800 flex items-center justify-center text-white hover:bg-orange-600 transition-all"
                >
                  <span className="text-xl font-light">←</span>
                </button>
                
                <button
                  onClick={handleToday}
                  className="px-4 md:px-6 py-2 md:py-3 bg-orange-600 text-white text-xs md:text-sm font-bold uppercase tracking-wide rounded-full hover:bg-orange-700 transition-all"
                >
                  TODAY
                </button>
                
                <button
                  onClick={handleNextMonth}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gray-800 flex items-center justify-center text-white hover:bg-orange-600 transition-all"
                >
                  <span className="text-xl font-light">→</span>
                </button>
              </div>
              
              <div className="text-center">
                <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight">
                  {format(currentDate, "MMMM yyyy")}
                </h3>
                <p className="text-orange-400 text-xs md:text-sm font-bold uppercase tracking-wider mt-1 md:mt-2">
                  {format(selectedDate, "EEEE, dd MMMM yyyy")}
                </p>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-4 md:p-8">
              {/* Week Days Header */}
              <div className="grid grid-cols-7 gap-1 md:gap-2 mb-4 md:mb-6">
                {weekDays.map((day) => (
                  <div key={day} className="text-center py-2 md:py-4">
                    <span className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider">
                      {day}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1 md:gap-2">
                {calendarDays.map((day, index) => {
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const isTodayDate = isToday(day);
                  const isSelected = isSameDay(day, selectedDate);
                  const dayMeetings = getMeetingsForDate(day);
                  const hasMeetings = dayMeetings.length > 0;

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(day)}
                      className={`relative min-h-[80px] md:min-h-[120px] p-2 md:p-4 rounded-xl md:rounded-2xl border-2 transition-all ${
                        isSelected
                          ? 'border-orange-600 bg-orange-50'
                          : isTodayDate
                          ? 'border-blue-200 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${!isCurrentMonth ? 'opacity-40' : ''}`}
                    >
                      <div className="flex flex-col h-full">
                        <div className="flex justify-between items-start">
                          <span className={`text-sm md:text-lg font-bold ${
                            isSelected 
                              ? 'text-orange-700' 
                              : isTodayDate
                              ? 'text-blue-700'
                              : 'text-gray-700'
                          }`}>
                            {format(day, 'd')}
                          </span>
                          
                          {hasMeetings && (
                            <div className="flex -space-x-1">
                              {dayMeetings.slice(0, 3).map((meeting, idx) => (
                                <div 
                                  key={idx}
                                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full border border-white ${
                                    meeting.is_soon 
                                      ? 'bg-red-500' 
                                      : meeting.type === 'discussion'
                                      ? 'bg-blue-500'
                                      : meeting.type === 'review'
                                      ? 'bg-orange-500'
                                      : 'bg-emerald-500'
                                  }`}
                                />
                              ))}
                              {dayMeetings.length > 3 && (
                                <div className="w-4 h-4 md:w-6 md:h-6 bg-gray-800 text-white text-xs rounded-full flex items-center justify-center border border-white">
                                  +{dayMeetings.length - 3}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {hasMeetings && (
                          <div className="mt-1 md:mt-2 space-y-1 flex-1 overflow-hidden">
                            {dayMeetings.slice(0, 2).map((meeting, idx) => (
                              <div 
                                key={idx}
                                className={`text-[10px] md:text-xs px-1 md:px-2 py-0.5 md:py-1 rounded-md md:rounded-lg truncate font-medium ${
                                  meeting.is_soon
                                    ? 'bg-red-100 text-red-700'
                                    : meeting.type === 'discussion'
                                    ? 'bg-blue-100 text-blue-700'
                                    : meeting.type === 'review'
                                    ? 'bg-orange-100 text-orange-700'
                                    : 'bg-emerald-100 text-emerald-700'
                                }`}
                              >
                                {format(new Date(meeting.meeting_date), 'HH:mm')}
                              </div>
                            ))}
                            {dayMeetings.length > 2 && (
                              <div className="text-[10px] md:text-xs text-gray-500 font-bold">
                                +{dayMeetings.length - 2} more
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Meetings List for Selected Date */}
        <div>
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-4 md:p-8 sticky top-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-8 gap-2">
              <div>
                <h3 className="text-lg md:text-2xl font-bold text-gray-900 uppercase tracking-tight">
                  {format(selectedDate, "EEEE")}
                </h3>
                <p className="text-gray-500 text-xs md:text-sm font-bold uppercase tracking-wider">
                  {format(selectedDate, "dd MMMM yyyy")}
                </p>
              </div>
              <span className="bg-orange-600 text-white text-xs font-bold px-3 md:px-4 py-1 md:py-2 rounded-full self-start md:self-auto">
                {selectedDateMeetings.length} MEETINGS
              </span>
            </div>

            {selectedDateMeetings.length === 0 ? (
              <div className="text-center py-6 md:py-12">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <span className="text-xl md:text-2xl text-gray-400">📅</span>
                </div>
                <h4 className="text-base md:text-lg font-bold text-gray-400 uppercase tracking-wide mb-1 md:mb-2">
                  NO MEETINGS
                </h4>
                <p className="text-gray-500 text-xs md:text-sm">
                  No meetings scheduled for this date
                </p>
              </div>
            ) : (
              <div className="space-y-4 md:space-y-6 max-h-[400px] overflow-y-auto">
                {selectedDateMeetings.map((meeting) => (
                  <div 
                    key={meeting.id}
                    className={`p-4 md:p-6 rounded-xl md:rounded-2xl border-2 cursor-pointer transition-all hover:shadow-lg ${
                      meeting.is_soon
                        ? 'border-red-200 hover:border-red-300 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setEditingMeeting(meeting);
                      setShowEditModal(true);
                    }}
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 md:gap-0 mb-3 md:mb-4">
                      <div className="flex flex-col gap-1 md:gap-2">
                        <span className={getStatusBadge(meeting)}>
                          {getTypeText(meeting.type)}
                        </span>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                          ID: {meeting.id}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg md:text-2xl font-bold text-gray-900">
                          {format(new Date(meeting.meeting_date), 'HH:mm')}
                        </div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">
                          {meeting.is_soon ? 'URGENT' : 'SCHEDULED'}
                        </div>
                      </div>
                    </div>

                    <h4 className="text-base md:text-xl font-bold text-gray-900 mb-2 md:mb-3 line-clamp-2">
                      {meeting.idea_title || "Committee Meeting"}
                    </h4>

                    <div className="flex flex-col md:flex-row md:items-center justify-between mt-4 md:mt-6 pt-3 md:pt-6 border-t border-gray-200 gap-2">
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                          COMMITTEE
                        </p>
                        <p className="text-sm font-bold text-gray-900">
                          {meeting.committee_name}
                        </p>
                      </div>
                      <button className="text-xs font-bold uppercase tracking-wide text-gray-900 border-b-2 border-gray-900 pb-1 hover:text-orange-600 hover:border-orange-600 transition-all">
                        VIEW DETAILS
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* My Ideas Tab Selector */}
      {activeTab === "myIdeas" && (
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-4 md:p-8">
          <div className="flex flex-col space-y-4 md:space-y-6">
            <div>
              <span className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2 md:mb-3 block">
                SELECT IDEA
              </span>
              <select
                value={selectedIdeaId}
                onChange={(e) => setSelectedIdeaId(e.target.value)}
                className="w-full p-3 md:p-4 border-2 border-gray-300 rounded-xl md:rounded-2xl bg-white text-gray-900 font-medium focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all text-sm md:text-base"
              >
                <option value="">CHOOSE AN IDEA</option>
                {userIdeas.map((idea) => (
                  <option key={idea.id} value={idea.id}>
                    {idea.title} • ID: {idea.id}
                  </option>
                ))}
              </select>
            </div>
            
            {selectedIdeaId && (
              <div className="flex flex-col md:flex-row md:items-center justify-between p-3 md:p-4 bg-gray-50 rounded-xl md:rounded-2xl gap-3">
                <div>
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">
                    SELECTED IDEA
                  </span>
                  <p className="text-base md:text-lg font-bold text-gray-900">
                    {userIdeas.find(i => i.id === selectedIdeaId)?.title}
                  </p>
                </div>
                <button
                  onClick={() => fetchIdeaMeetings(selectedIdeaId)}
                  className="px-4 md:px-6 py-2 md:py-3 bg-gray-800 text-white text-xs md:text-sm font-bold uppercase tracking-wide rounded-full hover:bg-orange-600 transition-all flex items-center space-x-2 md:space-x-3 self-start md:self-auto"
                >
                  <span>↻</span>
                  <span>REFRESH</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upcoming Meetings Summary */}
      <div className="bg-white border-2 border-gray-200 rounded-3xl p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-8 gap-3">
          <div>
            <h3 className="text-lg md:text-2xl font-bold text-gray-900 uppercase tracking-tight">
              UPCOMING MEETINGS SUMMARY
            </h3>
            <p className="text-gray-500 text-xs md:text-sm font-bold uppercase tracking-wider">
              {getActiveMeetings().length} TOTAL SCHEDULED SESSIONS
            </p>
          </div>
        </div>

        {getActiveMeetings().length === 0 ? (
          <div className="text-center py-8 md:py-12">
            <p className="text-gray-400 text-base md:text-lg font-bold uppercase tracking-wide">
              NO UPCOMING MEETINGS
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <table className="w-full min-w-[600px] md:min-w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 md:py-4 text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider">TIME</th>
                  <th className="text-left py-3 md:py-4 text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider">TITLE</th>
                  <th className="text-left py-3 md:py-4 text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider">COMMITTEE</th>
                  <th className="text-left py-3 md:py-4 text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider">TYPE</th>
                  <th className="text-left py-3 md:py-4 text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider">STATUS</th>
                  <th className="text-left py-3 md:py-4 text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {getActiveMeetings().slice(0, 5).map((meeting) => (
                  <tr key={meeting.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 md:py-4">
                      <div className="font-bold text-gray-900 text-sm md:text-base">
                        {format(new Date(meeting.meeting_date), 'HH:mm')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(meeting.meeting_date), 'dd MMM')}
                      </div>
                    </td>
                    <td className="py-3 md:py-4">
                      <div className="font-bold text-gray-900 line-clamp-1 text-sm md:text-base">
                        {meeting.idea_title}
                      </div>
                    </td>
                    <td className="py-3 md:py-4">
                      <div className="text-sm font-bold text-gray-700">
                        {meeting.committee_name}
                      </div>
                    </td>
                    <td className="py-3 md:py-4">
                      <span className={getStatusBadge(meeting)}>
                        {getTypeText(meeting.type)}
                      </span>
                    </td>
                    <td className="py-3 md:py-4">
                      <span className={`text-xs md:text-sm font-bold uppercase ${
                        meeting.is_soon ? 'text-red-700' : 'text-green-700'
                      }`}>
                        {meeting.is_soon ? 'URGENT' : 'SCHEDULED'}
                      </span>
                    </td>
                    <td className="py-3 md:py-4">
                      <button
                        onClick={() => {
                          setEditingMeeting(meeting);
                          setShowEditModal(true);
                        }}
                        className="px-3 md:px-4 py-1.5 md:py-2 bg-gray-800 text-white text-xs font-bold uppercase tracking-wide rounded-full hover:bg-orange-600 transition-all"
                      >
                        EDIT
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Meeting Modal - Responsive Compact Design */}
      {showEditModal && editingMeeting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 md:p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl md:rounded-3xl border-2 border-gray-200 max-w-full md:max-w-lg w-full mx-2 animate-in slide-in-from-bottom-10 duration-500 max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-tight">
                  EDIT SESSION
                </h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingMeeting(null);
                  }}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-100 hover:text-red-600 transition-all"
                >
                  <span className="text-lg md:text-xl">×</span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wide mb-1 md:mb-2 block">
                    SESSION TITLE
                  </label>
                  <div className="p-3 md:p-4 border-2 border-gray-200 rounded-xl md:rounded-2xl bg-gray-50">
                    <p className="text-base md:text-lg font-bold text-gray-900">
                      {editingMeeting.idea_title || "Committee Meeting"}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wide mb-1 md:mb-2 block">
                    DATE & TIME
                  </label>
                  <input
                    type="datetime-local"
                    value={editingMeeting.meeting_date}
                    onChange={(e) => setEditingMeeting({
                      ...editingMeeting,
                      meeting_date: e.target.value
                    })}
                    className="w-full p-3 md:p-4 border-2 border-gray-300 rounded-xl md:rounded-2xl bg-white text-gray-900 font-medium focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wide mb-1 md:mb-2 block">
                    SESSION TYPE
                  </label>
                  <div className="p-3 md:p-4 border-2 border-gray-200 rounded-xl md:rounded-2xl bg-gray-50">
                    <span className={getStatusBadge(editingMeeting)}>
                      {getTypeText(editingMeeting.type)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wide mb-1 md:mb-2 block">
                    MEETING LINK (OPTIONAL)
                  </label>
                  <input
                    type="url"
                    value={editingMeeting.meeting_link || ''}
                    onChange={(e) => setEditingMeeting({
                      ...editingMeeting,
                      meeting_link: e.target.value
                    })}
                    placeholder="https://meet.google.com/..."
                    className="w-full p-3 md:p-4 border-2 border-gray-300 rounded-xl md:rounded-2xl bg-white text-gray-900 font-medium focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wide mb-1 md:mb-2 block">
                    NOTES (OPTIONAL)
                  </label>
                  <textarea
                    value={editingMeeting.notes || ''}
                    onChange={(e) => setEditingMeeting({
                      ...editingMeeting,
                      notes: e.target.value
                    })}
                    rows="3"
                    placeholder="Add session notes, agenda items, or important information..."
                    className="w-full p-3 md:p-4 border-2 border-gray-300 rounded-xl md:rounded-2xl bg-white text-gray-900 font-medium focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all text-sm md:text-base resize-none"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6 pt-4 md:pt-6 border-t-2 border-gray-100">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingMeeting(null);
                  }}
                  className="px-4 md:px-6 py-2 md:py-3 border-2 border-gray-300 text-gray-700 text-xs md:text-sm font-bold uppercase tracking-wide rounded-full hover:bg-gray-100 transition-all"
                  disabled={saving}
                >
                  CANCEL
                </button>
                <button
                  onClick={updateMeeting}
                  disabled={saving}
                  className="px-4 md:px-6 py-2 md:py-3 bg-[#0F1115] text-white text-xs md:text-sm font-bold uppercase tracking-wide rounded-full hover:bg-orange-600 transition-all shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>UPDATING...</span>
                    </>
                  ) : (
                    <span>UPDATE SESSION</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingsTab;