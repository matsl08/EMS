import { useState } from "react";
import api from "../../../api/axios";
import "../../../styles/CourseOfferingGrid.css";

// Helper function for schedule formatting
const formatSchedule = (schedule) => {
  if (!schedule || !schedule.day || !schedule.time) return "No schedule set";
  return `${schedule.day} ${schedule.time}`;
};

const CourseOfferingGrid = ({ courses, onCourseUpdate }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Fixed the syntax error here

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.put(`/admin/mis/courses/offered/${selectedCourse.edpCode}`, {
        schedule: selectedCourse.schedule,
        teacherAssigned: selectedCourse.teacherAssigned,
      });

      setShowEditModal(false);
      onCourseUpdate();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update course");
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Enroll student and update grade record
      await api.post(
        `/admin/mis/courses/offered/${selectedCourse.edpCode}/enroll`,
        {
          studentId,
        }
      );

      setShowEnrollModal(false);
      setStudentId("");
      onCourseUpdate();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to enroll student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="course-offering-grid">
      <div className="courses-grid">
        {courses.map((course) => (
          <div key={course.edpCode} className="course-card">
            <h3>{course.edpCode}</h3>
            <div className="course-details">
              <p>
                <strong>EDP Code:</strong> {course.edpCode}
              </p>
              <p>
                <strong>School Year:</strong> {course.schoolYear || "Not Set"}
              </p>
              <p>
                <strong>Semester:</strong> {course.semester || "Not Set"}
              </p>
              <p>
                <strong>Schedule:</strong> {formatSchedule(course.schedule)}
              </p>
              <p>
                <strong>Room:</strong> {course.schedule?.room || "TBA"}
              </p>
              <p>
                <strong>Teacher:</strong>{" "}
                {course.teacherAssigned || "Not assigned"}
              </p>
              <p>
                <strong>Students:</strong>{" "}
                {course.studentsEnrolled?.length || 0}
              </p>
            </div>
            <div className="action-buttons">
              <button
                className="edit-btn"
                onClick={() => {
                  setSelectedCourse(course);
                  setShowEditModal(true);
                }}
              >
                Edit
              </button>
              <button
                className="enroll-btn"
                onClick={() => {
                  setSelectedCourse(course);
                  setShowEnrollModal(true);
                }}
              >
                Enroll Student
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Course Offering</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Day:</label>
                <select
                  value={selectedCourse.schedule.day}
                  onChange={(e) =>
                    setSelectedCourse({
                      ...selectedCourse,
                      schedule: {
                        ...selectedCourse.schedule,
                        day: e.target.value,
                      },
                    })
                  }
                >
                  <option value="M">Monday</option>
                  <option value="T">Tuesday</option>
                  <option value="W">Wednesday</option>
                  <option value="Th">Thursday</option>
                  <option value="F">Friday</option>
                  <option value="Sat">Saturday</option>
                </select>
              </div>
              <div className="form-group">
                <label>Time:</label>
                <input
                  type="text"
                  value={selectedCourse.schedule.time}
                  onChange={(e) =>
                    setSelectedCourse({
                      ...selectedCourse,
                      schedule: {
                        ...selectedCourse.schedule,
                        time: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g., 9:00-10:30"
                />
              </div>
              <div className="form-group">
                <label>Room:</label>
                <input
                  type="text"
                  value={selectedCourse.schedule.room}
                  onChange={(e) =>
                    setSelectedCourse({
                      ...selectedCourse,
                      schedule: {
                        ...selectedCourse.schedule,
                        room: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Teacher ID:</label>
                <input
                  type="text"
                  value={selectedCourse.teacherAssigned || ""}
                  onChange={(e) =>
                    setSelectedCourse({
                      ...selectedCourse,
                      teacherAssigned: e.target.value,
                    })
                  }
                  placeholder="Enter faculty ID"
                />
              </div>
              {error && <p className="error-message">{error}</p>}
              <div className="modal-buttons">
                <button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button type="button" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enroll Student Modal */}
      {showEnrollModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Enroll Student</h2>
            <form onSubmit={handleEnrollStudent}>
              <div className="form-group">
                <label>Student ID:</label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="Enter student ID"
                  required
                />
              </div>
              {error && <p className="error-message">{error}</p>}
              <div className="modal-buttons">
                <button type="submit" disabled={loading}>
                  {loading ? "Enrolling..." : "Enroll Student"}
                </button>
                <button type="button" onClick={() => setShowEnrollModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseOfferingGrid;
