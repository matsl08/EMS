import { useState } from "react";
import EvaluationManagement from "./EvaluationManagement";
import "../../../styles/AdminDashboard.css";

const RegistrarAdminDashboard = () => {
  // * State for active tab
  const [activeTab, setActiveTab] = useState("evaluations");

  // * Handle logout
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
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
      {/* * Sidebar */}
      <div className="sidebar">
        <h2>Registrar Admin</h2>
        <nav className="admin-nav-container">
          <button
            className={`admin-nav-button ${
              activeTab === "evaluations" ? "active" : ""
            }`}
            onClick={() => setActiveTab("evaluations")}
          >
            Evaluation Management
          </button>
          <button className="admin-nav-button logout" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </div>

      {/* * Main content area */}
      <div className="admin-main-content">{renderActiveComponent()}</div>
    </div>
  );
};

export default RegistrarAdminDashboard;
