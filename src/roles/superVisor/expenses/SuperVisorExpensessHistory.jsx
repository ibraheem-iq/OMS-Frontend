import React, { useState } from "react";
import { Table, message } from "antd"; // Import Ant Design components
import { Link } from "react-router-dom"; // Import Link
import "./SuperVisorExpensesHistory.css"; // Import CSS for styling
import TextFieldForm from "./../../../reusable elements/ReuseAbleTextField.jsx"; // Reusable form component
import expensesData from "./../../../data/expensess.json"; // Sample data for expenses
import useAuthStore from "./../../../store/store"; // Import sidebar state for dynamic class handling

export default function SuperVisorExpensesHistory() {
  const { isSidebarCollapsed } = useAuthStore(); // Access sidebar collapse state
  const [filterData, setFilterData] = useState({});
  const [expensesList, setExpensesList] = useState(expensesData);

  const fields = [
    {
      name: "الحالة",
      label: "الحالة",
      placeholder: "",
      type: "dropdown", // Changed to dropdown for better UX
      options: [
        { value: "جازت", label: "جازت" },
        { value: "أرجعت للمشرف", label: "أرجعت للمشرف" },
        { value: "قيد المراجعة", label: "قيد المراجعة" },
        { value: "قيد التنسيقات", label: "قيد التنسيقات" },
      ],
    },
    {
      name: "الرقم التسلسلي",
      label: "رقم الطلب",
      placeholder: "رقم الطلب",
      type: "text",
    },
    {
      name: "التاريخ",
      label: "التاريخ",
      placeholder: "اختر التاريخ",
      type: "date",
    },
  ];

  const handleFilterSubmit = (formData) => {
    setFilterData(formData);

    const filteredExpenses = expensesData.filter((expense) => {
      const matchesStatus =
        !formData["الحالة"] || expense["الحالة"] === formData["الحالة"];
      const matchesId =
        !formData["الرقم التسلسلي"] ||
        expense["الرقم التسلسلي"]
          .toString()
          .toLowerCase()
          .includes(formData["الرقم التسلسلي"].toLowerCase());
      const matchesDate =
        !formData["التاريخ"] || expense["التاريخ"].includes(formData["التاريخ"]);

      return matchesStatus && matchesId && matchesDate;
    });

    if (filteredExpenses.length === 0) {
      message.warning("لا توجد نتائج تطابق الفلاتر المحددة");
    }

    setExpensesList(filteredExpenses);
  };

  const handleReset = () => {
    setFilterData({});
    setExpensesList(expensesData);
    message.success("تم إعادة تعيين الفلاتر بنجاح");
  };

  const columns = [
    {
      title: "رقم الطلب",
      dataIndex: "الرقم التسلسلي",
      key: "id",
      className: "table-column-id",
    },
    {
      title: "مجموع الصرفيات",
      dataIndex: "الكلفة الكلية",
      key: "totalAmount",
      className: "table-column-total-amount",
    },
    {
      title: "الحالة",
      dataIndex: "الحالة",
      key: "status",
      className: "table-column-status",
    },
    {
      title: "التاريخ",
      dataIndex: "التاريخ",
      key: "date",
      className: "table-column-date",
    },
    {
      title: "التفاصيل",
      key: "details",
      className: "table-column-details",
      render: (_, record) => (
        <Link
          to="/expenses-view"
          state={{ expense: record }}
          className="supervisor-expenses-history-details-link"
        >
          عرض
        </Link>
      ),
    },
  ];

  return (
    <div
      className={`supervisor-expenses-history-page ${
        isSidebarCollapsed ? "sidebar-collapsed" : "supervisor-expenses-history-page"
      }`}
      dir="rtl"
    >
      {/* Page Title */}
      <h1 className="supervisor-expenses-history-title">سجل الصرفيات</h1>

      {/* Filter Form */}
      <div className="supervisor-expenses-history-filters">
        <TextFieldForm
          fields={fields}
          onFormSubmit={handleFilterSubmit}
          onReset={handleReset}
          formClassName="supervisor-expenses-history-form"
          inputClassName="supervisor-expenses-history-input"
          dropdownClassName="supervisor-expenses-history-dropdown"
          fieldWrapperClassName="supervisor-expenses-history-field-wrapper"
          buttonClassName="supervisor-expenses-history-button"
        />
      </div>

      {/* Expenses Table */}
      <div className="supervisor-expenses-history-table-container">
        <Table
          dataSource={expensesList}
          columns={columns}
          rowKey="الرقم التسلسلي"
          bordered
          pagination={{ pageSize: 15 }}
          locale={{ emptyText: "لا توجد بيانات" }}
          className="supervisor-expenses-history-table"
        />
      </div>
    </div>
  );
}