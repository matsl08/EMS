import { useState, useEffect } from "react";
import axios from "../../api/axios";

const Enrollment = () => {
  const [enrollment, setEnrollment] = useState(null);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEnrollment();
    fetchAvailableCourses();
  }, []);

  // * Fetch current enrollment status
  const fetchEnrollment = async () => {
    try {
      const response = await axios.get("/students/enrollment");
      setEnrollment(response.data);
      setError(null);
    } catch (err) {
      if (err.response?.status !== 404) {
        setError(
          err.response?.data?.message || "Failed to fetch enrollment status"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // * Fetch available courses from the offered courses
  const fetchAvailableCourses = async () => {
    try {
      const response = await axios.get("/admin/mis/courses/offered");
      setAvailableCourses(response.data);
    } catch (err) {
      setError("Failed to fetch available courses", err);
    }
  };

  // * Handle course selection
  const handleCourseSelect = (edpCode) => {
    setSelectedCourses((prev) => {
      if (prev.includes(edpCode)) {
        return prev.filter((code) => code !== edpCode);
      }
      return [...prev, edpCode];
    });
  };

  // * Handle enrollment submission
  const handleSubmitEnrollment = async () => {
    if (selectedCourses.length === 0) {
      setError("Please select at least one course");
      return;
    }

    try {
      await axios.post("/students/enrollment", {
        courses: selectedCourses,
      });
      setError(null);
      fetchEnrollment();
      setSelectedCourses([]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit enrollment");
    }
  };

  if (loading) {
    return <div className="loading">Loading enrollment status...</div>;
  }

  return (
    <div className="enrollment-container">
      <h2>Enrollment Management</h2>

      {/* Current Enrollment Status */}
      {enrollment && (
        <div className="current-enrollment">
          <h3>Current Enrollment Status</h3>
          <div className={`status-badge ${enrollment.status.toLowerCase()}`}>
            {enrollment.status}
          </div>
          {enrollment.courses.length > 0 && (
            <div className="enrolled-courses">
              <h4>Enrolled Courses:</h4>
              <div className="courses-grid">
                {enrollment.courses.map((course) => (
                  <div key={course.edpCode} className="course-card">
                    <h5>{course.edpCode}</h5>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* New Enrollment Section */}
      {(!enrollment || enrollment.status === "Rejected") && (
        <div className="new-enrollment-section">
          <h3>New Enrollment</h3>
          {error && <div className="error-message">{error}</div>}

          <div className="available-courses">
            <h4>Available Courses</h4>
            <div className="courses-grid">
              {availableCourses.map((course) => (
                <div
                  key={course.edpCode}
                  className={`course-card ${
                    selectedCourses.includes(course.edpCode) ? "selected" : ""
                  }`}
                  onClick={() => handleCourseSelect(course.edpCode)}
                >
                  <h5>{course.courseCode}</h5>
                  <p className="edp-code">EDP Code: {course.edpCode}</p>
                  <div className="course-details">
                    <p>
                      Schedule: {course.schedule.day} {course.schedule.time}
                    </p>
                    <p>Room: {course.schedule.room}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="enrollment-actions">
            <button
              className="submit-btn"
              onClick={handleSubmitEnrollment}
              disabled={selectedCourses.length === 0}
            >
              Submit Enrollment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enrollment;
