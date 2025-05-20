import { useState, useEffect } from "react";
import axios from "../../api/axios";

export const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await axios.get("/students/grades");
        setGrades(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch grades");
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  if (loading) {
    return <div className="loading">Loading grades...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
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
