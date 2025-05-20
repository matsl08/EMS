import { useState } from "react";
import EvaluationManagement from "./EvaluationManagement";
import "../../../styles/RegistrarDashboard.css";

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
        return <DepartmentManagement />;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* * Sidebar */}
      <div className="sidebar">
        <h2>Registrar Admin</h2>
        <nav>
          <button
            className={`nav-button ${
              activeTab === "evaluations" ? "active" : ""
            }`}
            onClick={() => setActiveTab("evaluations")}
          >
            Evaluation Management
          </button>
          <button className="nav-button logout" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </div>

      {/* * Main content area */}
      <div className="main-content">{renderActiveComponent()}</div>
    </div>
  );
};

export default RegistrarAdminDashboard;
