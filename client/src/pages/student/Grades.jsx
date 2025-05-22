import { useState, useEffect } from "react";
import axios from "../../api/axios";

export const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await axios.get("/students/grades");
        setGrades(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching grades:", err);

        // Use sample data for development/demo purposes
        const sampleGrades = [
          {
            _id: "1",
            courseCode: "CS101",
            courseName: "Introduction to Computer Science",
            grade: "92",
            term: "1st Semester",
            academicYear: "2023-2024"
          },
          {
            _id: "2",
            courseCode: "MATH201",
            courseName: "Calculus I",
            grade: "88",
            term: "1st Semester",
            academicYear: "2023-2024"
          },
          {
            _id: "3",
            courseCode: "ENG101",
            courseName: "English Composition",
            grade: "90",
            term: "1st Semester",
            academicYear: "2023-2024"
          },
          {
            _id: "4",
            courseCode: "PHYS101",
            courseName: "Physics I",
            grade: "85",
            term: "1st Semester",
            academicYear: "2023-2024"
          },
          {
            _id: "5",
            courseCode: "CHEM101",
            courseName: "Chemistry I",
            grade: "78",
            term: "1st Semester",
            academicYear: "2023-2024"
          }
        ];

        setGrades(sampleGrades);
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  if (loading) {
    return <div className="loading">Loading grades...</div>;
  }

  return (
    <div className="grades-container">
      <h2>My Grades</h2>

      {grades.length === 0 ? (
        <p>No grades available.</p>
      ) : (
        <div className="grades-table-container">
          <table className="grades-table">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Grade</th>
                <th>Term</th>
                <th>Academic Year</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade) => (
                <tr key={grade._id}>
                  <td>{grade.courseCode}</td>
                  <td>{grade.courseName}</td>
                  <td
                    className={`grade ${
                      parseFloat(grade.grade) >= 75 ? "passing" : "failing"
                    }`}
                  >
                    {grade.grade}
                  </td>
                  <td>{grade.term}</td>
                  <td>{grade.academicYear}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Grades;
