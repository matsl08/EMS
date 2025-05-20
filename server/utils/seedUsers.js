import connectDB from "../config/db.js";
import { User } from "../models/User.js";
import { hashPassword } from "./passwordManagement.js";

const createTestUsers = async () => {
  try {
    // * Connect to database
    await connectDB();

    // * Clear existing users
    await User.deleteMany({});
    console.log("Cleared existing users");

    // * Create test passwords
    const password = await hashPassword("password123");

    // * Create MIS Admin
    const misAdmin = new User({
      name: "MIS Admin",
      email: "mis@admin.com",
      password,
      role: "admin",
      adminId: "ADMIN001",
      isActive: true,
      adminInfo: {
        position: "mis",
      },
    });
    await misAdmin.save();

    // * Create Registrar Admin
    const registrarAdmin = new User({
      name: "Registrar Admin",
      email: "registrar@admin.com",
      password,
      role: "admin",
      adminId: "ADMIN002",
      isActive: true,
      adminInfo: {
        position: "registrar",
      },
    });
    await registrarAdmin.save();

    // * Create Accounting Admin
    const accountingAdmin = new User({
      name: "Accounting Admin",
      email: "accounting@admin.com",
      password,
      role: "admin",
      adminId: "ADMIN003",
      isActive: true,
      adminInfo: {
        position: "accounting",
      },
    });
    await accountingAdmin.save();

    // * Create Teachers
    const teachers = [
      {
        name: "John Smith",
        email: "john.smith@faculty.com",
        password,
        role: "teacher",
        facultyId: "FAC001",
        isActive: true,
        teacherInfo: {
          department: "Computer Science",
        },
      },
      {
        name: "Mary Johnson",
        email: "mary.johnson@faculty.com",
        password,
        role: "teacher",
        facultyId: "FAC002",
        isActive: true,
        teacherInfo: {
          department: "Mathematics",
        },
      },
    ];

    await User.insertMany(teachers);

    // * Create Students
    const students = [
      {
        name: "Alice Cooper",
        email: "alice.cooper@student.com",
        password,
        role: "student",
        studentId: "2020-00001",
        isActive: true,
        studentInfo: {
          studentNumber: "2020-00001",
          programCode: "BSCS",
          yearEnrolled: "2020",
          yearLevel: 3,
          demographicProfile: {
            gender: "female",
            dateOfBirth: new Date("2002-05-15"),
            civilStatus: "single",
            placeOfBirth: "New York",
            religion: "Catholic",
            parents: [
              { role: "father", name: "Robert Cooper" },
              { role: "mother", name: "Sarah Cooper" },
            ],
            address: [
              {
                provinceAddress: "Metro Manila",
                cityAddress: "Makati City",
              },
            ],
            contactInformation: [
              {
                emailAddress: "alice.cooper@student.com",
                mobileNumber: "09123456789",
                landLineNumber: "8123-4567",
              },
            ],
            supportingStudies: "parents",
            isEmployed: false,
            educationalBackground: [
              {
                elementary: "Springfield Elementary",
                secondary: "Springfield High School",
                isTransferree: false,
              },
            ],
          },
        },
      },
      {
        name: "Bob Wilson",
        email: "bob.wilson@student.com",
        password,
        role: "student",
        studentId: "2020-00002",
        isActive: true,
        studentInfo: {
          studentNumber: "2020-00002",
          programCode: "BSIT",
          yearEnrolled: "2020",
          yearLevel: 3,
          demographicProfile: {
            gender: "male",
            dateOfBirth: new Date("2002-08-20"),
            civilStatus: "single",
            placeOfBirth: "Los Angeles",
            religion: "Christian",
            parents: [
              { role: "father", name: "James Wilson" },
              { role: "mother", name: "Emma Wilson" },
            ],
            address: [
              {
                provinceAddress: "Metro Manila",
                cityAddress: "Quezon City",
              },
            ],
            contactInformation: [
              {
                emailAddress: "bob.wilson@student.com",
                mobileNumber: "09187654321",
                landLineNumber: "8765-4321",
              },
            ],
            supportingStudies: "self support",
            isEmployed: false,
            educationalBackground: [
              {
                elementary: "Central Elementary",
                secondary: "Central High School",
                isTransferree: false,
              },
            ],
          },
        },
      },
    ];

    await User.insertMany(students);

    console.log("Test users created successfully!");
  } catch (error) {
    console.error("Error creating test users:", error);
  } finally {
    process.exit();
  }
};

// * Run the seeder
createTestUsers();
