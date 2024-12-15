import React, { useState } from "react";
import { Table, Button, Card, Typography, Space, message } from "antd";
import "./SuperVisorExpinsesRequest.css"; // CSS file for styling
import TextFieldForm from "./../../../reusable elements/ReuseAbleTextField.jsx"; // Reusable form component
import expensesData from "./../../../data/expensess.json"; // Sample data for expenses
import DeleteConfirmationModal from "./../../../reusable elements/DeletingModal.jsx"; // Reusable delete modal
import EditExpenseModal from "./../../../reusable elements/EditModal.jsx";
import useAuthStore from "./../../../store/store"; // Import sidebar state for dynamic class handling
import axios from "axios"; // Import Axios for API requests
import Icons from "./../../../reusable elements/icons.jsx";

const { Title } = Typography; // Typography component from Ant Design

export default function SuperVisorExpensesRequest() {
  const { isSidebarCollapsed } = useAuthStore(); // Access sidebar collapse state

  const [uploadedImages, setUploadedImages] = useState([]); // State to manage uploaded images
  const [dataSource, setDataSource] = useState(expensesData); // State for the table data source
  const [formData, setFormData] = useState({}); // State to manage form data
  const [isEditing, setIsEditing] = useState(false); // Editing modal visibility
  const [editingRecord, setEditingRecord] = useState(null); // Track the record being edited
  const [isDeleting, setIsDeleting] = useState(false); // Deleting modal visibility
  const [deletingRecord, setDeletingRecord] = useState(null); // Track the record being deleted

  // API URL (Replace this with your actual API endpoint)
  const apiUrl = "https://example.com/api/expenses";

  const handleAddExpense = async () => {
    try {
      const newExpense = {
        ...formData,
        images: uploadedImages,
        status: "Pending", // Default status
        totalAmount: formData.price * formData.quantity, // Calculate total amount
      };

      // Send the new expense to the API
      const response = await axios.post(apiUrl, newExpense);

      if (response.status === 201 || response.status === 200) {
        // Update the table with the new expense
        setDataSource((prev) => [...prev, response.data]);
        setFormData({}); // Reset form data
        setUploadedImages([]); // Reset uploaded images
        message.success("تمت إضافة المصروف بنجاح");
      } else {
        throw new Error("Failed to add expense");
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      message.error("حدث خطأ أثناء إضافة المصروف");
    }
  };

  const handleEdit = (record) => {
    setEditingRecord({ ...record });
    setIsEditing(true);
  };

  const saveEdit = async () => {
    try {
      // Update the record in the API
      const response = await axios.put(
        `${apiUrl}/${editingRecord["الرقم التسلسلي"]}`,
        editingRecord
      );

      if (response.status === 200 || response.status === 204) {
        setDataSource((prev) =>
          prev.map((item) =>
            item["الرقم التسلسلي"] === editingRecord["الرقم التسلسلي"]
              ? editingRecord
              : item
          )
        );
        setIsEditing(false);
        setEditingRecord(null);
        message.success("تم تعديل المصروف بنجاح");
      } else {
        throw new Error("Failed to edit expense");
      }
    } catch (error) {
      console.error("Error editing expense:", error);
      message.error("حدث خطأ أثناء تعديل المصروف");
    }
  };

  const handleDelete = (record) => {
    setDeletingRecord(record);
    setIsDeleting(true);
  };

  const confirmDelete = async () => {
    try {
      // Delete the record from the API
      const response = await axios.delete(
        `${apiUrl}/${deletingRecord["الرقم التسلسلي"]}`
      );

      if (response.status === 200 || response.status === 204) {
        setDataSource((prev) =>
          prev.filter(
            (item) => item["الرقم التسلسلي"] !== deletingRecord["الرقم التسلسلي"]
          )
        );
        setIsDeleting(false);
        setDeletingRecord(null);
        message.success("تم حذف المصروف بنجاح");
      } else {
        throw new Error("Failed to delete expense");
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      message.error("حدث خطأ أثناء حذف المصروف");
    }
  };

  const fields = [
    {
      name: "governorate",
      label: "المحافظة", // Governorate field
      placeholder: "بغداد",
      type: "text", // Text input
      disabled: true,
    },
    {
      name: "office",
      label: "اسم المكتب", // Office name field
      placeholder: "مكتب فرقد",
      type: "text", // Text input
      disabled: true,
    },
    {
      name: "expenseType",
      label: "نوع المصروف", // Expense type field
      placeholder: "",
      type: "dropdown", // Dropdown input
      options: [
        { value: "نثرية", label: "نثرية" },
        { value: "Hotel Stay", label: "Hotel Stay" },
      ],
    },
    {
      name: "price",
      label: "السعر", // Price field
      placeholder: "",
      type: "text", // Text input
    },
    {
      name: "quantity",
      label: "الكمية", // Quantity field
      placeholder: "",
      type: "number", // Number input
    },
    {
      name: "date",
      label: "التاريخ", // Date field
      placeholder: "",
      type: "date", // Date input
    },
    {
      name: "remarks",
      label: "الملاحظات", // Remarks field
      placeholder: "",
      type: "textarea", // Textarea input
      rows: 4, // Number of rows
      cols: 50, // Number of columns
    },
  ];

  const columns = [
    { title: "رقم الطلب", dataIndex: "الرقم التسلسلي", key: "id" }, // Request ID
    { title: "التاريخ", dataIndex: "التاريخ", key: "date" }, // Date
    { title: "الحالة", dataIndex: "الحالة", key: "status" }, // Status
    { title: "المبلغ الإجمالي", dataIndex: "الكلفة الكلية", key: "totalAmount" }, // Total amount
    {
      title: "الإجراءات", // Actions column
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button danger size="small" onClick={() => handleDelete(record)}>
            حذف
          </Button>
          <Button
            type="primary"
            size="small"
            onClick={() => handleEdit(record)}
          >
            تعديل
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div
      className={`supervisor-expenses-history-page ${
        isSidebarCollapsed
          ? "sidebar-collapsed"
          : "supervisor-expenses-history-page"
      }`}
      dir="rtl"
    >
      {/* Form Section */}
      <Title level={3} className="supervisor-request-title">
        إضافة المصاريف
      </Title>
      <Card className="supervisor-request-form-card">
        <TextFieldForm
          fields={fields}
          formClassName="supervisor-request-form"
          inputClassName="supervisor-request-input"
          dropdownClassName="supervisor-request-dropdown"
          fieldWrapperClassName="supervisor-request-field-wrapper"
          buttonClassName="supervisor-request-button"
          uploadedImages={uploadedImages}
          hideButtons={true}
          showImagePreviewer={true}
          onFormSubmit={(data) => setFormData(data)}
        />
        <button
          className="add-expensses-button"
          onClick={handleAddExpense}
        >
          إضافة مصروف
          <Icons type="add" />
        </button>
      </Card>

      {/* Table Section */}
      <Title level={3} className="supervisor-request-title-2">
        جدول المصاريف
      </Title>
      <Card className="supervisor-request-table-card">
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey="الرقم التسلسلي"
          bordered
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* Reusable Modals */}
      <EditExpenseModal
        visible={isEditing}
        onCancel={() => setIsEditing(false)}
        onSave={saveEdit}
        editingRecord={editingRecord}
        setEditingRecord={setEditingRecord}
      />

      <DeleteConfirmationModal
        visible={isDeleting}
        onCancel={() => setIsDeleting(false)}
        onConfirm={confirmDelete}
      />

      <button>ارسال للمدير</button>
    </div>
  );
}
