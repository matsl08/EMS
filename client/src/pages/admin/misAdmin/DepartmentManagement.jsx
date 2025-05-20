import { useState, useEffect } from "react";
import axios from "../../../api/axios";

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    departmentCode: "",
    departmentHead: "",
    programs: [],
  });
  const [programForm, setProgramForm] = useState({
    programCode: "",
    programName: "",
  });
  const [showForm, setShowForm] = useState(false);

  // * Fetch departments
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("/admin/mis/departments");
      setDepartments(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch departments", err);
    } finally {
      setLoading(false);
    }
  };

  // * Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedDepartment) {
        await axios.put(
          `/admin/mis/departments/${selectedDepartment.departmentId}`,
          formData
        );
      } else {
        await axios.post("/admin/mis/departments", formData);
      }
      fetchDepartments();
      resetForm();
    } catch (err) {
      setError("Failed to save department", err);
    }
  };

  // * Handle program addition
  const handleAddProgram = (e) => {
    e.preventDefault();
    if (!programForm.programCode || !programForm.programName) return;

    setFormData({
      ...formData,
      programs: [...formData.programs, { ...programForm }],
    });
    setProgramForm({ programCode: "", programName: "" });
  };

  // * Handle program removal
  const handleRemoveProgram = (programCode) => {
    setFormData({
      ...formData,
      programs: formData.programs.filter((p) => p.programCode !== programCode),
    });
  };

  // * Handle department deletion
  const handleDelete = async (departmentId) => {
    if (!window.confirm("Are you sure you want to delete this department?"))
      return;
    try {
      await axios.delete(`/admin/mis/departments/${departmentId}`);
      fetchDepartments();
      resetForm();
    } catch (err) {
      setError("Failed to delete department", err);
    }
  };

  // * Reset form
  const resetForm = () => {
    setSelectedDepartment(null);
    setFormData({
      name: "",
      departmentCode: "",
      departmentHead: "",
      programs: [],
    });
    setProgramForm({ programCode: "", programName: "" });
  };

  if (loading) return <div className="loading">Loading departments...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="department-management">
      <div className="dashboard-header">
        <h1>Department Management</h1>
        <button className="add-button" onClick={() => setShowForm(true)}>
          Add New Department
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Department Form Modal */}
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>
              {selectedDepartment ? "Edit Department" : "Add New Department"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Department Name:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Department Code:</label>
                <input
                  type="text"
                  value={formData.departmentCode}
                  onChange={(e) =>
                    setFormData({ ...formData, departmentCode: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Department Head:</label>
                <input
                  type="text"
                  value={formData.departmentHead}
                  onChange={(e) =>
                    setFormData({ ...formData, departmentHead: e.target.value })
                  }
                  required
                />
              </div>

              {/* Programs Section */}
              <div className="programs-section">
                <h3>Programs</h3>
                <div className="programs-list">
                  {formData.programs.map((program) => (
                    <div key={program.programCode} className="program-item">
                      <span>
                        {program.programName} ({program.programCode})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveProgram(program.programCode)}
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Program Form */}
                <div className="add-program-form">
                  <div className="form-group">
                    <label>Program Code:</label>
                    <input
                      type="text"
                      value={programForm.programCode}
                      onChange={(e) =>
                        setProgramForm({
                          ...programForm,
                          programCode: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Program Name:</label>
                    <input
                      type="text"
                      value={programForm.programName}
                      onChange={(e) =>
                        setProgramForm({
                          ...programForm,
                          programName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddProgram}
                    className="add-program-btn"
                  >
                    Add Program
                  </button>
                </div>
              </div>

              <div className="modal-buttons">
                <button type="submit" className="submit-btn">
                  {selectedDepartment ? "Update" : "Add"} Department
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Departments Table */}
      <div className="table-container">
        <table className="courses-table">
          <thead>
            <tr>
              <th>Department Name</th>
              <th>Department Code</th>
              <th>Department Head</th>
              <th>Programs</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.departmentId}>
                <td>{dept.name}</td>
                <td>{dept.departmentCode}</td>
                <td>{dept.departmentHead}</td>
                <td>
                  <ul className="prerequisites-list">
                    {dept.programs.map((program) => (
                      <li key={program.programCode}>
                        {program.programName} ({program.programCode})
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => {
                        setSelectedDepartment(dept);
                        setFormData({
                          name: dept.name,
                          departmentCode: dept.departmentCode,
                          departmentHead: dept.departmentHead,
                          programs: [...dept.programs],
                        });
                        setShowForm(true);
                      }}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(dept.departmentId)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentManagement;
