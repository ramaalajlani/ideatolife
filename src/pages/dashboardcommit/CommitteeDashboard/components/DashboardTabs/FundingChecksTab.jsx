// src/pages/dashboardcommit/CommitteeDashboard/components/DashboardTabs/FundingChecksTab.jsx
import React, { useState, useEffect } from "react";

const FundingChecksTab = () => {
  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchChecks = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/committee/funding-checks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (res.ok && data.checks) {
          setChecks(data.checks);
        } else {
          setMessage(data.message || "لا توجد شيكات حالياً.");
        }
      } catch (err) {
        console.error(err);
        setMessage("حدث خطأ أثناء جلب الشيكات.");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchChecks();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">⏳ جاري تحميل الشيكات...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">الشيكات / المعاملات المالية</h2>
            <p className="text-gray-600">عرض وتتبع جميع المعاملات المالية المرتبطة بالأفكار</p>
          </div>
          <span className="text-3xl">🧾</span>
        </div>
      </div>

      {message && (
        <div className="bg-blue-50 text-blue-800 p-4 rounded-lg">
          {message}
        </div>
      )}

      {checks.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-6 text-right text-sm font-medium text-gray-700">الفكرة</th>
                  <th className="py-3 px-6 text-right text-sm font-medium text-gray-700">صاحب الفكرة</th>
                  <th className="py-3 px-6 text-right text-sm font-medium text-gray-700">المستثمر</th>
                  <th className="py-3 px-6 text-right text-sm font-medium text-gray-700">المبلغ</th>
                  <th className="py-3 px-6 text-right text-sm font-medium text-gray-700">من</th>
                  <th className="py-3 px-6 text-right text-sm font-medium text-gray-700">إلى</th>
                  <th className="py-3 px-6 text-right text-sm font-medium text-gray-700">تاريخ الدفع</th>
                  <th className="py-3 px-6 text-right text-sm font-medium text-gray-700">طريقة الدفع</th>
                  <th className="py-3 px-6 text-right text-sm font-medium text-gray-700">ملاحظات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {checks.map((tx, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{tx.idea_title || "—"}</div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {tx.idea_owner || "—"}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {tx.investor || "—"}
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-900">
                      {tx.amount} $
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {tx.from}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {tx.to}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {tx.date}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                        {tx.payment_method}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {tx.notes || "—"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="text-5xl mb-4">🧾</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">لا توجد معاملات مالية</h3>
          <p className="text-gray-600">لم يتم تسجيل أي معاملات مالية حتى الآن</p>
        </div>
      )}
    </div>
  );
};

export default FundingChecksTab;