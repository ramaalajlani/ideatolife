// src/pages/dashboardcommit/RegisterCommitteeMember.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // استيراد useNavigate

const RegisterCommitteeMember = () => {
  const navigate = useNavigate(); // تهيئة دالة التنقل
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role_in_committee: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const committeeRoles = [
    { value: "economist", label: "خبير اقتصادي" },
    { value: "market", label: "خبير تسويقي" },
    { value: "legal", label: "خبير قانوني" },
    { value: "technical", label: "خبير تقني" },
    { value: "investor", label: "خبير استثماري" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/register/committee-member",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setSuccess("تم تسجيل عضو اللجنة بنجاح!");
        
        // تخزين التوكن والمعلومات الأخرى
        const token = response.data.token;
        localStorage.setItem('committee_token', token);
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
        
        // الانتقال إلى داش بورد اللجنة بعد تأخير قصير لإظهار رسالة النجاح
        setTimeout(() => {
          navigate("/committee-dashboard"); // الانتقال إلى داش بورد اللجنة
        }, 1500);
        
        // إعادة تعيين النموذج
        setFormData({
          name: "",
          email: "",
          password: "",
          role_in_committee: "",
        });
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "حدث خطأ أثناء التسجيل");
      } else if (err.request) {
        setError("لا يوجد اتصال بالسيرفر");
      } else {
        setError("حدث خطأ غير متوقع");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            تسجيل عضو لجنة جديدة
          </h1>
          <p className="text-gray-600">
            قم بتسجيل عضو جديد في لجنة التحكيم
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center justify-between">
            <span>{success}</span>
            <div className="flex items-center text-sm">
              <svg className="animate-spin h-4 w-4 mr-2 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              جاري التحويل إلى لوحة التحكم...
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* حقل الاسم */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                الاسم الكامل
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="أدخل الاسم الكامل"
                disabled={loading}
              />
            </div>

            {/* حقل الإيميل */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="example@domain.com"
                disabled={loading}
              />
            </div>

            {/* حقل كلمة المرور */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                كلمة المرور
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="أدخل كلمة مرور قوية"
                disabled={loading}
              />
              <p className="mt-1 text-sm text-gray-500 text-right">
                يجب أن تكون كلمة المرور 6 أحرف على الأقل
              </p>
            </div>

            {/* حقل الدور في اللجنة */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                الدور في اللجنة
              </label>
              <select
                name="role_in_committee"
                value={formData.role_in_committee}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-right appearance-none"
                disabled={loading}
              >
                <option value="" disabled>
                  اختر دور عضو اللجنة
                </option>
                {committeeRoles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            {/* زر التسجيل */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جاري التسجيل...
                </span>
              ) : (
                "تسجيل عضو اللجنة"
              )}
            </button>

            {/* رابط العودة */}
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => navigate("/committee-dashboard")}
                className="inline-block px-6 py-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                disabled={loading}
              >
                ← العودة إلى لوحة التحكم
              </button>
            </div>
          </div>
        </form>

        {/* معلومات إضافية */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-3 text-right">
            معلومات حول أدوار اللجنة:
          </h3>
          <ul className="space-y-2 text-right text-gray-600">
            <li>• <span className="font-medium">الخبير الاقتصادي:</span> يقوم بتقييم الجدوى الاقتصادية للمشروع</li>
            <li>• <span className="font-medium">الخبير التسويقي:</span> يقوم بتحليل السوق واستراتيجية التسويق</li>
            <li>• <span className="font-medium">الخبير القانوني:</span> يقوم بالمراجعة القانونية للفكرة</li>
            <li>• <span className="font-medium">الخبير التقني:</span> يقوم بتقييم الجانب التقني والتنفيذي</li>
            <li>• <span className="font-medium">الخبير الاستثماري:</span> يقوم بتقييم العائد الاستثماري والمخاطر</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RegisterCommitteeMember;