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
      const response = await axios.get(
        `/teachers/courses/${edpCode}/clearance`
      );
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

  // const handleStatusChange = (studentId, status) => {
  //   const updatedStudents = students.map(student => {
  //     if (student.studentId === studentId) {
  //       return {
  //         ...student,
  //         clearances: student.clearances.map(clearance => {
  //           if (clearance.courseCode === selectedCourse.courseCode) {
  //             return {
  //               ...clearance,
  //               status
  //             };
  //           }
  //           return clearance;
  //         })
  //       };
  //     }
  //     return student;
  //   });
    
  //   setStudents(updatedStudents);
  // };

  // const handleRemarksChange = (studentId, remarks) => {
  //   const updatedStudents = students.map(student => {
  //     if (student.studentId === studentId) {
  //       return {
  //         ...student,
  //         clearances: student.clearances.map(clearance => {
  //           if (clearance.courseCode === selectedCourse.courseCode) {
  //             return {
  //               ...clearance,
  //               remarks
  //             };
  //           }
  //           return clearance;
  //         })
  //       };
  //     }
  //     return student;
  //   });
    
  //   setStudents(updatedStudents);
  // };

  // const handleSaveClearance = async (studentId) => {
  //   if (!selectedCourse) return;
    
  //   const student = students.find(s => s.studentId === studentId);
  //   if (!student) return;
    
  //   const clearance = student.clearances.find(c => c.courseCode === selectedCourse.courseCode);
  //   if (!clearance) return;
    
  //   try {
  //     await axios.put(`/teachers/courses/${selectedCourse.edpCode}/clearance/${studentId}`, {
  //       status: clearance.status,
  //       remarks: clearance.remarks
  //     });
      
  //     setSuccessMessage(`Clearance updated successfully for ${studentId}`);
  //     setTimeout(() => setSuccessMessage(""), 3000);
  //   } catch (err) {
  //     setError(`Failed to update clearance for ${studentId}`);
  //     setTimeout(() => setError(null), 3000);
  //   }
  // };

   const handleClearanceAction = async (studentId) => {
    if (!selectedCourse) return;

    const student = students.find((s) => s.studentId === studentId);
    if (!student) return;

    const clearance = student.clearances.find(
      (c) => c.courseCode === selectedCourse.edpCode
    );
    if (!clearance) return;

    try {
      // Toggle between Cleared and Pending
      const newStatus = clearance.status === "Cleared" ? "Pending" : "Cleared";
      const remarks =
        newStatus === "Cleared" ? "Cleared by teacher" : "Pending review";

      await axios.put(
        `/teachers/courses/${selectedCourse.edpCode}/clearance/${studentId}`,
        {
          status: newStatus,
          remarks,
        }
      );

      setSuccessMessage(
        `Clearance ${newStatus.toLowerCase()} for ${studentId}`
      );
      setTimeout(() => setSuccessMessage(""), 3000);

      // Refresh the student list
      fetchStudentClearances(selectedCourse.edpCode);
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
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <div className="course-selection">
        <h2>Select a Course</h2>
        <div className="courses-list">
          {courses.map((course) => (
            <button
              key={course.edpCode}
              className={`course-select-btn ${
                selectedCourse?.edpCode === course.edpCode ? "active": ""
              }`}
              onClick={() => handleCourseSelect(course)}
              style={{
                width: "10%",
                marginBottom: "8px",
                padding: "10px",
                textAlign: "center",
                border: "1px solid #ddd",
                borderRadius: "4px",
                backgroundColor:
                  selectedCourse?.edpCode === course.edpCode
                    ? "#e3f2fd"
                    : "white",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                color: "#333",
              }}
            >
              {/* {course.courseCode} - {course.edpCode} */}
            <span className="course-code" style={{ fontWeight: "bold" }}>
                {course.courseCode}
              </span>
              <span className="course-name" style={{ color: "#666" }}>
                {course.courseName}
              </span>
              <span
                className="course-details"
                style={{ fontSize: "0.9em", color: "#888" }}
              >
                {course.section} • {course.schedule?.day}{" "}
                {course.schedule?.time}
              </span>
            </button>
          ))}
        </div>
      </div>

      {selectedCourse && (
        <div className="clearance-list">
          <h3>Student Clearance Status</h3>
          {loading ? (
              <div
                className="loading"
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "#6c757d",
                }}
              >
                Loading student data...
              </div>
            ) : (
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
                
                  {students.map((student) => {
                    const clearance = student.clearances.find(
                      (c) => c.courseCode === selectedCourse.edpCode
                    );

                    return (
                      <tr
                        key={student.studentId}
                        style={{
                          borderBottom: "1px solid #dee2e6",
                        }}
                      >
                        <td style={{ padding: "12px" }}>{student.studentId}</td>
                        <td style={{ padding: "12px" }}>{student.name}</td>
                        <td style={{ padding: "12px" }}>
                          <span
                            className={`status-badge ${
                              clearance?.status?.toLowerCase() || "pending"
                            }`}
                            style={{
                              padding: "4px 8px",
                              borderRadius: "4px",
                              backgroundColor:
                                clearance?.status === "Cleared"
                                  ? "#28a745"
                                  : "#ffc107",
                              color: "white",
                              fontSize: "0.9em",
                            }}
                          >
                            {clearance?.status || "Pending"}
                          </span>
                        </td>
                        <td style={{ padding: "12px", color: "#6c757d" }}>
                          {clearance?.remarks || "No remarks"}
                        </td>
                        <td style={{ padding: "12px" }}>
                          <button
                            className="action-btn"
                            onClick={() =>
                              handleClearanceAction(student.studentId)
                            }
                            style={{
                              padding: "6px 12px",
                              backgroundColor:
                                clearance?.status === "Cleared"
                                  ? "#dc3545"
                                  : "#28a745",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            {clearance?.status === "Cleared"
                              ? "Revoke"
                              : "Clear"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            </div>
            )}
          </div>
      )}
    </div>
  );
};

export default ClearanceManagement;
