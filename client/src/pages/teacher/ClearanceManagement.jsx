import { useState, useEffect } from "react";
import axios from "../../api/axios";

const ClearanceManagement = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // * Fetch assigned courses
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("/teachers/courses");
      setCourses(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch courses", err);
    } finally {
      setLoading(false);
    }
  };

  // * Handle course selection and fetch clearance data
  const handleCourseSelect = async (course) => {
    setSelectedCourse(course);
    setLoading(true);
    try {
      const response = await axios.get(
        `/teachers/courses/${course.edpCode}/clearance`
      );
      setStudents(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch student clearance data", err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // * Handle clearance status update
  const handleClearanceUpdate = async (studentId, status, remarks) => {
    if (!selectedCourse) return;

    try {
      await axios.put(
        `/teachers/courses/${selectedCourse.edpCode}/clearance/${studentId}`,
        {
          status,
          remarks,
        }
      );

      // Refresh clearance data
      handleCourseSelect(selectedCourse);
    } catch (err) {
      setError("Failed to update clearance status", err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="clearance-management">
      <div className="dashboard-header">
        <h1>Clearance Management</h1>
      </div>

      {/* Course Selection */}
      <div className="course-selection">
        <h2>Select Course</h2>
        <div className="courses-list">
          {courses.map((course) => (
            <button
              key={course.edpCode}
              className={`course-btn ${
                selectedCourse?.edpCode === course.edpCode ? "active" : ""
              }`}
              onClick={() => handleCourseSelect(course)}
            >
              {course.courseCode} - {course.section}
            </button>
          ))}
        </div>
      </div>

      {selectedCourse && (
        <div className="clearance-list">
          <h3>Student Clearance Status</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Remarks</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.studentId}>
                    <td>{student.studentId}</td>
                    <td>{student.name}</td>
                    <td>
                      <select
                        value={student.clearanceStatus}
                        onChange={(e) => {
                          handleClearanceUpdate(
                            student.studentId,
                            e.target.value,
                            student.remarks
                          );
                        }}
                        className="status-select"
                      >
                        <option value="pending">Pending</option>
                        <option value="cleared">Cleared</option>
                        <option value="incomplete">Incomplete</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={student.remarks || ""}
                        onChange={(e) => {
                          handleClearanceUpdate(
                            student.studentId,
                            student.clearanceStatus,
                            e.target.value
                          );
                        }}
                        placeholder="Add remarks"
                        className="remarks-input"
                      />
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          handleClearanceUpdate(
                            student.studentId,
                            student.clearanceStatus,
                            student.remarks
                          );
                        }}
                        className="save-btn"
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClearanceManagement;
