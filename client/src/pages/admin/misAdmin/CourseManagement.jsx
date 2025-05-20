import { useState, useEffect } from "react";
import axios from "../../../api/axios";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({
    courseCode: "",
    courseDescription: "",
    creditUnits: "",
    coursePrerequisites: [],
    department: "",
    programCode: "",
    yearOffered: "",
    semesterOffered: "",
    curriculumYear: "",
  });
  const [departments, setDepartments] = useState([]);
  const [prerequisiteInput, setPrerequisiteInput] = useState("");
  const [showForm, setShowForm] = useState(false);

  // * Fetch courses and departments
  useEffect(() => {
    fetchCourses();
    fetchDepartments();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("/admin/mis/courses");
      setCourses(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch courses", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("/admin/mis/departments");
      setDepartments(response.data);
    } catch (err) {
      console.error("Failed to fetch departments", err);
    }
  };

  // * Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCourse) {
        await axios.put(
          `/admin/mis/courses/${selectedCourse.courseCode}`,
          formData
        );
      } else {
        await axios.post("/admin/mis/courses", formData);
      }
      fetchCourses();
      resetForm();
    } catch (err) {
      setError("Failed to save course", err);
    }
  };

  // * Handle prerequisites
  const handleAddPrerequisite = () => {
    if (!prerequisiteInput.trim()) return;
    setFormData({
      ...formData,
      coursePrerequisites: [
        ...formData.coursePrerequisites,
        prerequisiteInput.trim(),
      ],
    });
    setPrerequisiteInput("");
  };

  const handleRemovePrerequisite = (prereq) => {
    setFormData({
      ...formData,
      coursePrerequisites: formData.coursePrerequisites.filter(
        (p) => p !== prereq
      ),
    });
  };

  // * Handle course deletion
  const handleDelete = async (courseCode) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(`/admin/mis/courses/${courseCode}`);
      fetchCourses();
      resetForm();
    } catch (err) {
      setError("Failed to delete course", err);
    }
  };

  // * Reset form
  const resetForm = () => {
    setSelectedCourse(null);
    setFormData({
      courseCode: "",
      courseDescription: "",
      creditUnits: "",
      coursePrerequisites: [],
      department: "",
      programCode: "",
      yearOffered: "",
      semesterOffered: "",
      curriculumYear: "",
    });
    setPrerequisiteInput("");
  };

  const getAvailablePrograms = () => {
    const dept = departments.find(
      (d) => d.departmentCode === formData.department
    );
    return dept ? dept.programs : [];
  };

  if (loading) return <div className="loading">Loading courses...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="course-management">
      <div className="dashboard-header">
        <h1>Course Management</h1>
        <button className="add-button" onClick={() => setShowForm(true)}>
          Add New Course
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Course Form Modal */}
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedCourse ? "Edit Course" : "Add New Course"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Course Code:</label>
                <input
                  type="text"
                  value={formData.courseCode}
                  onChange={(e) =>
                    setFormData({ ...formData, courseCode: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Course Description:</label>
                <textarea
                  value={formData.courseDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      courseDescription: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Credit Units:</label>
                <input
                  type="number"
                  value={formData.creditUnits}
                  onChange={(e) =>
                    setFormData({ ...formData, creditUnits: e.target.value })
                  }
                  required
                  min="1"
                />
              </div>

              {/* Prerequisites Section */}
              <div className="prerequisites-section">
                <h3>Prerequisites</h3>
                <div className="prerequisites-list">
                  {formData.coursePrerequisites.map((prereq) => (
                    <div key={prereq} className="prerequisite-item">
                      <span>{prereq}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePrerequisite(prereq)}
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <div className="add-prerequisite-form">
                  <input
                    type="text"
                    value={prerequisiteInput}
                    onChange={(e) => setPrerequisiteInput(e.target.value)}
                    placeholder="Enter prerequisite course code"
                  />
                  <button
                    type="button"
                    onClick={handleAddPrerequisite}
                    className="add-btn"
                  >
                    Add Prerequisite
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Department:</label>
                <select
                  value={formData.department}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      department: e.target.value,
                      programCode: "", // Reset program when department changes
                    });
                  }}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option
                      key={dept.departmentCode}
                      value={dept.departmentCode}
                    >
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Program:</label>
                <select
                  value={formData.programCode}
                  onChange={(e) =>
                    setFormData({ ...formData, programCode: e.target.value })
                  }
                  required
                  disabled={!formData.department}
                >
                  <option value="">Select Program</option>
                  {getAvailablePrograms().map((program) => (
                    <option
                      key={program.programCode}
                      value={program.programCode}
                    >
                      {program.programName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Year Offered:</label>
                <select
                  value={formData.yearOffered}
                  onChange={(e) =>
                    setFormData({ ...formData, yearOffered: e.target.value })
                  }
                  required
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>

              <div className="form-group">
                <label>Semester Offered:</label>
                <select
                  value={formData.semesterOffered}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      semesterOffered: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select Semester</option>
                  <option value="1">1st Semester</option>
                  <option value="2">2nd Semester</option>
                </select>
              </div>

              <div className="form-group">
                <label>Curriculum Year:</label>
                <input
                  type="number"
                  value={formData.curriculumYear}
                  onChange={(e) =>
                    setFormData({ ...formData, curriculumYear: e.target.value })
                  }
                  required
                  min="2000"
                  max="2099"
                />
              </div>

              <div className="modal-buttons">
                <button type="submit" className="submit-btn">
                  {selectedCourse ? "Update" : "Add"} Course
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

      {/* Course Table */}
      <div className="table-container">
        <table className="courses-table">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Description</th>
              <th>Credit Units</th>
              <th>Department</th>
              <th>Program</th>
              <th>Year Offered</th>
              <th>Semester</th>
              <th>Curriculum Year</th>
              <th>Prerequisites</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.courseCode}>
                <td>{course.courseCode}</td>
                <td>{course.courseDescription}</td>
                <td>{course.creditUnits}</td>
                <td>{course.department}</td>
                <td>{course.programCode}</td>
                <td>{course.yearOffered}</td>
                <td>{course.semesterOffered}</td>
                <td>{course.curriculumYear}</td>
                <td>
                  <ul className="prerequisites-list">
                    {course.coursePrerequisites.map((prereq) => (
                      <li key={prereq}>{prereq}</li>
                    ))}
                  </ul>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => {
                        setSelectedCourse(course);
                        setFormData(course);
                        setShowForm(true);
                      }}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course.courseCode)}
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

export default CourseManagement;
