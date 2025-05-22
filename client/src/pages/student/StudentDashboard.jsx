import { useState, useEffect } from "react";
import ProfileManagement from "./ProfileManagement";
import Grades from "./Grades";
import Clearance from "./Clearance";
import Enrollment from "./Enrollment";
import Evaluation from "./Evaluation";
import MyCourses from "./MyCourses";
import "../../styles/StudentDashboard.css";

const StudentDashboard = () => {
  // * State for active tab
  const [activeTab, setActiveTab] = useState("profile");
  // * State for mobile sidebar visibility
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // * Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // * Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (isMobile) {
      setSidebarVisible(false);
    }
  };

  // * Handle logout
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };
  // * Render the active component based on selected tab
  const renderActiveComponent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileManagement />;
      case "grades":
        return <Grades />;
      case "clearance":
        return <Clearance />;
      case "enrollment":
        return <Enrollment />;
      case "evaluation":
        return <Evaluation />;
      case "courses":
        return <MyCourses />;
      default:
        return <ProfileManagement />;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Mobile Menu Toggle Button */}
      {isMobile && (
        <button
          className="mobile-menu-toggle"
          onClick={() => setSidebarVisible(!sidebarVisible)}
        >
          {sidebarVisible ? "✕" : "☰"}
        </button>
      )}

      {/* Backdrop for mobile sidebar */}
      {isMobile && sidebarVisible && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarVisible(false)}
        ></div>
      )}

      {/* * Sidebar Navigation */}
      <div className={`sidebar ${isMobile ? (sidebarVisible ? 'visible' : 'hidden') : ''}`}>
        <h2>Student Dashboard</h2>
        <nav>
          {/* * Profile Management */}
          <button
            className={`nav-button ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => handleTabChange("profile")}
          >
            My Profile
          </button>

          {/* * View Grades */}
          <button
            className={`nav-button ${activeTab === "grades" ? "active" : ""}`}
            onClick={() => handleTabChange("grades")}
          >
            My Grades
          </button>

          {/* * View Clearance */}
          <button
            className={`nav-button ${
              activeTab === "clearance" ? "active" : ""
            }`}
            onClick={() => handleTabChange("clearance")}
          >
            Clearance Status
          </button>

          {/* * Enrollment Section */}
          <button
            className={`nav-button ${
              activeTab === "enrollment" ? "active" : ""
            }`}
            onClick={() => handleTabChange("enrollment")}
          >
            Enrollment
          </button>

          {/* * View Evaluation */}
          <button
            className={`nav-button ${
              activeTab === "evaluation" ? "active" : ""
            }`}
            onClick={() => handleTabChange("evaluation")}
          >
            Evaluation
          </button>

          {/* * Current Enrolled Courses */}
          <button
            className={`nav-button ${activeTab === "courses" ? "active" : ""}`}
            onClick={() => handleTabChange("courses")}
          >
            My Courses
          </button>

          {/* * Logout Button - Always at the bottom */}
          <button className="nav-button logout" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </div>

      {/* * Main Content Area */}
      <div className={`main-content ${isMobile ? 'full-width' : ''}`}>
        {isMobile && (
          <div className="mobile-header">
            <h2>{activeTab === "profile" ? "My Profile" :
                activeTab === "grades" ? "My Grades" :
                activeTab === "clearance" ? "Clearance Status" :
                activeTab === "enrollment" ? "Enrollment" :
                activeTab === "evaluation" ? "Evaluation" :
                "My Courses"}
            </h2>
          </div>
        )}
        {renderActiveComponent()}
      </div>
    </div>
  );
};

export default StudentDashboard;
