import { useState, useEffect } from "react";
import axios from "../../api/axios";

const GradeManagement = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadType, setUploadType] = useState("midterm"); // midterm or final
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch teacher's courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/teachers/courses");
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch courses");
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Fetch students when a course is selected
  useEffect(() => {
    if (selectedCourse) {
      fetchStudentGrades(selectedCourse.edpCode);
    }
  }, [selectedCourse]);

  const fetchStudentGrades = async (edpCode) => {
    setLoading(true);
    try {
      const response = await axios.get(`/teachers/courses/${edpCode}/grades`);
      setStudents(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch student grades");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setSuccessMessage("");
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSuccessMessage("");
  };

  const handleUploadTypeChange = (e) => {
    setUploadType(e.target.value);
  };

  const handleFileUpload = async () => {
    if (!file || !selectedCourse) return;

    const formData = new FormData();
    formData.append("gradesFile", file);
    formData.append("gradeType", uploadType);

    try {
      setLoading(true);
      await axios.post(
        `/teachers/courses/${selectedCourse.edpCode}/grades/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSuccessMessage(`${uploadType === "midterm" ? "Midterm" : "Final"} grades uploaded successfully!`);
      fetchStudentGrades(selectedCourse.edpCode);
    } catch (err) {
      setError("Failed to upload grades file");
    } finally {
      setLoading(false);
    }
  };

  const handleGradeChange = (studentId, value, type) => {
    const updatedStudents = students.map(student => {
      if (student.studentId === studentId) {
        return {
          ...student,
          grades: student.grades.map(grade => {
            if (grade.edpCode === selectedCourse.edpCode) {
              return {
                ...grade,
                [type]: value
              };
            }
            return grade;
          })
        };
      }
      return student;
    });
    
    setStudents(updatedStudents);
  };

  const handleSaveGrade = async (studentId, gradeType) => {
    if (!selectedCourse) return;
    
    const student = students.find(s => s.studentId === studentId);
    if (!student) return;
    
    const grade = student.grades.find(g => g.edpCode === selectedCourse.edpCode);
    if (!grade) return;
    
    try {
      await axios.put(`/teachers/courses/${selectedCourse.edpCode}/grades/${studentId}`, {
        [gradeType]: grade[gradeType]
      });
      
      setSuccessMessage(`Grade updated successfully for ${studentId}`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(`Failed to update grade for ${studentId}`);
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className="grade-management">
      <div className="dashboard-header">
        <h1>Grade Management</h1>
      </div>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="course-selection">
        <h2>Select a Course</h2>
        <div className="courses-list">
          {courses.map((course) => (
            <button
              key={course.edpCode}
              className={`course-select-btn ${selectedCourse?.edpCode === course.edpCode ? 'active' : ''}`}
              onClick={() => handleCourseSelect(course)}
            >
              {course.courseCode} - {course.edpCode}
            </button>
          ))}
        </div>
      </div>

      {selectedCourse && (
        <>
          <div className="upload-section">
            <h2>Upload Grades</h2>
            <div className="upload-controls">
              <select 
                value={uploadType} 
                onChange={handleUploadTypeChange}
                className="upload-type-select"
              >
                <option value="midterm">Midterm Grades</option>
                <option value="final">Final Grades</option>
              </select>
              <input 
                type="file" 
                accept=".xlsx,.xls,.csv" 
                onChange={handleFileChange} 
                className="file-input"
              />
              <button 
                onClick={handleFileUpload} 
                disabled={!file}
                className="upload-btn"
              >
                Upload
              </button>
            </div>
            <p className="upload-note">
              Note: The Excel file should have columns for Student ID and Grade.
            </p>
          </div>

          <div className="grades-table-container">
            <h2>Student Grades</h2>
            {loading ? (
              <div className="loading">Loading student data...</div>
            ) : (
              <table className="grades-table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Midterm Grade</th>
                    <th>Action</th>
                    <th>Final Grade</th>
                    <th>Action</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    const courseGrade = student.grades.find(
                      (g) => g.edpCode === selectedCourse.edpCode
                    ) || { midtermGrade: null, finalGrade: null, remarks: "" };
                    
                    return (
                      <tr key={student.studentId}>
                        <td>{student.studentId}</td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={courseGrade.midtermGrade || ""}
                            onChange={(e) => 
                              handleGradeChange(student.studentId, e.target.value, "midtermGrade")
                            }
                          />
                        </td>
                        <td>
                          <button 
                            className="save-btn"
                            onClick={() => handleSaveGrade(student.studentId, "midtermGrade")}
                          >
                            Save
                          </button>
                        </td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={courseGrade.finalGrade || ""}
                            onChange={(e) => 
                              handleGradeChange(student.studentId, e.target.value, "finalGrade")
                            }
                          />
                        </td>
                        <td>
                          <button 
                            className="save-btn"
                            onClick={() => handleSaveGrade(student.studentId, "finalGrade")}
                          >
                            Save
                          </button>
                        </td>
                        <td>{courseGrade.remarks || "N/A"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default GradeManagement;
