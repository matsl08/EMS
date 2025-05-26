import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "../../api/axios";
import "../../styles/AdminDashboard.css"; // Using the same CSS as MISAdminDashboard
import CoursesManagement from "./CoursesManagement";
import GradeManagement from "./GradeManagement";
import ClearanceManagement from "./ClearanceManagement";

const TeacherDashboard = () => {
  // * State for active tab
  const [activeTab, setActiveTab] = useState("courses");
  // const navigate = useNavigate();
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

  // * Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // * Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Close sidebar on mobile after tab change
    if (isMobile) {
      setSidebarVisible(false);
    }
  };

  // * Render active component based on tab
  const renderActiveComponent = () => {
    switch (activeTab) {
      case "courses":
        return <CoursesManagement />;
      case "grades":
        return <GradeManagement />;
      case "clearance":
        return <ClearanceManagement />;
      default:
        return <CoursesManagement />;
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
        <h2>Teacher Dashboard</h2>
        <nav className="admin-nav-container">
          <button
            className={`admin-nav-button ${
              activeTab === "courses" ? "active" : ""
            }`}
            onClick={() => setActiveTab("courses")}
          >
            My Courses
          </button>
          <button
            className={`admin-nav-button ${
              activeTab === "grades" ? "active" : ""
            }`}
            onClick={() => setActiveTab("grades")}
          >
            Grade Management
          </button>
          <button
            className={`admin-nav-button ${
              activeTab === "clearance" ? "active" : ""
            }`}
            onClick={() => setActiveTab("clearance")}
          >
            Clearance Management
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
            <h2>{activeTab === "courses" ? "My Courses" :
                activeTab === "grades" ? "Grade Management" :
                "Clearance Management"}
            </h2>
          </div>
        )}
        {renderActiveComponent()}
      </div>
    </div>
  );
};

export default TeacherDashboard;
