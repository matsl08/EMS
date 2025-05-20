import { useState, useEffect } from "react";
import api from "../../api/axios";
import CourseOfferingGrid from "./CourseOfferingGrid";
import "../../styles/CourseOffering.css";

const CourseOffering = () => {
  // * State management
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedDayPattern, setSelectedDayPattern] = useState("");
  const [formData, setFormData] = useState({
    courseCode: "",
    edpCode: "",
    schedule: {
      day: "",
      time: "",
      room: "",
    },
    teacherAssigned: "",
  });
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [studentId, setStudentId] = useState("");

  // Common day patterns and individual days
  const dayPatterns = [
    { value: "MWF", label: "Monday, Wednesday, Friday" },
    { value: "TTh", label: "Tuesday, Thursday" },
    { value: "TThSat", label: "Tuesday, Thursday, Saturday" },
    { value: "MW", label: "Monday, Wednesday" },
    { value: "M", label: "Monday" },
    { value: "T", label: "Tuesday" },
    { value: "W", label: "Wednesday" },
    { value: "Th", label: "Thursday" },
    { value: "F", label: "Friday" },
    { value: "Sat", label: "Saturday" },
    { value: "Sun", label: "Sunday" },
    {
      value: "M-S",
      label: "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday",
    },
    { value: "M-F", label: "Monday, Tuesday, Wednesday, Thursday, Friday" },
  ];

  // * Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // * Handle day pattern selection
  const handleDayPatternChange = (pattern) => {
    setSelectedDayPattern(pattern);
    setFormData((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        day: pattern,
      },
    }));
  };

  // * Fetch all offered courses
  const fetchCourses = async () => {
    try {
      const response = await api.get("/admin/mis/courses/offered");
      setCourses(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch courses");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // * Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("schedule.")) {
      const scheduleField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        schedule: {
          ...prev.schedule,
          [scheduleField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // * Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (selectedCourse) {
        // * Update existing course offering
        await api.put(
          `/admin/mis/courses/offered/${selectedCourse.edpCode}`,
          formData
        );
      } else {
        // * Create new course offering
        await api.post("/admin/mis/courses/offered", formData);
      }

      // * Refresh course list and reset form
      await fetchCourses();
      handleCancel();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save course offering");
    } finally {
      setLoading(false);
    }
  };

  // * Handle edit course
  const handleEdit = (course) => {
    setSelectedCourse(course);
    setSelectedDayPattern(course.schedule?.day || "");
    setFormData({
      courseCode: course.courseCode,
      edpCode: course.edpCode,
      schedule: {
        day: course.schedule?.day || "",
        time: course.schedule?.time || "",
        room: course.schedule?.room || "",
      },
      teacherAssigned: course.teacherAssigned,
    });
    setShowForm(true);
  };

  // * Handle form cancel
  const handleCancel = () => {
    setShowForm(false);
    setSelectedCourse(null);
    setSelectedDayPattern("");
    setFormData({
      courseCode: "",
      edpCode: "",
      schedule: {
        day: "",
        time: "",
        room: "",
      },
      teacherAssigned: "",
    });
  };

  // * Format day pattern for display
  const formatDayPattern = (pattern) => {
    if (!pattern) return "-";
    const foundPattern = dayPatterns.find((d) => d.value === pattern);
    return foundPattern ? foundPattern.label : pattern;
  };

  // * Handle student enrollment
  const handleEnrollStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post(
        `/admin/mis/courses/offered/${selectedCourse.edpCode}/enroll`,
        {
          studentId,
        }
      );

      setShowEnrollModal(false);
      setStudentId("");
      await fetchCourses(); // Refresh the course list
    } catch (err) {
      setError(err.response?.data?.message || "Failed to enroll student");
    } finally {
      setLoading(false);
    }
  };

  if (loading && courses.length === 0) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="course-offering">
      <div className="header">
        <h2>Course Offerings</h2>
        <button className="add-button" onClick={() => setShowForm(true)}>
          Add New Course Offering
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* * Course Offering Form */}
      {showForm && (
        <div className="form-container">
          <form onSubmit={handleSubmit} className="course-form">
            <h3>
              {selectedCourse
                ? "Edit Course Offering"
                : "Add New Course Offering"}
            </h3>

            <div className="form-group">
              <label htmlFor="courseCode">Course Code</label>
              <input
                type="text"
                id="courseCode"
                name="courseCode"
                value={formData.courseCode}
                onChange={handleChange}
                required
                placeholder="Enter course code"
              />
            </div>

            <div className="form-group">
              <label htmlFor="edpCode">EDP Code</label>
              <input
                type="text"
                id="edpCode"
                name="edpCode"
                value={formData.edpCode}
                onChange={handleChange}
                required
                disabled={selectedCourse}
                placeholder="Enter EDP code"
              />
            </div>

            <div className="form-group">
              <label htmlFor="dayPattern">Day Pattern</label>
              <select
                id="dayPattern"
                value={selectedDayPattern}
                onChange={(e) => handleDayPatternChange(e.target.value)}
                required
              >
                <option value="">Select day pattern</option>
                {dayPatterns.map((pattern) => (
                  <option key={pattern.value} value={pattern.value}>
                    {pattern.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="schedule.time">Time</label>
              <input
                type="text"
                id="schedule.time"
                name="schedule.time"
                value={formData.schedule.time}
                onChange={handleChange}
                required
                placeholder="Enter time (e.g., 9:00-10:30)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="schedule.room">Room</label>
              <input
                type="text"
                id="schedule.room"
                name="schedule.room"
                value={formData.schedule.room}
                onChange={handleChange}
                required
                placeholder="Enter room number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="teacherAssigned">Instructor</label>
              <input
                type="text"
                id="teacherAssigned"
                name="teacherAssigned"
                value={formData.teacherAssigned}
                onChange={handleChange}
                required
                placeholder="Enter instructor faculty ID"
              />
            </div>

            <div className="form-buttons">
              <button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Course Offering"}
              </button>
              <button type="button" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Course Offerings Grid */}
      <div className="courses-grid">
        {courses.map((course) => (
          <div key={course.edpCode} className="course-card">
            <h3>{course.courseCode}</h3>
            <div className="course-details">
              <p>
                <strong>EDP Code:</strong> {course.edpCode}
              </p>
              <p>
                <strong>Schedule:</strong>{" "}
                {formatDayPattern(course.schedule?.day)}{" "}
                {course.schedule?.time || "-"}
              </p>
              <p>
                <strong>Room:</strong> {course.schedule?.room || "-"}
              </p>
              <p>
                <strong>Instructor:</strong>{" "}
                {course.teacherAssigned || "Not Assigned"}
              </p>
              <p>
                <strong>Enrolled:</strong>{" "}
                {course.studentsEnrolled?.length || 0} students
              </p>
            </div>
            <div className="action-buttons">
              <button className="edit-btn" onClick={() => handleEdit(course)}>
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

export default CourseOffering;
