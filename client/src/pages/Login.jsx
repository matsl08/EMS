import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/Login.css";
import "../assets/ucbuilding.jpg";
import acaflowLogo from "../assets/acaflow-logo.png";
// Import logos (make sure to place these in your assets folder)
import ucLogo from "../assets/uclogo.jpg"; // Replace with your actual UC logo

const Login = () => {
  const navigate = useNavigate();

  // * State management for form inputs
  const [formData, setFormData] = useState({
    id: "",
    password: "",
    role: "student",
  });

  // * State for UI control
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // const [showRoleSelector, setShowRoleSelector] = useState(true);

  // * Handle redirection based on user role and admin position
  const handleRedirect = useCallback(
    (role, adminPosition = null) => {
      switch (role) {
        case "student":
          navigate("/students");
          break;
        case "teacher":
          navigate("/teachers");
          break;
        case "admin":
          if (adminPosition) {
            switch (adminPosition.toLowerCase()) {
              case "mis":
                navigate("/admin/mis");
                break;
              case "registrar":
                navigate("/admin/registrar");
                break;
              case "accounting":
                navigate("/admin/accounting");
                break;
              default:
                setError("Invalid admin position");
                localStorage.clear();
            }
          } else {
            setError("Admin position not found");
            localStorage.clear();
          }
          break;
        default:
          setError("Invalid role");
          localStorage.clear();
      }
    },
    [navigate]
  );

  // * Check if user is already logged in
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   const role = localStorage.getItem("role");
  //   const adminPosition = localStorage.getItem("adminPosition");

  //   if (token && role) {
  //     handleRedirect(role, adminPosition);
  //   }
  // }, [handleRedirect]);

    useState(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const adminPosition = localStorage.getItem("adminPosition");

    if (token && role) {
      handleRedirect(role, adminPosition);
    }
  }, [handleRedirect]);

  // * Handle role selection
  // const handleRoleSelect = (role) => {
  //   setFormData((prev) => ({ ...prev, role }));
  //   setShowRoleSelector(false);
  // };

  // * Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (error) setError("");
  };

  // * Toggle password visibility
  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  // * Handle back button to return to role selection
  // const handleBack = () => {
  //   setShowRoleSelector(true);
  // };

  // * Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", formData);
      const { token, user } = response.data; // Validate server response
      if (!response.data) {
        throw new Error("No response received from server");
      }
      if (!token) {
        throw new Error("Authentication token not received");
      }
      if (!user) {
        throw new Error("User data not received");
      }
      if (!user.role) {
        throw new Error("User role not specified");
      }
      if (!user.id || !user.name) {
        throw new Error("Incomplete user data received");
      }

      // * Store essential user data
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("name", user.name);
      localStorage.setItem("userId", user.id);

      // * Store role-specific data
      switch (user.role) {
        case "admin":
          if (!user.position) {
            throw new Error("Admin position not found");
          }
          localStorage.setItem("adminPosition", user.position);
          break;
        case "teacher":
          if (user.department) {
            localStorage.setItem("department", user.department);
          }
          break;
        case "student":
          if (user.programCode) {
            localStorage.setItem("programCode", user.programCode);
          }
          break;
        default:
          throw new Error("Invalid user role");
      }

      handleRedirect(user.role, user.position);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "An error occurred"
      );
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        {/* {!showRoleSelector && (
          <div className="form-indicator">
            <button
              type="button"
              className="back-button"
              onClick={handleBack}
              aria-label="Go back"
            >
              ←
            </button>
            <span style={{ flex: 1, textAlign: 'center' }}>
              {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} Login
            </span>
          </div>
        )} */}

        {/* {showRoleSelector ? ( */}
          {/* <> */}
            <div className="logos">
              <img src={ucLogo} alt="UC Logo" className="uc-logo" />
              <img src={acaflowLogo} alt="Acaflow Logo" className="acaflow-logo" />
            </div>
            <h1>Welcome to Acaflow</h1>
            {/* <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#666' }}>
              Please select your role to continue
            </p>
            <div className="role-buttons">
              <button
                className="role-button"
                onClick={() => handleRoleSelect("student")}
              >
                Login as Student
              </button>
              <button
                className="role-button"
                onClick={() => handleRoleSelect("admin")}
              >
                Login as Admin
              </button>
              <button
                className="role-button"
                onClick={() => handleRoleSelect("teacher")}
              >
                Login as Teacher
              </button>
            </div> */}
          {/* </> */}
        {/* ) : ( */}
          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message">{error}</div>}
              {/*old style*/}
            {/* <div className="login-group">
              <input
                type="text"
                id="id"
                name="id"
                value={formData.id}
                onChange={handleChange}
                disabled={loading}
                placeholder=" "
                required
              />
              <label htmlFor="id">
                {formData.role === "admin"
                  ? "Admin ID"
                  : formData.role === "teacher"
                  ? "Faculty ID"
                  : "Student ID"}
              </label>
            </div> */}

          <div className="login-group">
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
              className="select-role"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
            <label htmlFor="role" className="select-label"></label>
          </div>
          
           <div className="login-group">
            <input
              type="text"
              id="id"
              name="id"
              value={formData.id}
              onChange={handleChange}
              disabled={loading}
              required
              placeholder=" "
            />
            <label htmlFor="id">
              {formData.role === "admin"
                ? "Admin ID"
                : formData.role === "teacher"
                ? "Faculty ID"
                : "Student ID"}
            </label>
          </div>

            <div className="login-group password-group">
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder=" "
                  required
                />
                <label htmlFor="password">Password</label>
                <button
                  type="button"
                  onClick={togglePassword}
                  className="password-toggle"
                  disabled={loading}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>
        {/* )} */}


        {/* Brand footer */}
        <div className="brand-tag">
          © {new Date().getFullYear()} Acaflow - University of Cebu Pardo and Talisay Campus
        </div>
      </div>
    </div>
  );
};

export default Login;