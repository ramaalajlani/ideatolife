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

  // دالة badge لحالة الاجتماع (حسب منطق الكود الخاص بك)
  const getStatusBadge = (meeting) => {
    const base = "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ";
    const typeConfig = {
      discussion: "bg-blue-50 text-blue-700 border-blue-200",
      review: "bg-orange-50 text-orange-700 border-orange-200",
      evaluation: "bg-emerald-50 text-emerald-700 border-emerald-200",
      other: "bg-gray-50 text-gray-700 border-gray-200"
    };
    return base + (typeConfig[meeting.type] || typeConfig.other);
  };

  // Fetch user ideas (نفس منطق كودك)
  const fetchUserIdeas = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('committee_token');
      if (!token) throw new Error("Authentication required");

      const response = await axios.get("http://localhost:8000/api/committee/ideas", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data?.ideas) {
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
        setMeetings(formattedIdeas.flatMap(i => i.meetings));
      }
      setError(null);
    } catch (err) {
      setError("Failed to fetch ideas and meetings");
    } finally {
      setLoading(false);
    }
  };

  const fetchIdeaMeetings = (ideaId) => {
    if (!ideaId) return setMyIdeasMeetings([]);
    const idea = userIdeas.find(i => i.id === parseInt(ideaId));
    setMyIdeasMeetings(idea?.meetings || []);
  };

  const updateMeeting = async () => {
    if (!editingMeeting) return;
    try {
      setSaving(true);
      const token = localStorage.getItem('committee_token');
      await axios.put(`http://localhost:8000/api/committee/meetings/${editingMeeting.id}`, 
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
    } catch (err) {
      alert("Failed to update meeting");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => { fetchUserIdeas(); }, []);
  useEffect(() => { 
    if(activeTab === 'myIdeas') fetchIdeaMeetings(selectedIdeaId); 
  }, [selectedIdeaId, activeTab, userIdeas]);

  const getActiveMeetings = () => activeTab === 'committee' ? meetings : myIdeasMeetings;
  const getMeetingsForDate = (date) => getActiveMeetings().filter(m => isSameDay(new Date(m.meeting_date), date));

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate));
    const end = endOfWeek(endOfMonth(currentDate));
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  if (loading && activeTab === 'committee') {
    return (
      <div className="flex flex-col justify-center items-center h-96 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600"></div>
        <p className="text-gray-400 font-black text-xs uppercase tracking-widest">Loading Schedule</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-6">
      <div className="max-w-7xl mx-auto space-y-6 px-4">
        
        {/* Header - التصميم الأصفر الفخم */}
        <div className="bg-[#FFD586] rounded-[2rem] shadow-sm p-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 flex-shrink-0 bg-white/40 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                📅
              </div>
              <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Meeting Calendar</h1>
                <p className="text-gray-800 font-medium mt-1 opacity-80">Track and manage your committee evaluations</p>
                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={() => setActiveTab('committee')}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-wider ${activeTab === 'committee' ? 'bg-gray-900 text-white shadow-lg' : 'bg-white/50 text-gray-700 hover:bg-white'}`}
                  >
                    Committee View
                  </button>
                  <button 
                    onClick={() => setActiveTab('myIdeas')}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-wider ${activeTab === 'myIdeas' ? 'bg-gray-900 text-white shadow-lg' : 'bg-white/50 text-gray-700 hover:bg-white'}`}
                  >
                    My Filtered Ideas
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
               <button onClick={fetchUserIdeas} className="bg-white/80 px-4 py-2 rounded-xl hover:bg-white border border-gray-200 transition-all font-bold text-xs uppercase tracking-tight">Sync</button>
               <div className="bg-white/90 px-5 py-2 rounded-xl border border-gray-200 font-black text-gray-800 shadow-sm text-xs">
                 {getActiveMeetings().length} Total
               </div>
            </div>
          </div>
        </div>

        {/* Idea Select - يظهر فقط في تبويب الفلترة */}
        {activeTab === 'myIdeas' && (
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-4 animate-in fade-in duration-300">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Filter by Idea:</span>
            <select 
              className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 outline-none shadow-sm focus:ring-2 focus:ring-orange-400"
              value={selectedIdeaId}
              onChange={e => setSelectedIdeaId(e.target.value)}
            >
              <option value="">-- Choose an idea --</option>
              {userIdeas.map(i => <option key={i.id} value={i.id}>{i.title}</option>)}
            </select>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* العمود الأيسر: التقويم */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Monthly Schedule</h2>
                <div className="flex bg-gray-50 rounded-xl p-1 gap-1 border border-gray-100">
                  <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg font-bold">←</button>
                  <button onClick={() => { setCurrentDate(new Date()); setSelectedDate(new Date()); }} className="px-4 text-[10px] font-black uppercase text-gray-500 hover:text-orange-600 transition-colors">Today</button>
                  <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg font-bold">→</button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="py-2 text-[10px] font-black text-gray-300 uppercase text-center tracking-widest">{d}</div>
                ))}
                {calendarDays.map((day, idx) => {
                  const dayMeetings = getMeetingsForDate(day);
                  const isSel = isSameDay(day, selectedDate);
                  const isCurrMonth = isSameMonth(day, currentDate);

                  return (
                    <div 
                      key={idx} 
                      onClick={() => setSelectedDate(day)}
                      className={`min-h-[110px] p-3 rounded-2xl cursor-pointer transition-all border
                        ${isSel ? 'bg-orange-50 border-orange-400 ring-4 ring-orange-50 shadow-sm' : 'bg-white border-gray-50 hover:border-gray-200'}
                        ${!isCurrMonth ? 'opacity-20' : 'opacity-100'}`}
                    >
                      <div className={`text-sm font-black mb-2 ${isToday(day) ? 'text-orange-600' : 'text-gray-900'}`}>
                        {format(day, 'd')}
                      </div>
                      <div className="space-y-1">
                        {dayMeetings.slice(0, 2).map(m => (
                          <div key={m.id} className="h-1.5 w-full bg-orange-400 rounded-full"></div>
                        ))}
                        {dayMeetings.length > 2 && <div className="text-[9px] font-black text-orange-600">+{dayMeetings.length - 2}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* العمود الأيمن: قائمة الاجتماعات لليوم المختار */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
              <div className="mb-6 pb-4 border-b border-gray-50">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Selected Date</p>
                <h3 className="text-xl font-black text-gray-900">{format(selectedDate, 'EEEE, MMM do')}</h3>
              </div>
              
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {getMeetingsForDate(selectedDate).length > 0 ? (
                  getMeetingsForDate(selectedDate).map(meeting => (
                    <div key={meeting.id} className="group bg-gray-50 rounded-2xl p-5 border border-transparent hover:border-orange-200 hover:bg-white transition-all shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <span className={getStatusBadge(meeting)}>{meeting.type}</span>
                        <button 
                          onClick={() => { setEditingMeeting({...meeting}); setShowEditModal(true); }}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-gray-400 hover:text-orange-600 shadow-sm transition-colors"
                        >✎</button>
                      </div>
                      <h4 className="font-black text-gray-900 leading-tight text-md mb-3">{meeting.idea_title}</h4>
                      <div className="space-y-2 text-xs font-bold text-gray-500">
                        <div className="flex items-center gap-2">🕒 {format(new Date(meeting.meeting_date), 'p')}</div>
                        {meeting.meeting_link && (
                          <a href={meeting.meeting_link} target="_blank" rel="noreferrer" className="inline-block mt-2 text-blue-600 font-black hover:underline">🔗 Session Link</a>
                        )}
                        {meeting.notes && (
                          <p className="mt-2 text-gray-400 italic font-medium leading-relaxed">" {meeting.notes} "</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <p className="text-gray-400 font-black text-xs uppercase">No meetings</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* مودال التعديل */}
      {showEditModal && editingMeeting && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Edit Session</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Meeting Date & Time</label>
                <input type="datetime-local" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 font-bold outline-none focus:border-orange-400 transition-all" value={format(new Date(editingMeeting.meeting_date), "yyyy-MM-dd'T'HH:mm")} onChange={e => setEditingMeeting({...editingMeeting, meeting_date: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">URL Link</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 font-bold outline-none focus:border-orange-400 transition-all" value={editingMeeting.meeting_link || ""} onChange={e => setEditingMeeting({...editingMeeting, meeting_link: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Notes</label>
                <textarea rows="3" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 font-bold outline-none focus:border-orange-400 transition-all" value={editingMeeting.notes || ""} onChange={e => setEditingMeeting({...editingMeeting, notes: e.target.value})} />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowEditModal(false)} className="flex-1 py-4 rounded-2xl font-black text-gray-400 bg-gray-50 hover:bg-gray-100 transition-all uppercase text-[10px] tracking-widest">Cancel</button>
                <button onClick={updateMeeting} disabled={saving} className="flex-1 py-4 rounded-2xl font-black text-white bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all uppercase text-[10px] tracking-widest">
                   {saving ? "Saving..." : "Save Changes"}
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