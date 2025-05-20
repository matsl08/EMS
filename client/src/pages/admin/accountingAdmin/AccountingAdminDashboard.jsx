import { useState } from "react";
import PaymentManagement from "./PaymentManagement";
import "../../../styles/AccountingDashboard.css";

const AccountingAdminDashboard = () => {
  // * State for active tab (future-proofing for more tabs)
  const [activeTab, setActiveTab] = useState("payments");

  // * Handle logout
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="admin-dashboard">
      {/* * Sidebar */}
      <div className="sidebar">
        <h2>Accounting Admin</h2>
        <nav>
          <button
            className={`nav-button ${activeTab === "payments" ? "active" : ""}`}
            onClick={() => setActiveTab("payments")}
          >
            Payment Management
          </button>
          <button className="nav-button logout" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </div>

      {/* * Main content area */}
      <div className="main-content">
        <PaymentManagement />
      </div>
    </div>
  );
};

export default AccountingAdminDashboard;
