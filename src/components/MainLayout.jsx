import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar, { SidebarItemsList } from './Sidebar';

export default function MainLayout({ children, ideaId = null, activeItem = 'home' }) {
  const navigate = useNavigate();
  const { ideaId: paramIdeaId } = useParams();
  
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
        <main className="pt-0 pr-0 pb-0 pl-4 md:pl-6">
          <div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
