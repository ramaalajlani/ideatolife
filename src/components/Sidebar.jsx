import React, { useState, createContext, useContext, useEffect } from 'react';
import { 
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Calendar,
  BarChart3,
  Map,
  Home
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import profileService from '../services/profileService'; // تأكد من المسار الصحيح

const SidebarContext = createContext();

export default function Sidebar({ children, activeItem = 'home' }) {
  const [expanded, setExpanded] = useState(() => {
    const saved = localStorage.getItem('sidebar_expanded');
    return saved ? JSON.parse(saved) : true;
  });
  
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('userData');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [loading, setLoading] = useState(!userData);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('sidebar_expanded', JSON.stringify(expanded));
  }, [expanded]);

  // جلب بيانات المستخدم عند تحميل المكون
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!userData) {
          setLoading(true);
          const response = await profileService.getProfile();
          
          const userProfile = {
            name: response.idea_owner?.name || "المستخدم",
            email: response.idea_owner?.email || "",
            profile_image: response.idea_owner?.profile_image || null,
            role: response.idea_owner?.role || "صاحب فكرة",
            phone: response.idea_owner?.phone || ""
          };
          
          setUserData(userProfile);
          localStorage.setItem('userData', JSON.stringify(userProfile));
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        const defaultUser = {
          name: "المستخدم",
          email: "",
          profile_image: null,
          role: "صاحب فكرة",
          phone: ""
        };
        setUserData(defaultUser);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userData]);

  const getIdeaIdFromPath = () => {
    const path = location.pathname;
    const ideaMatch = path.match(/\/ideas\/(\d+)/);
    return ideaMatch ? ideaMatch[1] : null;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userData');
    localStorage.removeItem('sidebar_expanded');
    navigate('/');
  };

  const updateUserData = (updatedData) => {
    const newData = { ...userData, ...updatedData };
    setUserData(newData);
    localStorage.setItem('userData', JSON.stringify(newData));
  };

  return (
    <div className={`fixed left-0 top-0 h-screen bg-gray-900 border-r border-gray-700 shadow-lg transition-all duration-300 z-50 ${
      expanded ? 'w-64' : 'w-20'
    }`}>
      
      {/* اللوغو أعلى الـ Sidebar */}
      <div 
        className="flex flex-col items-start cursor-pointer select-none p-4 border-b border-gray-700"
        onClick={() => navigate("/")}
      >
        {expanded ? (
          <>
            <span className="text-3xl font-black text-[#f87115] tracking-[ -0.05em] leading-[0.8]">
              Idea
            </span>
            <div className="bg-[#f87115] px-1.5 py-0.5 rounded-[2px] mt-0.5 ml-5">
              <span className="text-white text-lg font-black tracking-tighter leading-none">
                2Life
              </span>
            </div>
          </>
        ) : (
          <span className="text-2xl font-black text-[#f87115]">I2</span> // اختصار اللوغو عند الطي
        )}
      </div>

      {/* زر توسيع/طي القائمة */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 rounded-lg hover:bg-orange-500 transition-colors text-gray-300 hover:text-white"
          aria-label={expanded ? "طي القائمة" : "توسيع القائمة"}
        >
          {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      
      <div className="overflow-y-auto h-[calc(100vh-120px)] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        <SidebarContext.Provider value={{ 
          expanded, 
          activeItem, 
          ideaId: getIdeaIdFromPath(),
          userData,
          updateUserData 
        }}>
          <ul className="flex flex-col py-4 space-y-2 px-3">
            {children}
          </ul>
        </SidebarContext.Provider>
      </div>
      
      {/* قسم معلومات المستخدم */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-700 bg-gray-900 p-4">
        <div className={`flex items-center ${expanded ? 'justify-between' : 'justify-center'}`}>
          <div className={`flex items-center ${expanded ? 'w-full' : ''}`}>
            {loading ? (
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse"></div>
                {expanded && (
                  <div className="ml-3 flex-1">
                    <div className="h-4 bg-gray-700 rounded w-24 animate-pulse"></div>
                    <div className="h-3 bg-gray-700 rounded w-16 mt-1 animate-pulse"></div>
                  </div>
                )}
              </div>
            ) : (
              <>
                {userData?.profile_image ? (
                  <img 
                    src={`http://127.0.0.1:8000${userData.profile_image}`} 
                    alt={userData.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-orange-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-md">
                    <User size={16} className="text-white" />
                  </div>
                )}
                
                {expanded && (
                  <div className="ml-3 flex-1 overflow-hidden">
                    <div className="text-sm font-semibold text-white truncate">
                      {userData?.name || "المستخدم"}
                    </div>
                    <div className="text-xs text-gray-400 truncate">
                      {userData?.role || "صاحب فكرة"}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
          {expanded && (
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-orange-500 rounded-lg transition-colors text-gray-300 hover:text-white ml-2"
              title="تسجيل الخروج"
              aria-label="تسجيل الخروج"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// بقية SidebarItem و SidebarItemsList كما هي بدون أي تغييرات
export function SidebarItem({ icon, text, name, active, alert, badge, onClick, ideaId }) {
  const { expanded } = useContext(SidebarContext);

  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) {
      onClick(name, ideaId);
    }
  };

  return (
    <li>
      <button
        onClick={handleClick}
        className={`
          relative flex items-center w-full p-3 rounded-xl transition-all duration-200 group
          focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-gray-900
          ${active 
            ? 'bg-orange-500 text-white shadow-md' 
            : 'text-gray-300 hover:bg-orange-500 hover:text-white hover:shadow-md'
          }
          ${expanded ? 'justify-start pl-4 pr-3' : 'justify-center px-3'}
        `}
        aria-current={active ? "page" : undefined}
        aria-label={expanded ? text : `${text} ${badge ? `(${badge})` : ''}`}
      >
        <div className={`flex items-center justify-center min-w-5 ${
          active ? 'text-white' : 'text-gray-400 group-hover:text-white'
        }`}>
          {icon}
        </div>
        
        {expanded && (
          <>
            <span className="ml-3 text-sm font-medium truncate flex-1 text-right">
              {text}
            </span>
            {badge && (
              <span className="ml-2 px-2 py-1 text-xs bg-orange-500 text-white rounded-full min-w-6 flex items-center justify-center">
                {badge}
              </span>
            )}
          </>
        )}
        
        {alert && (
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-orange-500 border-2 border-gray-900 animate-pulse"></div>
        )}
        
        {!expanded && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg pointer-events-none">
            {text}
            {badge && ` (${badge})`}
          </div>
        )}
      </button>
    </li>
  );
}

export function SidebarItemsList({ activeItem, currentIdeaId }) {
  const { ideaId: contextIdeaId } = useContext(SidebarContext);
  const navigate = useNavigate();
  
  const targetIdeaId = currentIdeaId || contextIdeaId;

  const handleItemClick = (name, specificIdeaId = null) => {
    const ideaIdToUse = specificIdeaId || targetIdeaId;
    
    const routes = {
      'home': '/',
      'profile': '/profile',
      'timeline': ideaIdToUse ? `/ideas/${ideaIdToUse}/roadmap` : '/timeline',
      'reports': ideaIdToUse ? `/ideas/${ideaIdToUse}/reports` : '/reports',
      'meetings': ideaIdToUse ? `/ideas/${ideaIdToUse}/meetings` : '/meetings',
    };

    if (routes[name]) {
      navigate(routes[name]);
    }
  };

  return (
    <>
      <SidebarItem 
        icon={<Home size={20} />}
        text="Home" 
        name="home"
        active={activeItem === 'home'}
        onClick={handleItemClick}
      />
      
      <SidebarItem 
        icon={<User size={20} />}
        text="Account" 
        name="profile"
        active={activeItem === 'profile'}
        onClick={handleItemClick}
      />
      
      <SidebarItem 
        icon={<Map size={20} />}
        text="RoadMap" 
        name="timeline"
        active={activeItem === 'timeline' || activeItem === 'roadmap'}
        onClick={handleItemClick}
        ideaId={targetIdeaId}
      />
      
      <SidebarItem 
        icon={<BarChart3 size={20} />}
        text="Reports"
        name="reports"
        active={activeItem === 'reports'}
        onClick={handleItemClick}
        ideaId={targetIdeaId}
      />
      
      <SidebarItem 
        icon={<Calendar size={20} />}
        text="Meetings"
        name="meetings"
        active={activeItem === 'meetings'}
        onClick={handleItemClick}
        ideaId={targetIdeaId}
        alert={true}
      />
    </>
  );
}
