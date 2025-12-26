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

const SidebarContext = createContext();

export default function Sidebar({ children, activeItem = 'home' }) {
  const [expanded, setExpanded] = useState(() => {
    const saved = localStorage.getItem('sidebar_expanded');
    return saved ? JSON.parse(saved) : true;
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('sidebar_expanded', JSON.stringify(expanded));
  }, [expanded]);

  // استخراج معرف الفكرة من المسار
  const getIdeaIdFromPath = () => {
    const path = location.pathname;
    const ideaMatch = path.match(/\/ideas\/(\d+)/);
    return ideaMatch ? ideaMatch[1] : null;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('sidebar_expanded');
    navigate('/');
  };

  return (
    <div className={`fixed left-0 top-0 h-screen bg-gray-900 border-r border-gray-700 shadow-lg transition-all duration-300 z-50 ${
      expanded ? 'w-64' : 'w-20'
    }`}>
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
        <SidebarContext.Provider value={{ expanded, activeItem, ideaId: getIdeaIdFromPath() }}>
          <ul className="flex flex-col py-4 space-y-2 px-3">
            {children}
          </ul>
        </SidebarContext.Provider>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-700 bg-gray-900 p-4">
        <div className={`flex items-center ${expanded ? 'justify-between' : 'justify-center'}`}>
          <div className={`flex items-center ${expanded ? 'w-full' : ''}`}>
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-md">
              <User size={16} className="text-white" />
            </div>
            {expanded && (
              <div className="ml-3 flex-1 overflow-hidden">
                <div className="text-sm font-semibold text-white truncate">المستخدم</div>
                <div className="text-xs text-gray-400 truncate">صاحب فكرة</div>
              </div>
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
  
  // استخدام معرف الفكرة من السياق أو الـ prop
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