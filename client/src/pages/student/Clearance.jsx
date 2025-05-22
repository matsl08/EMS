import { useState, useEffect } from "react";
import axios from "../../api/axios";

const Clearance = () => {
  const [clearance, setClearance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClearance = async () => {
      try {
        const response = await axios.get("/students/clearance");
        setClearance(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching clearance:", err);

        // Use sample data for development/demo purposes
        const sampleClearance = {
          studentId: "2023-12345",
          term: "1st Semester",
          academicYear: "2023-2024",
          clearances: [
            {
              courseCode: "CS101",
              status: "Cleared",
              remarks: "All requirements submitted"
            },
            {
              courseCode: "MATH201",
              status: "Pending",
              remarks: "Missing final project"
            },
            {
              courseCode: "ENG101",
              status: "Cleared",
              remarks: ""
            },
            {
              courseCode: "PHYS101",
              status: "Cleared",
              remarks: "All requirements submitted"
            },
            {
              courseCode: "CHEM101",
              status: "Not Cleared",
              remarks: "Missing laboratory reports"
            }
          ]
        };

        setClearance(sampleClearance);
        setLoading(false);
      }
    };

    fetchClearance();
  }, []);

  if (loading) {
    return <div className="loading">Loading clearance status...</div>;
  }

  if (
    !clearance ||
    !clearance.clearances ||
    clearance.clearances.length === 0
  ) {
    return (
      <div className="clearance-container">
        <h2>Clearance Status</h2>
        <p>No clearance records available.</p>
      </div>
    );
  }

  return (
    <div className="clearance-container">
      <h2>Clearance Status</h2>
      <div className="clearance-table-container">
        <table className="clearance-table">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Status</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {clearance.clearances.map((item) => (
              <tr key={item.courseCode}>
                <td>{item.courseCode}</td>
                <td className={`status ${item.status.toLowerCase()}`}>
                  {item.status}
                </td>
                <td className="remarks">{item.remarks || "No remarks"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Clearance;
