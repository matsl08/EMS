import { useState } from "react";
import "../../../styles/AdminDashboard.css";
import UserManagement from "./UserManagement";
import CourseOffering from "./CourseOffering";
import DepartmentManagement from "./DepartmentManagement";
import CourseManagement from "./CourseManagement";

const MISAdminDashboard = () => {
  // * State for active tab
  const [activeTab, setActiveTab] = useState("users");

  // * Handle logout
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // * Render active component based on tab
  const renderActiveComponent = () => {
    switch (activeTab) {
      case "users":
        return <UserManagement />;
      case "offerings":
        return <CourseOffering />;
      case "departments":
        return <DepartmentManagement />;
      case "courses":
        return <CourseManagement />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* * Sidebar */}
      <div className="sidebar">
        <h2>MIS Admin</h2>
        <nav className="admin-nav-container">
          <button
            className={`admin-nav-button ${
              activeTab === "users" ? "active" : ""
            }`}
            onClick={() => setActiveTab("users")}
          >
            User Management
          </button>
          <button
            className={`admin-nav-button ${
              activeTab === "offerings" ? "active" : ""
            }`}
            onClick={() => setActiveTab("offerings")}
          >
            Course Offerings
          </button>
          <button
            className={`admin-nav-button ${
              activeTab === "departments" ? "active" : ""
            }`}
            onClick={() => setActiveTab("departments")}
          >
            Department Management
          </button>
          <button
            className={`admin-nav-button ${
              activeTab === "courses" ? "active" : ""
            }`}
            onClick={() => setActiveTab("courses")}
          >
            Course Management
          </button>
          <button className="admin-nav-button logout" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </div>

      {/* * Main content area */}
      <div className="main-content">{renderActiveComponent()}</div>
    </div>
  );
};

export default MISAdminDashboard;
