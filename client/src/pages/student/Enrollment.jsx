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
      console.error("Error fetching enrollment:", err);

      // Sample enrollment data for demo
      const sampleEnrollment = {
        studentId: "2023-12345",
        term: "1st Semester",
        academicYear: "2023-2024",
        status: "Approved",
        courses: [
          {
            edpCode: "CS101-A",
            courseCode: "CS101",
            courseName: "Introduction to Computer Science",
            schedule: {
              day: "MWF",
              time: "9:00 AM - 10:30 AM",
              room: "Room 301"
            }
          },
          {
            edpCode: "MATH201-B",
            courseCode: "MATH201",
            courseName: "Calculus I",
            schedule: {
              day: "TTh",
              time: "1:00 PM - 2:30 PM",
              room: "Room 205"
            }
          },
          {
            edpCode: "ENG101-C",
            courseCode: "ENG101",
            courseName: "English Composition",
            schedule: {
              day: "MWF",
              time: "11:00 AM - 12:30 PM",
              room: "Room 102"
            }
          }
        ]
      };

      setEnrollment(sampleEnrollment);
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
      console.error("Error fetching available courses:", err);

      // Sample available courses for demo
      const sampleCourses = [
        {
          edpCode: "PHYS101-A",
          courseCode: "PHYS101",
          courseName: "Physics I",
          schedule: {
            day: "MWF",
            time: "2:00 PM - 3:30 PM",
            room: "Room 401"
          }
        },
        {
          edpCode: "CHEM101-B",
          courseCode: "CHEM101",
          courseName: "Chemistry I",
          schedule: {
            day: "TTh",
            time: "9:00 AM - 10:30 AM",
            room: "Room 305"
          }
        },
        {
          edpCode: "BIO101-C",
          courseCode: "BIO101",
          courseName: "Biology I",
          schedule: {
            day: "MWF",
            time: "8:00 AM - 9:30 AM",
            room: "Room 201"
          }
        }
      ];

      setAvailableCourses(sampleCourses);
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
      console.error("Error submitting enrollment:", err);

      // For demo purposes, create a new enrollment with selected courses
      const selectedCoursesData = availableCourses.filter(course =>
        selectedCourses.includes(course.edpCode)
      );

      const newEnrollment = {
        studentId: "2023-12345",
        term: "1st Semester",
        academicYear: "2023-2024",
        status: "Pending",
        courses: selectedCoursesData
      };

      setEnrollment(newEnrollment);
      setSelectedCourses([]);
      setError(null);
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
