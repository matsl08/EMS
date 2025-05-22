import { useState, useEffect } from "react";
import "../../../styles/AdminDashboard.css";
import UserManagement from "./UserManagement";
import DepartmentManagement from "./DepartmentManagement";
import CourseManagement from "./CourseManagement";
import CourseOffering from "./CourseOffering";

const MISAdminDashboard = () => {
  // * State for active tab
  const [activeTab, setActiveTab] = useState("users");
  // * State for sidebar visibility
  const [sidebarVisible, setSidebarVisible] = useState(true);
  // * State for mobile detection
  const [isMobile, setIsMobile] = useState(false);

  // * Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      // Auto-hide sidebar on mobile
      if (window.innerWidth <= 768) {
        setSidebarVisible(false);
      } else {
        setSidebarVisible(true);
      }
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // * Handle logout
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // * Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Close sidebar on mobile after tab change
    if (isMobile) {
      setSidebarVisible(false);
    }
  };

  // * Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
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
      {/* Sidebar Toggle Button */}
      <button
        className="sidebar-toggle"
        onClick={toggleSidebar}
        aria-label={sidebarVisible ? "Hide Sidebar" : "Show Sidebar"}
      >
        {sidebarVisible ? "◀" : "▶"}
      </button>

      {/* Backdrop for mobile sidebar */}
      {isMobile && sidebarVisible && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarVisible(false)}
        ></div>
      )}

      {/* * Sidebar */}
      <div className={`sidebar ${sidebarVisible ? 'visible' : 'hidden'}`}>
        <h2>MIS Admin</h2>
        <nav className="admin-nav-container">
          <button
            className={`admin-nav-button ${
              activeTab === "users" ? "active" : ""
            }`}
            onClick={() => handleTabChange("users")}
          >
            User Management
          </button>
          <button
            className={`admin-nav-button ${
              activeTab === "offerings" ? "active" : ""
            }`}
            onClick={() => handleTabChange("offerings")}
          >
            Course Offerings
          </button>
          <button
            className={`admin-nav-button ${
              activeTab === "departments" ? "active" : ""
            }`}
            onClick={() => handleTabChange("departments")}
          >
            Department Management
          </button>
          <button
            className={`admin-nav-button ${
              activeTab === "courses" ? "active" : ""
            }`}
            onClick={() => handleTabChange("courses")}
          >
            Course Management
          </button>
          <button className="admin-nav-button logout" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </div>

      {/* * Main content area */}
      <div className={`admin-main-content ${!sidebarVisible ? 'expanded' : ''}`}>
        {isMobile && (
          <div className="mobile-header">
            <h2>{activeTab === "users" ? "User Management" :
                activeTab === "offerings" ? "Course Offerings" :
                activeTab === "departments" ? "Department Management" :
                "Course Management"}
            </h2>
          </div>
        )}
        {renderActiveComponent()}
      </div>
    </div>
  );
};

export default MISAdminDashboard;
