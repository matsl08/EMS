import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";

const CoursesManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const navigate = useNavigate();

  // Fetch assigned courses
  useEffect(() => {
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

    fetchCourses();
  }, []);

  if (loading) return <div className="loading">Loading courses...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="courses-management">
      <div className="dashboard-header">
        <h1>My Assigned Courses</h1>
      </div>
      
      <div className="courses-grid">
        {courses.map((course) => (
          <div
            key={course.edpCode}
            className="course-card"
            onClick={() => setSelectedCourse(course)}
          >
            <h3>{course.courseCode}</h3>
            <p className="course-name">{course.courseName || "Course Name"}</p>
            <div className="schedule-info">
              <p className="day">{course.schedule.day}</p>
              <p className="time">{course.schedule.time}</p>
              <p className="room">{course.schedule.room}</p>
            </div>
            <p className="enrolled">
              Students: {course.studentsEnrolled.length}
            </p>
            <div className="course-actions">
              <button 
                className="action-btn grades"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/teachers/courses/${course.edpCode}/grades`);
                }}
              >
                Manage Grades
              </button>
              <button 
                className="action-btn clearance"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/teachers/courses/${course.edpCode}/clearance`);
                }}
              >
                Manage Clearance
              </button>
            </div>
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
                  <strong>Course Name:</strong> {selectedCourse.courseName || "N/A"}
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
                  {selectedCourse.studentsEnrolled.length > 0 ? (
                    selectedCourse.studentsEnrolled.map((student) => (
                      <div key={student.studentId} className="student-item">
                        <span>{student.studentId}</span>
                      </div>
                    ))
                  ) : (
                    <p>No students enrolled yet.</p>
                  )}
                </div>
              </div>

              <div className="modal-actions">
                <button
                  className="manage-btn grades"
                  onClick={() => navigate(`/teachers/courses/${selectedCourse.edpCode}/grades`)}
                >
                  Manage Grades
                </button>
                <button
                  className="manage-btn clearance"
                  onClick={() => navigate(`/teachers/courses/${selectedCourse.edpCode}/clearance`)}
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

export default CoursesManagement;