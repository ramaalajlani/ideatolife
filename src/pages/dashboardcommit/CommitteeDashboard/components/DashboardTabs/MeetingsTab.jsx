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
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("committee");
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // دالة badge لحالة الاجتماع
  const getStatusBadge = (meeting) => {
    const base = "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border ";
    const typeConfig = {
      'discussion': "bg-blue-50 text-blue-700 border-blue-200",
      'review': "bg-orange-50 text-orange-700 border-orange-200",
      'evaluation': "bg-emerald-50 text-emerald-700 border-emerald-200",
      'other': "bg-gray-50 text-gray-700 border-gray-200"
    };
    return base + (typeConfig[meeting.type] || typeConfig.other);
  };

  const fetchUserIdeas = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('committee_token');
      if (!token) throw new Error("Authentication required");

      const response = await axios.get("http://localhost:8000/api/committee/ideas", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && response.data.ideas) {
        const formattedIdeas = response.data.ideas.map(i => ({
          id: i.idea_id,
          title: i.title,
          meetings: i.meetings.map(m => ({
            id: m.meeting_id,
            meeting_date: m.meeting_date,
            meeting_link: m.meeting_link,
            notes: m.notes,
            type: m.type,
            idea_title: i.title
          })),
          owner: i.idea_owner
        }));

        setUserIdeas(formattedIdeas);
        const allMeetings = formattedIdeas.flatMap(i => i.meetings);
        setMeetings(allMeetings);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching ideas:", err);
      setError("Failed to fetch ideas and meetings");
    } finally {
      setLoading(false);
    }
  };

  const fetchIdeaMeetings = (ideaId) => {
    if (!ideaId) return setMyIdeasMeetings([]);
    const idea = userIdeas.find(i => i.id === ideaId);
    setMyIdeasMeetings(idea?.meetings || []);
  };

  const updateMeeting = async () => {
    if (!editingMeeting) return;

    // Simple validation
    if (editingMeeting.meeting_link && !/^https?:\/\/.+/.test(editingMeeting.meeting_link)) {
      alert("Enter a valid URL for meeting link.");
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('committee_token');
      await axios.put(
        `http://localhost:8000/api/committee/meetings/${editingMeeting.id}`,
        {
          meeting_date: editingMeeting.meeting_date || null,
          meeting_link: editingMeeting.meeting_link || null,
          notes: editingMeeting.notes || null
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchUserIdeas();
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

  useEffect(() => { fetchUserIdeas(); }, []);
  useEffect(() => {
    if (activeTab === 'myIdeas') fetchIdeaMeetings(selectedIdeaId);
  }, [selectedIdeaId, activeTab, userIdeas]);

  const getActiveMeetings = () => activeTab === 'committee' ? meetings : myIdeasMeetings;
  const getMeetingsForDate = (date) => getActiveMeetings().filter(m => isSameDay(new Date(m.meeting_date), date));

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentDate]);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => { setCurrentDate(new Date()); setSelectedDate(new Date()); };

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
          onClick={fetchUserIdeas}
          className="mt-6 md:mt-10 px-8 md:px-12 py-3 md:py-4 bg-[#0F1115] text-white text-sm font-bold uppercase tracking-wide rounded-full hover:bg-orange-600 transition-all shadow-lg"
        >
          RETRY SYNC
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 space-y-8 md:space-y-12">
      {/* Tabs */}
      <div className="flex space-x-4">
        <button className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'committee' ? 'bg-orange-600 text-white' : 'bg-gray-200'}`} onClick={() => setActiveTab('committee')}>Committee Meetings</button>
        <button className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'myIdeas' ? 'bg-orange-600 text-white' : 'bg-gray-200'}`} onClick={() => setActiveTab('myIdeas')}>My Ideas</button>
      </div>

      {activeTab === 'myIdeas' && (
        <div className="mt-4">
          <select className="border border-gray-300 rounded-lg px-4 py-2" value={selectedIdeaId} onChange={e => setSelectedIdeaId(e.target.value)}>
            <option value="">Select Idea</option>
            {userIdeas.map(i => <option key={i.id} value={i.id}>{i.title}</option>)}
          </select>
        </div>
      )}

      {/* Calendar */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <button onClick={handlePrevMonth}>Prev</button>
          <button onClick={handleToday}>Today</button>
          <button onClick={handleNextMonth}>Next</button>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center">
          {weekDays.map(day => <div key={day} className="font-bold">{day}</div>)}
          {calendarDays.map(day => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isSelected = isSameDay(day, selectedDate);
            const hasMeeting = getMeetingsForDate(day).length > 0;
            return (
              <div key={day.toString()} className={`p-2 border rounded cursor-pointer ${isSelected ? 'bg-orange-200' : ''} ${!isCurrentMonth ? 'text-gray-400' : ''}`} onClick={() => setSelectedDate(day)}>
                <div>{format(day, "d")}</div>
                {hasMeeting && <div className="w-2 h-2 bg-blue-600 rounded-full mx-auto mt-1"></div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Meetings list */}
      <div className="mt-8">
        {selectedDateMeetings.length === 0 ? (
          <p className="text-gray-500">No meetings for this day.</p>
        ) : (
          selectedDateMeetings.map(meeting => (
            <div key={meeting.id} className="border p-4 rounded mb-4">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-bold">{meeting.idea_title}</h4>
                  <p>{format(new Date(meeting.meeting_date), "PPPpp")}</p>
                  <p className={getStatusBadge(meeting)}>{meeting.type.toUpperCase()}</p>
                  {meeting.meeting_link && <a href={meeting.meeting_link} className="text-blue-500">Join Link</a>}
                  {meeting.notes && <p className="mt-2">{meeting.notes}</p>}
                </div>
                <button className="px-3 py-1 bg-orange-600 text-white rounded" onClick={() => { setEditingMeeting({...meeting}); setShowEditModal(true); }}>Edit</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingMeeting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="font-bold text-lg mb-4">Edit Meeting</h3>
            <label className="block mb-2">Date & Time</label>
            <input type="datetime-local" value={format(new Date(editingMeeting.meeting_date), "yyyy-MM-dd'T'HH:mm")} onChange={e => setEditingMeeting({...editingMeeting, meeting_date: e.target.value})} className="border p-2 w-full rounded mb-4" />
            <label className="block mb-2">Meeting Link</label>
            <input type="text" value={editingMeeting.meeting_link || ""} onChange={e => setEditingMeeting({...editingMeeting, meeting_link: e.target.value})} className="border p-2 w-full rounded mb-4" />
            <label className="block mb-2">Notes</label>
            <textarea value={editingMeeting.notes || ""} onChange={e => setEditingMeeting({...editingMeeting, notes: e.target.value})} className="border p-2 w-full rounded mb-4" />
            <div className="flex justify-end space-x-2">
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="px-4 py-2 bg-orange-600 text-white rounded" onClick={updateMeeting} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingsTab;
