import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar, { SidebarItemsList } from './Sidebar';

export default function MainLayout({ children, ideaId = null, activeItem = 'home' }) {
  const navigate = useNavigate();
  const { ideaId: paramIdeaId } = useParams();
  
  // استخدام معرف الفكرة من الـ params أو الـ prop
  const targetIdeaId = paramIdeaId || ideaId;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeItem={activeItem}>
        <SidebarItemsList 
          activeItem={activeItem}
          currentIdeaId={targetIdeaId}
        />
      </Sidebar>
      <div className="flex-1 ml-20 lg:ml-64 transition-all duration-300">
        <main className="p-4 md:p-6">
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
