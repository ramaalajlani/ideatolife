// src/hooks/useAutoRefresh.js
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIdeaRoadmap, fetchPlatformStages } from '../store/slices/roadmapSlice';

export const useAutoRefresh = (ideaId, interval =30000) => { // 30 ثانية
  const dispatch = useDispatch();
  const { autoRefreshEnabled } = useSelector(state => state.roadmap);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (autoRefreshEnabled) {
      // أول تحميل
      if (ideaId) {
        dispatch(fetchIdeaRoadmap(ideaId));
      } else {
        dispatch(fetchPlatformStages());
      }

      // إعداد التحديث التلقائي
      intervalRef.current = setInterval(() => {
        console.log('Auto-refreshing roadmap data...');
        if (ideaId) {
          dispatch(fetchIdeaRoadmap(ideaId));
        } else {
          dispatch(fetchPlatformStages());
        }
      }, interval);

      // تنظيف عند unmount
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [ideaId, dispatch, interval, autoRefreshEnabled]);

  return { autoRefreshEnabled };
};