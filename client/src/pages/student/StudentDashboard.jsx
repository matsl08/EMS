import { useState } from "react";
import ProfileManagement from "./ProfileManagement";
import Grades from "./Grades";
import Clearance from "./Clearance";
import Enrollment from "./Enrollment";
import "../../styles/StudentDashboard.css";

const StudentDashboard = () => {
  // * State for active tab
  const [activeTab, setActiveTab] = useState("profile");

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
        return (
          <div className="placeholder">Evaluation Component (Coming Soon)</div>
        );
      case "courses":
        return (
          <div className="placeholder">
            Current Courses Component (Coming Soon)
          </div>
        );
      default:
        return <ProfileManagement />;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* * Sidebar Navigation */}
      <div className="sidebar">
        <h2>Student Dashboard</h2>
        <nav>
          {/* * Profile Management */}
          <button
            className={`nav-button ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            My Profile
          </button>

          {/* * View Grades */}
          <button
            className={`nav-button ${activeTab === "grades" ? "active" : ""}`}
            onClick={() => setActiveTab("grades")}
          >
            My Grades
          </button>

          {/* * View Clearance */}
          <button
            className={`nav-button ${
              activeTab === "clearance" ? "active" : ""
            }`}
            onClick={() => setActiveTab("clearance")}
          >
            Clearance Status
          </button>

          {/* * Enrollment Section */}
          <button
            className={`nav-button ${
              activeTab === "enrollment" ? "active" : ""
            }`}
            onClick={() => setActiveTab("enrollment")}
          >
            Enrollment
          </button>

          {/* * View Evaluation */}
          <button
            className={`nav-button ${
              activeTab === "evaluation" ? "active" : ""
            }`}
            onClick={() => setActiveTab("evaluation")}
          >
            Evaluation
          </button>

          {/* * Current Enrolled Courses */}
          <button
            className={`nav-button ${activeTab === "courses" ? "active" : ""}`}
            onClick={() => setActiveTab("courses")}
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
      <div className="main-content">{renderActiveComponent()}</div>
    </div>
  );
};

export default StudentDashboard;
