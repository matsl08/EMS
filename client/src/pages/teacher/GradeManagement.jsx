import { useState, useEffect } from "react";
import axios from "../../api/axios";

const GradeManagement = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gradeFile, setGradeFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);

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
      setError("Failed to fetch courses", err);
    } finally {
      setLoading(false);
    }
  };

  // * Handle course selection and fetch students
  const handleCourseSelect = async (course) => {
    setSelectedCourse(course);
    setLoading(true);
    try {
      // This endpoint would return students enrolled in the course
      const response = await axios.get(
        `/teachers/courses/${course.edpCode}/grades`
      );
      setStudents(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch student grades", err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // * Handle individual grade update
  const handleGradeUpdate = async (studentId, newGrade) => {
    if (!selectedCourse) return;

    try {
      await axios.post(`/teachers/courses/${selectedCourse.edpCode}/grades`, {
        studentId,
        grade: newGrade,
      });

      // Refresh student grades
      handleCourseSelect(selectedCourse);
    } catch (err) {
      setError("Failed to update grade", err);
    }
  };

  // * Handle grade file upload
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!gradeFile || !selectedCourse) return;

    const formData = new FormData();
    formData.append("grades", gradeFile);

    try {
      await axios.post(
        `/teachers/courses/${selectedCourse.edpCode}/grades/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Refresh student grades
      handleCourseSelect(selectedCourse);
      setGradeFile(null);
      setUploadError(null);
    } catch (err) {
      setUploadError("Failed to upload grades file", err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="grade-management">
      <div className="dashboard-header">
        <h1>Grade Management</h1>
      </div>

      {/* Course Selection */}
      <div className="course-selection">
        <h2>Select Course</h2>
        <div className="courses-list">
          {courses.map((course) => (
            <button
              key={course.edpCode}
              className={`course-btn ${
                selectedCourse?.edpCode === course.edpCode ? "active" : ""
              }`}
              onClick={() => handleCourseSelect(course)}
            >
              {course.courseCode} - {course.section}
            </button>
          ))}
        </div>
      </div>

      {selectedCourse && (
        <>
          {/* Grade Upload Section */}
          <div className="grade-upload-section">
            <h3>Upload Grades</h3>
            <form onSubmit={handleFileUpload}>
              <div className="upload-group">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={(e) => setGradeFile(e.target.files[0])}
                />
                <button
                  type="submit"
                  className="upload-btn"
                  disabled={!gradeFile}
                >
                  Upload Grades
                </button>
              </div>
              {uploadError && <div className="error">{uploadError}</div>}
            </form>
          </div>

          {/* Students Grade List */}
          <div className="students-grade-list">
            <h3>Student Grades</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Current Grade</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.studentId}>
                      <td>{student.studentId}</td>
                      <td>{student.name}</td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={student.grade || ""}
                          onChange={(e) => {
                            const newGrade = e.target.value;
                            if (newGrade >= 0 && newGrade <= 100) {
                              handleGradeUpdate(student.studentId, newGrade);
                            }
                          }}
                          className="grade-input"
                        />
                      </td>
                      <td>
                        <button
                          onClick={() =>
                            handleGradeUpdate(student.studentId, student.grade)
                          }
                          className="save-btn"
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GradeManagement;
