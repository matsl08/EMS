import { Navigate } from "react-router-dom";

// * Protected Route Component
const ProtectedRoute = ({ children, allowedRole, allowedPosition = null }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const adminPosition = localStorage.getItem("adminPosition"); // We'll set this during login

  // ? Check if user is authenticated
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // ? Check role match
  if (userRole !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  // ? Check admin position if required
  if (
    allowedRole === "admin" &&
    allowedPosition &&
    adminPosition !== allowedPosition
  ) {
    return <Navigate to="/" replace />;
  }

  // * Render children if authenticated and authorized
  return children;
};

export default ProtectedRoute;
