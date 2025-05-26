import { useState, useEffect } from "react";
import axios from "../../../api/axios";

const EvaluationManagement = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [formData, setFormData] = useState({
  //   status: "",
  //   remarks: "",
  // });

  // * Fetch all students
  const fetchStudents = async () => {
    // setLoading(true);
    try {
      const response = await axios.get("/admin/registrar/students");
      setStudents(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch students");
      console.error(err);
    } 
    // finally {
    //   setLoading(false);
    // }
  };

  // * Fetch student evaluation
  const fetchEvaluation = async (studentId) => {
    // setLoading(true);
    try {
      const response = await axios.get(
        `/admin/registrar/evaluations/${studentId}`
      );
      setSelectedStudent(response.data);
      // setFormData({
      //   status: response.data.status || "",
      //   remarks: response.data.remarks || "",
      // });
      setShowModal(true);
      setError(null);
    } catch (err) {
      setError("Failed to fetch student evaluation");
      console.error(err);
    } 
    // finally {
    //   setLoading(false);
    // }
  };

  // * Handle form submission
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!selectedStudent) return;

  //   try {
  //     await axios.put(
  //       `/admin/registrar/evaluations/${selectedStudent.studentId}`,
  //       formData
  //     );
  //     fetchEvaluation(selectedStudent.studentId);
  //   } catch (err) {
  //     setError("Failed to update evaluation");
  //     console.error(err);
  //   }
  // };

    // * Group courses by year and semester
  const groupCoursesByYearAndSemester = (courses) => {
    const grouped = {};
    courses.forEach((course) => {
      const year = course.yearOffered;
      const semester = course.semesterOffered;

      if (!grouped[year]) {
        grouped[year] = {
          firstSem: [],
          secondSem: [],
        };
      }

      if (semester === 1) {
        grouped[year].firstSem.push(course);
      } else {
        grouped[year].secondSem.push(course);
      }
    });
    return grouped;
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="evaluation-management">
      <div className="dashboard-header" style={{ fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif' }}>
        <h1>Evaluation Management</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-container">
        <table className="courses-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Program Code</th>
              <th>Curriculum Year</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.studentId}>
                <td>{student.studentId}</td>
                <td>{student.name}</td>
                <td>{student.studentInfo?.programCode}</td>
                <td>{student.studentInfo?.yearEnrolled}</td>
                <td>
                  <button
                    className="view-btn"
                    onClick={() => fetchEvaluation(student.studentId)}
                  >
                    View Evaluation
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Evaluation Modal */}
      {showModal && selectedStudent && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Student Evaluation</h2>
              <button
                className="close-btn"
                onClick={() => {
                  setShowModal(false);
                  setSelectedStudent(null);
                }}
              >
                ×
              </button>
            </div>


            <div className="student-info">
              <div className="info-item">
                <label>Student ID:</label>
                <span>{selectedStudent.studentId}</span>
              </div>
              <div className="info-item">
                <label>Name:</label>
                <span>{selectedStudent.studentName}</span>
              </div>
              <div className="info-item">
                <label>Curriculum Year:</label>
                <span>{selectedStudent.yearEnrolled}</span>
              </div>
            </div>
            

            {/* Course Tables */}
            {selectedStudent.courses && (
              <div className="course-tables-container">
                {Object.entries(
                  groupCoursesByYearAndSemester(selectedStudent.courses)
                ).map(([year, semesters]) => (
                  <div key={year} className="year-section">
                    <h3>{year} Year</h3>
                    <div className="semester-tables">
                      {/* First Semester Table */}
                      <div className="semester-table">
                        <h4>First Semester</h4>
                        <table>
                          <thead>
                            <tr>
                              <th>Course Code</th>
                              <th>Grade</th>
                              <th>Remarks</th>
                            </tr>
                          </thead>
                          <tbody>
                            {semesters.firstSem.map((course) => (
                              <tr key={course.courseCode}>
                                <td>{course.courseCode}</td>
                                <td>{course.grade}</td>
                                <td>{course.remarks}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Second Semester Table */}
                      <div className="semester-table">
                        <h4>Second Semester</h4>
                        <table>
                          <thead>
                            <tr>
                              <th>Course Code</th>
                              <th>Grade</th>
                              <th>Remarks</th>
                            </tr>
                          </thead>
                          <tbody>
                            {semesters.secondSem.map((course) => (
                              <tr key={course.courseCode}>
                                <td>{course.courseCode}</td>
                                <td>{course.grade}</td>
                                <td>{course.remarks}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationManagement;


            
            {/* Student Info */}
            {/* // <div className="student-info">
            //   <h3>Student Information</h3>
            //   <p>ID: {selectedStudent.studentId}</p>
            //   <p>Name: {selectedStudent.studentName}</p>
            //   <p>Program: {selectedStudent.program}</p>
            // </div> */}
            
            {/* Evaluation Form */}
            // <div className="form-section">
            //   <h3>Update Evaluation</h3>
            //   <form onSubmit={handleSubmit}>
            //     <div className="user-form-group">
            //       <label>Status:</label>
            //       <select
            //         value={formData.status}
            //         onChange={(e) =>
            //           setFormData({ ...formData, status: e.target.value })
            //         }
            //         required
            //       >
            //         <option value="">Select Status</option>
            //         <option value="pending">Pending</option>
            //         <option value="in_progress">In Progress</option>
            //         <option value="completed">Completed</option>
            //         <option value="rejected">Rejected</option>
            //       </select>
            //     </div>
            //     <div className="user-form-group">
            //       <label>Remarks:</label>
            //       <textarea
            //         value={formData.remarks}
            //         onChange={(e) =>
            //           setFormData({ ...formData, remarks: e.target.value })
            //         }
            //         placeholder="Enter remarks"
            //         rows="4"
            //       />
            //     </div>
            //     <div className="modal-buttons">
            //       <button
            //         type="button"
            //         onClick={() => {
            //           setShowModal(false);
            //           setSelectedStudent(null);
            //         }}
            //       >
            //         Close
            //       </button>
            //       <button type="submit" disabled={loading}>
            //         {loading ? "Updating..." : "Update Evaluation"}
            //       </button>
            //     </div>
            //   </form>
            // </div>

            {/* Evaluation History */}
            // {selectedStudent.history && (
            //   <div className="evaluation-history">
            //     <h3>Evaluation History</h3>
            //     <div className="history-list">
            //       {selectedStudent.history.map((record, index) => (
            //         <div key={index} className="history-item">
            //           <p className="status">Status: {record.status}</p>
            //           <p className="remarks">Remarks: {record.remarks}</p>
            //           <p className="date">
            //             Date: {new Date(record.date).toLocaleDateString()}
            //           </p>
            //         </div>
            //       ))}
            //     </div>
            //   </div>
            // )}

