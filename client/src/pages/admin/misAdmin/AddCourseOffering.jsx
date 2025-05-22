import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios.js";
import "../../../styles/CourseOffering.css";

const AddCourseOffering = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedYearLevel, setSelectedYearLevel] = useState("");
  const [newOfferings, setNewOfferings] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);

  // Current school year
  const currentYear = new Date().getFullYear();
  const schoolYear = `${currentYear}-${currentYear + 1}`;

  // Common day patterns
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

  // Fetch departments and programs on component mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Fetch departments and programs
  const fetchDepartments = async () => {
    try {
      const response = await api.get("/admin/mis/departments");
      const allPrograms = [];
      response.data.forEach((dept) => {
        dept.programs.forEach((program) => {
          allPrograms.push({
            ...program,
            departmentName: dept.name,
          });
        });
      });
      setPrograms(allPrograms);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch departments");
      console.error(err);
    }
  };

  // Handle finding courses for new offering
  const handleFindCourses = async () => {
    try {
      setLoading(true);
      const yearLevel = parseInt(selectedYearLevel);
      const semester = parseInt(selectedSemester);

      const response = await api.get("/admin/mis/courses", {
        params: {
          programCode: selectedProgram,
          semesterOffered: semester,
          yearOffered: yearLevel,
        },
      });

      const filteredCourses = response.data.filter(
        (course) =>
          course.programCode === selectedProgram &&
          course.yearOffered === yearLevel &&
          course.semesterOffered === semester
      );

      if (filteredCourses.length === 0) {
        setError(
          `No courses found for ${selectedProgram} in Year ${yearLevel}, ${
            semester === 1 ? "1st" : "2nd"
          } Semester`
        );
        setLoading(false);
        return;
      }

      const offerings = filteredCourses.map((course) => ({
        courseCode: course.courseCode,
        edpCode: "",
        schoolYear: schoolYear,
        semester: semester,
        schedule: {
          day: "",
          time: "",
          room: "",
        },
        teacherAssigned: "",
      }));

      setAvailableCourses(filteredCourses);
      setNewOfferings(offerings);
      setError("");
    } catch (err) {
      console.error("Error finding courses:", err);
      setError("Failed to find courses");
    } finally {
      setLoading(false);
    }
  };

  // Handle offering input changes
  const handleOfferingChange = (index, field, value) => {
    const updatedOfferings = [...newOfferings];
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      updatedOfferings[index][parent][child] = value;
    } else {
      updatedOfferings[index][field] = value;
    }
    setNewOfferings(updatedOfferings);
  };

  // Save a single course offering
  const saveCourseOffering = async (offering) => {
    try {
      await api.post("/admin/mis/courses/offered", offering);
      return true;
    } catch (err) {
      setError(
        `Failed to save ${offering.courseCode}: ${
          err.response?.data?.message || err.message
        }`
      );
      return false;
    }
  };

  // Save all course offerings
  const saveAllOfferings = async () => {
    setLoading(true);
    setError("");

    // Validate all offerings have required fields
    const incompleteOfferings = newOfferings.filter(
      (offering) =>
        !offering.edpCode ||
        !offering.schedule.day ||
        !offering.schedule.time ||
        !offering.schedule.room
    );

    if (incompleteOfferings.length > 0) {
      setError("Please complete all required fields for each course offering");
      setLoading(false);
      return;
    }

    // Check for duplicate EDP codes
    const edpCodes = newOfferings.map((o) => o.edpCode);
    const hasDuplicates = edpCodes.some(
      (code, index) => edpCodes.indexOf(code) !== index
    );

    if (hasDuplicates) {
      setError(
        "Duplicate EDP codes found. Each course must have a unique EDP code"
      );
      setLoading(false);
      return;
    }

    // Save each offering
    let successCount = 0;
    for (const offering of newOfferings) {
      const success = await saveCourseOffering(offering);
      if (success) successCount++;
    }

    if (successCount === newOfferings.length) {
      // All offerings saved successfully
      navigate("/admin/mis/course-offerings");
    }

    setLoading(false);
  };

  if (loading && programs.length === 0) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="course-offering">
      <div className="header">
        <h2>Add New Course Offerings</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="course-offering-content">
        {/* Program Selection */}
        <div className="school-year-selector">
          <div className="filter-group">
            <label>Program:</label>
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              required
            >
              <option value="">Select Program</option>
              {programs.map((program) => (
                <option key={program.programCode} value={program.programCode}>
                  {program.programName} ({program.programCode})
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Year Level:</label>
            <select
              value={selectedYearLevel}
              onChange={(e) => setSelectedYearLevel(e.target.value)}
              required
            >
              <option value="">Select Year Level</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
              <option value="5">5th Year</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Semester:</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              required
            >
              <option value="">Select Semester</option>
              <option value="1">1st Semester</option>
              <option value="2">2nd Semester</option>
            </select>
          </div>

          <button
            className="find-button"
            onClick={handleFindCourses}
            disabled={
              !selectedProgram || !selectedSemester || !selectedYearLevel
            }
          >
            Find Courses
          </button>
        </div>

        {/* New Course Offerings Table */}
        {newOfferings.length > 0 && (
          <div className="new-offerings-section">
            <h3>New Course Offerings</h3>
            <div className="table-container">
              <table className="courses-table">
                <thead>
                  <tr>
                    <th>Course Code</th>
                    <th>Description</th>
                    <th>EDP Code</th>
                    <th>Day Pattern</th>
                    <th>Time</th>
                    <th>Room</th>
                    <th>Instructor</th>
                  </tr>
                </thead>
                <tbody>
                  {newOfferings.map((offering, index) => {
                    const course = availableCourses.find(
                      (c) => c.courseCode === offering.courseCode
                    );
                    return (
                      <tr key={`${offering.courseCode}-${index}`}>
                        <td>{offering.courseCode}</td>
                        <td>{course?.courseDescription || ""}</td>
                        <td>
                          <input
                            type="text"
                            value={offering.edpCode}
                            onChange={(e) =>
                              handleOfferingChange(
                                index,
                                "edpCode",
                                e.target.value
                              )
                            }
                            placeholder="Enter EDP code"
                            required
                          />
                        </td>
                        <td>
                          <select
                            value={offering.schedule.day}
                            onChange={(e) =>
                              handleOfferingChange(
                                index,
                                "schedule.day",
                                e.target.value
                              )
                            }
                            required
                          >
                            <option value="">Select day pattern</option>
                            {dayPatterns.map((pattern) => (
                              <option key={pattern.value} value={pattern.value}>
                                {pattern.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            type="text"
                            value={offering.schedule.time}
                            onChange={(e) =>
                              handleOfferingChange(
                                index,
                                "schedule.time",
                                e.target.value
                              )
                            }
                            placeholder="e.g., 9:00-10:30"
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={offering.schedule.room}
                            onChange={(e) =>
                              handleOfferingChange(
                                index,
                                "schedule.room",
                                e.target.value
                              )
                            }
                            placeholder="Enter room"
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={offering.teacherAssigned}
                            onChange={(e) =>
                              handleOfferingChange(
                                index,
                                "teacherAssigned",
                                e.target.value
                              )
                            }
                            placeholder="Enter faculty ID"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="action-buttons-container">
              <button className="save-all-button" onClick={saveAllOfferings}>
                Save All Course Offerings
              </button>
              <button
                className="cancel-button"
                onClick={() => navigate("/admin/mis/course-offerings")}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCourseOffering;
