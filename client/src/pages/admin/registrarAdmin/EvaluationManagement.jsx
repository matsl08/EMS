import { useState } from "react";
import axios from "../../../api/axios";

const EvaluationManagement = () => {
  const [studentId, setStudentId] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    status: "",
    remarks: "",
  });

  // * Fetch student evaluation
  const fetchEvaluation = async (e) => {
    e?.preventDefault();
    if (!studentId) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `/admin/registrar/evaluations/${studentId}`
      );
      setEvaluation(response.data);
      setFormData({
        status: response.data.status,
        remarks: response.data.remarks,
      });
      setError(null);
    } catch (err) {
      setError("Failed to fetch student evaluation", err);
      setEvaluation(null);
    } finally {
      setLoading(false);
    }
  };

  // * Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId) return;

    try {
      await axios.put(`/admin/registrar/evaluations/${studentId}`, formData);
      fetchEvaluation();
    } catch (err) {
      setError("Failed to update evaluation", err);
    }
  };

  return (
    <div className="evaluation-management">
      <div className="dashboard-header">
        <h1>Evaluation Management</h1>
      </div>

      {/* Search Form */}
      <div className="search-section">
        <form onSubmit={fetchEvaluation}>
          <div className="form-group">
            <label>Student ID:</label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Enter student ID"
              required
            />
            <button type="submit" className="search-btn">
              Search
            </button>
          </div>
        </form>
      </div>

      {loading && <div className="loading">Loading evaluation...</div>}
      {error && <div className="error">{error}</div>}

      {evaluation && (
        <div className="evaluation-details">
          <h2>Student Evaluation Details</h2>

          {/* Student Info */}
          <div className="student-info">
            <h3>Student Information</h3>
            <p>ID: {evaluation.studentId}</p>
            <p>Name: {evaluation.studentName}</p>
            <p>Program: {evaluation.program}</p>
          </div>

          {/* Evaluation Form */}
          <div className="form-section">
            <h3>Update Evaluation</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Status:</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  required
                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="form-group">
                <label>Remarks:</label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) =>
                    setFormData({ ...formData, remarks: e.target.value })
                  }
                  placeholder="Enter remarks"
                />
              </div>
              <button type="submit" className="submit-btn">
                Update Evaluation
              </button>
            </form>
          </div>

          {/* Evaluation History */}
          {evaluation.history && (
            <div className="evaluation-history">
              <h3>Evaluation History</h3>
              <div className="history-list">
                {evaluation.history.map((record, index) => (
                  <div key={index} className="history-item">
                    <p className="status">Status: {record.status}</p>
                    <p className="remarks">Remarks: {record.remarks}</p>
                    <p className="date">
                      Date: {new Date(record.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EvaluationManagement;
