import { useState, useEffect } from "react";
import axios from "../../api/axios";

const AssignedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

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
      setError("Failed to fetch assigned courses", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading courses...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="assigned-courses">
      <div className="dashboard-header">
        <h1>Assigned Courses</h1>
      </div>

      {/* Courses Grid */}
      <div className="courses-grid">
        {courses.map((course) => (
          <div
            key={course.edpCode}
            className={`course-card ${
              selectedCourse?.edpCode === course.edpCode ? "selected" : ""
            }`}
            onClick={() => setSelectedCourse(course)}
          >
            <h3>{course.courseCode}</h3>
            <p className="edp-code">EDP Code: {course.edpCode}</p>
            <p className="course-name">{course.courseName}</p>
            <div className="course-details">
              <p>Schedule: {course.schedule}</p>
              <p>Room: {course.room}</p>
              <p>Section: {course.section}</p>
              <p>
                Enrolled: {course.enrolledStudents}/{course.maxStudents}
              </p>
            </div>
            <div className="quick-actions">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Navigate to grade management with this course
                  // This will be handled by the parent component
                }}
                className="action-btn grades"
              >
                Manage Grades
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Navigate to clearance management with this course
                  // This will be handled by the parent component
                }}
                className="action-btn clearance"
              >
                Manage Clearance
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Course Details Panel */}
      {selectedCourse && (
        <div className="course-details-panel">
          <div className="panel-header">
            <h2>{selectedCourse.courseCode}</h2>
            <button
              className="close-btn"
              onClick={() => setSelectedCourse(null)}
            >
              ×
            </button>
          </div>
          <div className="panel-content">
            <h3>Course Information</h3>
            <div className="info-group">
              <label>Course Name:</label>
              <p>{selectedCourse.courseName}</p>
            </div>
            <div className="info-group">
              <label>EDP Code:</label>
              <p>{selectedCourse.edpCode}</p>
            </div>
            <div className="info-group">
              <label>Schedule:</label>
              <p>{selectedCourse.schedule}</p>
            </div>
            <div className="info-group">
              <label>Room:</label>
              <p>{selectedCourse.room}</p>
            </div>
            <div className="info-group">
              <label>Section:</label>
              <p>{selectedCourse.section}</p>
            </div>
            <div className="info-group">
              <label>Enrolled Students:</label>
              <p>
                {selectedCourse.enrolledStudents}/{selectedCourse.maxStudents}
              </p>
            </div>
            {selectedCourse.syllabus && (
              <div className="syllabus-section">
                <h3>Course Syllabus</h3>
                <div className="syllabus-content">
                  {selectedCourse.syllabus}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedCourses;
