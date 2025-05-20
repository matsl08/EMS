import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import "../../styles/TeacherDashboard.css";

const TeacherDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const navigate = useNavigate();

  // * Handle logout
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // * Fetch assigned courses
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("/teachers/courses");
      setCourses(response.data);
      setError(null);
    } catch (error) {
      setError("Failed to fetch courses");
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  // * Navigate to grade management
  const handleManageGrades = (edpCode) => {
    navigate(`/teachers/courses/${edpCode}/grades`);
  };

  // * Navigate to clearance management
  const handleManageClearance = (edpCode) => {
    navigate(`/teachers/courses/${edpCode}/clearance`);
  };

  if (loading) return <div className="loading">Loading courses...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="teacher-dashboard">
      <div className="header">
        <h2>Teacher Dashboard</h2>
        <div className="actions">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="courses-grid">
        {courses.map((course) => (
          <div
            key={course.edpCode}
            className="course-card"
            onClick={() => setSelectedCourse(course)}
          >
            <h3>{course.courseCode}</h3>
            <div className="schedule-info">
              <p className="day">{course.schedule.day}</p>
              <p className="time">{course.schedule.time}</p>
              <p className="room">{course.schedule.room}</p>
            </div>
            <p className="enrolled">
              Students: {course.studentsEnrolled.length}
            </p>
          </div>
        ))}
      </div>

      {/* Course Details Modal */}
      {selectedCourse && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedCourse.courseCode}</h2>
              <button
                className="close-btn"
                onClick={() => setSelectedCourse(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="course-info">
                <h3>Course Details</h3>
                <p>
                  <strong>EDP Code:</strong> {selectedCourse.edpCode}
                </p>
                <p>
                  <strong>Schedule:</strong> {selectedCourse.schedule.day}{" "}
                  {selectedCourse.schedule.time}
                </p>
                <p>
                  <strong>Room:</strong> {selectedCourse.schedule.room}
                </p>
              </div>

              <div className="enrolled-students">
                <h3>Enrolled Students</h3>
                <div className="students-list">
                  {selectedCourse.studentsEnrolled.map((student) => (
                    <div key={student.studentId} className="student-item">
                      <span>{student.studentId}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button
                  className="manage-btn grades"
                  onClick={() => handleManageGrades(selectedCourse.edpCode)}
                >
                  Manage Grades
                </button>
                <button
                  className="manage-btn clearance"
                  onClick={() => handleManageClearance(selectedCourse.edpCode)}
                >
                  Manage Clearance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
