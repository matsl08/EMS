import { useState, useEffect } from "react";
import axios from "../../api/axios";

const ClearanceManagement = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch teacher's courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/teachers/courses");
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch courses");
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Fetch students when a course is selected
  useEffect(() => {
    if (selectedCourse) {
      fetchStudentClearances(selectedCourse.edpCode);
    }
  }, [selectedCourse]);

  const fetchStudentClearances = async (edpCode) => {
    setLoading(true);
    try {
      const response = await axios.get(`/teachers/courses/${edpCode}/clearance`);
      setStudents(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch student clearances");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setSuccessMessage("");
  };

  const handleStatusChange = (studentId, status) => {
    const updatedStudents = students.map(student => {
      if (student.studentId === studentId) {
        return {
          ...student,
          clearances: student.clearances.map(clearance => {
            if (clearance.courseCode === selectedCourse.courseCode) {
              return {
                ...clearance,
                status
              };
            }
            return clearance;
          })
        };
      }
      return student;
    });
    
    setStudents(updatedStudents);
  };

  const handleRemarksChange = (studentId, remarks) => {
    const updatedStudents = students.map(student => {
      if (student.studentId === studentId) {
        return {
          ...student,
          clearances: student.clearances.map(clearance => {
            if (clearance.courseCode === selectedCourse.courseCode) {
              return {
                ...clearance,
                remarks
              };
            }
            return clearance;
          })
        };
      }
      return student;
    });
    
    setStudents(updatedStudents);
  };

  const handleSaveClearance = async (studentId) => {
    if (!selectedCourse) return;
    
    const student = students.find(s => s.studentId === studentId);
    if (!student) return;
    
    const clearance = student.clearances.find(c => c.courseCode === selectedCourse.courseCode);
    if (!clearance) return;
    
    try {
      await axios.put(`/teachers/courses/${selectedCourse.edpCode}/clearance/${studentId}`, {
        status: clearance.status,
        remarks: clearance.remarks
      });
      
      setSuccessMessage(`Clearance updated successfully for ${studentId}`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(`Failed to update clearance for ${studentId}`);
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className="clearance-management">
      <div className="dashboard-header">
        <h1>Clearance Management</h1>
      </div>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="course-selection">
        <h2>Select a Course</h2>
        <div className="courses-list">
          {courses.map((course) => (
            <button
              key={course.edpCode}
              className={`course-select-btn ${selectedCourse?.edpCode === course.edpCode ? 'active' : ''}`}
              onClick={() => handleCourseSelect(course)}
            >
              {course.courseCode} - {course.edpCode}
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
