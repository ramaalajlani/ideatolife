import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import MainLayout from './MainLayout';

const LayoutWrapper = ({ children, activeItem = null }) => {
  const { ideaId } = useParams();
  const location = useLocation();
  
  const getActiveItemFromPath = () => {
    // إذا تم تمرير activeItem كـ prop، استخدمه
    if (activeItem) return activeItem;
    
    // خلاف ذلك، حدده من المسار
    const path = location.pathname;
    const routePatterns = [
      { pattern: '/ideas/.*/reports', value: 'reports' },
      { pattern: '/ideas/.*/roadmap', value: 'roadmap' },
      { pattern: '/ideas/.*/meetings', value: 'meetings' },
      { pattern: '/ideas/.*/funding', value: 'funding' },
      { pattern: '/ideas/.*/business-model', value: 'business-model' },
      { pattern: '/ideas/.*/gantt', value: 'gantt' },
      { pattern: '/ideas/.*/gantt/phases/add', value: 'gantt' },
      { pattern: '/gantt-charts/.*/tasks/add', value: 'gantt' },
      { pattern: '/ideas/.*/gantt/chart', value: 'gantt' },
      { pattern: '/ideas/.*/edit', value: 'submit-idea' },
      { pattern: '/ideas/.*/new', value: 'submit-idea' },
      { pattern: '/profile', value: 'profile' },
      { pattern: '/timeline', value: 'timeline' },
      { pattern: '/meetings', value: 'meetings' },
      { pattern: '/funding', value: 'funding' },
      { pattern: '/business-model', value: 'business-model' },
      { pattern: '/submit-idea', value: 'submit-idea' },
      { pattern: '/gantt', value: 'gantt' },
      { pattern: '/ideas', value: 'home' },
      { pattern: '/register', value: 'home' },
      { pattern: '/prodify', value: 'home' },
      { pattern: '/lets-start', value: 'home' },
      { pattern: '/', value: 'home' }
    ];
    
    for (const route of routePatterns) {
      const regex = new RegExp(route.pattern.replace('.*', '.*'));
      if (regex.test(path)) return route.value;
    }
    
    return 'home';
  };

  return (
    <MainLayout ideaId={ideaId} activeItem={getActiveItemFromPath()}>
      {children}
    </MainLayout>
  );
};

export default LayoutWrapper;