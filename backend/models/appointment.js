const { MongoClient, ObjectId } = require("mongodb");
const validator = require("validator");

const url = "mongodb://localhost:27017";  // MongoDB connection URL
const dbName = "myDatabase";  // Replace with your database name
let db;

// Initialize MongoDB Client
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to MongoDB
async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db(dbName);
    console.log("Connected to MongoDB");
  }
}

// Appointment schema validation (manual)
function validateAppointment(appointmentData) {
  const errors = [];

  if (!appointmentData.firstName || appointmentData.firstName.length < 3) errors.push("First Name must be at least 3 characters.");
  if (!appointmentData.lastName || appointmentData.lastName.length < 3) errors.push("Last Name must be at least 3 characters.");
  if (!validator.isEmail(appointmentData.email)) errors.push("Invalid email.");
  if (!appointmentData.phone || appointmentData.phone.length !== 11) errors.push("Phone number must be exactly 11 digits.");
  if (!appointmentData.nic || appointmentData.nic.length !== 13) errors.push("NIC must be 13 digits.");
  if (!appointmentData.dob) errors.push("DOB is required.");
  if (!appointmentData.gender || !["Male", "Female"].includes(appointmentData.gender)) errors.push("Gender must be 'Male' or 'Female'.");
  if (!appointmentData.appointment_date) errors.push("Appointment Date is required.");
  if (!appointmentData.department) errors.push("Department Name is required.");
  if (!appointmentData.doctor.firstName || !appointmentData.doctor.lastName) errors.push("Doctor's name is required.");
  if (!appointmentData.address) errors.push("Address is required.");
  if (!appointmentData.doctorId) errors.push("Doctor ID is invalid.");
  if (!appointmentData.patientId) errors.push("Patient ID is required.");
  if (!["Pending", "Accepted", "Rejected"].includes(appointmentData.status)) errors.push("Status must be 'Pending', 'Accepted', or 'Rejected'.");

  return errors;
}

// Save appointment
async function saveAppointment(appointmentData) {
  await connectDB();

  // Validate appointment data
  const errors = validateAppointment(appointmentData);
  if (errors.length) throw new Error(errors.join(" "));

  // Insert appointment into the collection
  const result = await db.collection("appointments").insertOne(appointmentData);
  console.log("Appointment saved:", result.insertedId);
}

// Example usage
async function example() {
  const appointmentData = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "12345678901",
    nic: "1234567890123",
    dob: new Date("1990-01-01"),
    gender: "Male",
    appointment_date: "2024-12-01T09:00:00Z",
    department: "Cardiology",
    doctor: {
      firstName: "Dr. Jane",
      lastName: "Smith",
    },
    hasVisited: false,
    address: "123 Main St, City, Country",
    doctorId: new ObjectId(),  // Example ObjectId, replace with actual doctor ID
    patientId: new ObjectId(),  // Example ObjectId, replace with actual patient ID
    status: "Pending",
  };

  try {
    await saveAppointment(appointmentData);
    console.log("Appointment saved successfully");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.close();
  }
}

example();
