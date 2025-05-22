import { useState, useEffect } from "react";
import PaymentManagement from "./PaymentManagement";
import "../../../styles/AccountingDashboard.css";

const AccountingAdminDashboard = () => {
  // * State for active tab (future-proofing for more tabs)
  const [activeTab, setActiveTab] = useState("payments");
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
        <h2>Accounting Admin</h2>
        <nav>
          <button
            className={`nav-button ${activeTab === "payments" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("payments");
              if (isMobile) setSidebarVisible(false);
            }}
          >
            Payment Management
          </button>
          <button className="nav-button logout" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </div>

      {/* * Main content area */}
      <div className={`main-content ${!sidebarVisible ? 'expanded' : ''}`}>
        {isMobile && (
          <div className="mobile-header">
            <h2>Payment Management</h2>
          </div>
        )}
        <PaymentManagement />
      </div>
    </div>
  );
};

export default AccountingAdminDashboard;
