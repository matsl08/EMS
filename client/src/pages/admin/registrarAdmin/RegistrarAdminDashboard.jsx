import { useState, useEffect } from "react";
import EvaluationManagement from "./EvaluationManagement";
import "../../../styles/AdminDashboard.css";

const RegistrarAdminDashboard = () => {
  // * State for active tab
  const [activeTab, setActiveTab] = useState("evaluations");
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

  // * Render active component based on tab
  const renderActiveComponent = () => {
    switch (activeTab) {
      case "evaluations":
        return <EvaluationManagement />;
      default:
        return <EvaluationManagement />;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar Toggle Button */}
      <button
        className="sidebar-toggle"
        onClick={toggleSidebar}
        aria-label={sidebarVisible ? "Hide Sidebar" : "Show Sidebar"} >
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
        <h2>Registrar Admin</h2>
        <nav className="admin-nav-container">
          <button
            className={`admin-nav-button ${
              activeTab === "evaluations" ? "active" : ""
            }`}
            onClick={() => {
              setActiveTab("evaluations");
              if (isMobile) setSidebarVisible(false);
            }}
          >
            Evaluation Management
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
            <h2>Evaluation Management</h2>
          </div>
        )}
        {renderActiveComponent()}
      </div>
    </div>
  );
};

export default RegistrarAdminDashboard;
