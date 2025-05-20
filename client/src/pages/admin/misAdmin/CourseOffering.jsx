import { useState, useEffect } from "react";
import api from "../../../api/axios";
import CourseOfferingGrid from "./CourseOfferingGrid";
import "../../../styles/CourseOffering.css";

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
    schoolYear: "",
    semester: "",
    schedule: {
      day: "",
      time: "",
      room: "",
    },
    teacherAssigned: "",
  });
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [selectedCourseStudents, setSelectedCourseStudents] = useState([]);

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
      schoolYear: course.schoolYear || getCurrentSchoolYear(),
      semester: course.semester || "",
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
      schoolYear: getCurrentSchoolYear(),
      semester: "",
      schedule: {
        day: "",
        time: "",
        room: "",
      },
      teacherAssigned: "",
    });
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

  // Add this function to calculate the school year
  const getCurrentSchoolYear = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    return `${currentYear - 1}-${currentYear}`;
  };

  // Add this function to handle viewing students
  const handleViewStudents = (course) => {
    setSelectedCourse(course);
    setSelectedCourseStudents(course.enrolledStudents || []);
    setShowStudentsModal(true);
  };

  if (loading && courses.length === 0) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="course-offering">
      <div className="dashboard-header">
        <h1>Course Offerings</h1>
        <button className="add-button" onClick={() => setShowForm(true)}>
          Add New Course Offering
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
      {/* Course Offering Form Modal */}
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>
              {selectedCourse
                ? "Edit Course Offering"
                : "Add New Course Offering"}
            </h2>
            <form onSubmit={handleSubmit}>
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
                <label htmlFor="schoolYear">School Year</label>
                <input
                  type="text"
                  id="schoolYear"
                  name="schoolYear"
                  value={formData.schoolYear}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 2023-2024"
                  defaultValue={getCurrentSchoolYear()}
                />
              </div>

              <div className="form-group">
                <label htmlFor="semester">Semester</label>
                <select
                  id="semester"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Semester</option>
                  <option value="1">First Semester</option>
                  <option value="2">Second Semester</option>
                  <option value="3">Summer</option>
                </select>
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
        </div>
      )}
      {/* Course Offerings Table */}
      <div className="table-container">
        <table className="courses-table">
          <thead>
            <tr>
              <th>EDP Code</th>
              <th>Course Code</th>
              <th>School Year</th>
              <th>Semester</th>
              <th>Schedule</th>
              <th>Room</th>
              <th>Teacher</th>
              <th>Enrolled Students</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.edpCode}>
                <td>{course.edpCode}</td>
                <td>{course.courseCode}</td>
                <td>{course.schoolYear}</td>
                <td>{course.semester}</td>
                <td>
                  {course.schedule?.day} {course.schedule?.time}
                </td>
                <td>{course.schedule?.room}</td>
                <td>{course.teacherAssigned}</td>
                <td>
                  {course.studentsEnrolled?.length > 0 ? (
                    <span className="enrollment-count">
                      {course.studentsEnrolled.length} students
                    </span>
                  ) : (
                    <span>No students enrolled</span>
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => handleEdit(course)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCourse(course);
                        setShowEnrollModal(true);
                      }}
                      className="enroll-btn"
                    >
                      Enroll Student
                    </button>
                    {course.enrolledStudents?.length > 0 && (
                      <button
                        onClick={() => handleViewStudents(course)}
                        className="view-btn"
                      >
                        View Students
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Enroll Student Modal */}
      {showEnrollModal && selectedCourse && (
        <div className="modal">
          <div className="modal-content">
            <h2>Enroll Student in {selectedCourse.courseCode}</h2>
            <form onSubmit={handleEnrollStudent}>
              <div className="form-group">
                <label>Student ID:</label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" disabled={loading}>
                  {loading ? "Enrolling..." : "Enroll"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEnrollModal(false);
                    setStudentId("");
                  }}
                  disabled={loading}
                >
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
