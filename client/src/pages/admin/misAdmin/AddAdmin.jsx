import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axios";
import "../../../styles/UserForms.css";

const AddAdmin = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "admin",
    isActive: true,
    adminId: "",
    adminInfo: {
      position: "mis",
    },
  });

  useEffect(() => {
    if (id) {
      // Fetch user data if in edit mode
      const fetchUser = async () => {
        try {
          const response = await api.get(`/admin/mis/users/${id}`);
          const userData = response.data;
          setFormData({
            name: userData.name,
            email: userData.email,
            role: userData.role,
            isActive: userData.isActive,
            adminId: userData.adminId,
            adminInfo: userData.adminInfo,
          });
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch admin data");
          console.error("Error fetching admin:", err);
        }
      };
      fetchUser();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const keys = name.split(".");
      setFormData((prev) => {
        const newData = { ...prev };
        let current = newData;

        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) {
            current[keys[i]] = {};
          }
          current[keys[i]] = { ...current[keys[i]] };
          current = current[keys[i]];
        }

        current[keys[keys.length - 1]] = value;
        return newData;
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userData = {
        ...formData,
        password: id ? undefined : "UC@new123", // Only include password for new users
      };

      if (id) {
        await api.put(`/admin/mis/users/${id}`, userData);
      } else {
        await api.post("/admin/mis/users", userData);
      }
      navigate("/admin/mis/users");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Failed to ${id ? "update" : "create"} admin`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-form-page">
      <div className="add-user-header">
        <h2>{id ? "Edit" : "Add New"} Admin</h2>
        <button
          className="back-button"
          onClick={() => navigate("/admin/mis/users")}
        >
          ← Back
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="user-form">
        <div className="user-form-section">
          <div className="user-form-section-title">Admin Information</div>
          <div className="user-form-row">
            <div className="user-form-group">
              <label htmlFor="adminId">Admin ID</label>
              <input
                type="text"
                id="adminId"
                name="adminId"
                value={formData.adminId}
                onChange={handleChange}
                required
                placeholder="Enter admin ID"
              />
            </div>
            <div className="user-form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter full name"
              />
            </div>
          </div>
          <div className="user-form-row">
            <div className="user-form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter email address"
              />
            </div>
            <div className="user-form-group">
              <label htmlFor="adminInfo.position">Position</label>
              <select
                id="adminInfo.position"
                name="adminInfo.position"
                value={formData.adminInfo.position}
                onChange={handleChange}
                required
              >
                <option value="mis">MIS</option>
                <option value="registrar">Registrar</option>
                <option value="accounting">Accounting</option>
              </select>
            </div>
          </div>
        </div>

        <div className="user-form-buttons">
          <button
            type="button"
            onClick={() => navigate("/admin/mis/users")}
            className="cancel-button"
          >
            Cancel
          </button>
          <button type="submit" disabled={loading} className="submit-button">
            {loading
              ? id
                ? "Updating..."
                : "Creating..."
              : id
              ? "Update Admin"
              : "Create Admin"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAdmin;
