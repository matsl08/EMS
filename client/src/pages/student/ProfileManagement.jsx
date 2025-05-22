import { useState, useEffect } from "react";
import axios from "../../api/axios";

const ProfileManagement = () => {
  // * Initial state for profile data
  const initialProfileState = {
    studentId: "",
    firstName: "",
    middleName: "",
    lastName: "s",
    program: "",
    yearLevel: "",
    address: {
      street: "",
      city: "",
      province: "",
      zipCode: "",
    },
    contact: {
      email: "",
      phone: "",
      emergencyContact: {
        name: "",
        relationship: "",
        phone: "",
      },
    },
  };

  // * State for profile data and form handling
  const [profile, setProfile] = useState(initialProfileState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(null); // 'address' or 'contact' or null

  // * Form state for editable sections
  const [formData, setFormData] = useState({
    address: {
      street: "",
      city: "",
      province: "",
      zipCode: "",
    },
    contact: {
      email: "",
      phone: "",
      emergencyContact: {
        name: "",
        relationship: "",
        phone: "",
      },
    },
  });

  // * Fetch student profile data on component mount
  useEffect(() => {
    fetchProfile();
  }, []);
  // * Function to fetch profile data from the server
  const fetchProfile = async () => {
    try {
      // Attempt to fetch from API
      const response = await axios.get("/students/profile");
      const profileData = {
        ...initialProfileState,
        ...response.data,
        address: {
          ...initialProfileState.address,
          ...response.data.address,
        },
        contact: {
          ...initialProfileState.contact,
          ...response.data.contact,
          emergencyContact: {
            ...initialProfileState.contact.emergencyContact,
            ...response.data.contact?.emergencyContact,
          },
        },
      };

      setProfile(profileData);
      setFormData({
        address: profileData.address,
        contact: profileData.contact,
      });
      setError(null);
    } catch (err) {
      console.error("Error fetching profile:", err);

      // Use sample data for development/demo purposes
      const sampleData = {
        studentId: "2023-12345",
        firstName: "John",
        middleName: "Michael",
        lastName: "Doe",
        program: "Bachelor of Science in Computer Science",
        yearLevel: "3rd Year",
        address: {
          street: "123 University Avenue",
          city: "Cebu City",
          province: "Cebu",
          zipCode: "6000",
        },
        contact: {
          email: "john.doe@student.edu.ph",
          phone: "09123456789",
          emergencyContact: {
            name: "Jane Doe",
            relationship: "Parent",
            phone: "09987654321",
          },
        },
      };

      setProfile(sampleData);
      setFormData({
        address: sampleData.address,
        contact: sampleData.contact,
      });
    } finally {
      setLoading(false);
    }
  };

  // * Handle form submission for address update
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/students/profile/address", formData.address);
      await fetchProfile(); // Refresh data
      setEditMode(null); // Exit edit mode
      setError(null);
    } catch (err) {
      console.error("Error updating address:", err);
      // For demo purposes, just update the local state and exit edit mode
      setProfile({
        ...profile,
        address: formData.address
      });
      setEditMode(null);
    }
  };

  // * Handle form submission for contact update
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/students/profile/contact", formData.contact);
      await fetchProfile(); // Refresh data
      setEditMode(null); // Exit edit mode
      setError(null);
    } catch (err) {
      console.error("Error updating contact:", err);
      // For demo purposes, just update the local state and exit edit mode
      setProfile({
        ...profile,
        contact: formData.contact
      });
      setEditMode(null);
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!profile) return <div className="error">No profile data available</div>;

  return (
    <div className="profile-management">
      <div className="dashboard-header">
        <h1>My Profile</h1>
      </div>{" "}
      {/* * Basic Information Section - Read Only */}
      <div className="profile-section">
        <h2>Basic Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <label>Student ID:</label>
            <p>{profile?.studentId || "N/A"}</p>
          </div>
          <div className="info-item">
            <label>Name:</label>
            <p>
              {[profile?.firstName, profile?.middleName, profile?.lastName]
                .filter(Boolean)
                .join(" ") || "N/A"}
            </p>
          </div>
          <div className="info-item">
            <label>Program:</label>
            <p>{profile?.program || "N/A"}</p>
          </div>
          <div className="info-item">
            <label>Year Level:</label>
            <p>{profile?.yearLevel || "N/A"}</p>
          </div>
        </div>
      </div>
      {/* * Address Section */}
      <div className="profile-section">
        <div className="section-header">
          <h2>Address Information</h2>
          <button
            className="edit-btn"
            onClick={() =>
              setEditMode(editMode === "address" ? null : "address")
            }
          >
            {editMode === "address" ? "Cancel" : "Edit"}
          </button>
        </div>

        {editMode === "address" ? (
          // * Address Edit Form
          <form onSubmit={handleAddressSubmit} className="edit-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Street Address:</label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, street: e.target.value },
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>City:</label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, city: e.target.value },
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Province:</label>
                <input
                  type="text"
                  value={formData.address.province}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: {
                        ...formData.address,
                        province: e.target.value,
                      },
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>ZIP Code:</label>
                <input
                  type="text"
                  value={formData.address.zipCode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, zipCode: e.target.value },
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="form-buttons">
              <button type="submit" className="save-btn">
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          // * Address Display
          <div className="info-grid">
            <div className="info-item">
              <label>Street Address:</label>
              <p>{profile?.address?.street || "N/A"}</p>
            </div>
            <div className="info-item">
              <label>City:</label>
              <p>{profile?.address?.city || "N/A"}</p>
            </div>
            <div className="info-item">
              <label>Province:</label>
              <p>{profile?.address?.province || "N/A"}</p>
            </div>
            <div className="info-item">
              <label>ZIP Code:</label>
              <p>{profile?.address?.zipCode || "N/A"}</p>
            </div>
          </div>
        )}
      </div>
      {/* * Contact Information Section */}
      <div className="profile-section">
        <div className="section-header">
          <h2>Contact Information</h2>
          <button
            className="edit-btn"
            onClick={() =>
              setEditMode(editMode === "contact" ? null : "contact")
            }
          >
            {editMode === "contact" ? "Cancel" : "Edit"}
          </button>
        </div>

        {editMode === "contact" ? (
          // * Contact Edit Form
          <form onSubmit={handleContactSubmit} className="edit-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, email: e.target.value },
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="tel"
                  value={formData.contact.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, phone: e.target.value },
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Emergency Contact Name:</label>
                <input
                  type="text"
                  value={formData.contact.emergencyContact.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: {
                        ...formData.contact,
                        emergencyContact: {
                          ...formData.contact.emergencyContact,
                          name: e.target.value,
                        },
                      },
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Emergency Contact Relationship:</label>
                <input
                  type="text"
                  value={formData.contact.emergencyContact.relationship}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: {
                        ...formData.contact,
                        emergencyContact: {
                          ...formData.contact.emergencyContact,
                          relationship: e.target.value,
                        },
                      },
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Emergency Contact Phone:</label>
                <input
                  type="tel"
                  value={formData.contact.emergencyContact.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: {
                        ...formData.contact,
                        emergencyContact: {
                          ...formData.contact.emergencyContact,
                          phone: e.target.value,
                        },
                      },
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="form-buttons">
              <button type="submit" className="save-btn">
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          // * Contact Display
          <div className="info-grid">
            <div className="info-item">
              <label>Email:</label>
              <p>{profile?.contact?.email || "N/A"}</p>
            </div>
            <div className="info-item">
              <label>Phone:</label>
              <p>{profile?.contact?.phone || "N/A"}</p>
            </div>
            <div className="info-item">
              <label>Emergency Contact:</label>
              <p>{profile?.contact?.emergencyContact?.name || "N/A"}</p>
            </div>
            <div className="info-item">
              <label>Emergency Contact Relationship:</label>
              <p>{profile?.contact?.emergencyContact?.relationship || "N/A"}</p>
            </div>
            <div className="info-item">
              <label>Emergency Contact Phone:</label>
              <p>{profile?.contact?.emergencyContact?.phone || "N/A"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileManagement;
