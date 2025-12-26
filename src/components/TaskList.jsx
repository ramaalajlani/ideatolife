// src/components/TaskList.js - المحدث
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Plus, Trash2, Calendar } from "lucide-react";
import taskService from "../services/taskService";

export default function TaskList({ ganttId, onTaskUpdate }) {
  const { ideaId } = useParams(); // الحصول على ideaId من المسار
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      // استخدام الـ API الحالي: GET /api/gantt-charts/{gantt_id}/tasks
      const res = await taskService.getTasks(ganttId);
      setTasks(res.data || []);
    } catch (err) {
      console.error("خطأ في جلب المهام:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("هل أنت متأكد من حذف المهمة؟")) return;
    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
      if (onTaskUpdate) onTaskUpdate();
    } catch (err) {
      alert(err.message || "حدث خطأ أثناء الحذف");
    }
  };

  useEffect(() => {
    if (ganttId) fetchTasks();
  }, [ganttId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* زر إضافة مهمة */}
      <div className="mb-4">
        {/* الرابط الجديد: يحصل على ideaId و ganttId معاً */}
        <Link
          to={`/ideas/${ideaId}/gantt-charts/${ganttId}/tasks/add`}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition"
        >
          <Plus className="h-5 w-5 ml-2" />
          إضافة مهمة جديدة
        </Link>
      </div>

      {/* قائمة المهام */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">المهام ({tasks.length})</h4>
        
        {tasks.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">لا توجد مهام بعد</p>
            <p className="text-sm text-gray-500">أضف مهمة جديدة لبدء العمل</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div 
                key={task.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-start mb-2">
                      <h5 className="font-medium text-gray-900">{task.task_name}</h5>
                      {task.priority >= 4 && (
                        <span className="mr-3 px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                          عاجل
                        </span>
                      )}
                    </div>
                    
                    {task.description && (
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    )}
                    
                    <div className="flex items-center text-sm text-gray-500 space-x-4 rtl:space-x-reverse">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 ml-2" />
                        {new Date(task.start_date).toLocaleDateString('ar-SA')} → {new Date(task.end_date).toLocaleDateString('ar-SA')}
                      </span>
                      <span>الأولوية: {task.priority}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        task.progress_percentage >= 100 ? 'bg-green-100 text-green-800' :
                        task.progress_percentage > 0 ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        التقدم: {task.progress_percentage || 0}%
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}