const { MongoClient, ObjectId } = require("mongodb");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// MongoDB connection setup
const url = "mongodb://localhost:27017";
const dbName = "myDatabase";
let db;

// Initialize MongoDB Client
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db(dbName);
    console.log("Connected to MongoDB");
  }
}

// User collection operations
const userCollection = () => db.collection("users");

// User schema validation (manual)
function validateUser(userData) {
  const errors = [];
  if (!userData.firstName || userData.firstName.length < 3) errors.push("First Name must be at least 3 characters.");
  if (!userData.lastName || userData.lastName.length < 3) errors.push("Last Name must be at least 3 characters.");
  if (!validator.isEmail(userData.email)) errors.push("Invalid email.");
  if (!userData.phone || userData.phone.length !== 11) errors.push("Phone number must be 11 digits.");
  if (!userData.nic || userData.nic.length !== 13) errors.push("NIC must be 13 digits.");
  if (!userData.dob) errors.push("DOB is required.");
  if (!userData.gender || !["Male", "Female"].includes(userData.gender)) errors.push("Gender must be 'Male' or 'Female'.");
  if (!userData.password || userData.password.length < 8) errors.push("Password must be at least 8 characters.");
  if (!userData.role || !["Patient", "Doctor", "Admin"].includes(userData.role)) errors.push("Invalid role.");
  return errors;
}

// Save user
async function saveUser(userData) {
  await connectDB();

  // Validate user data
  const errors = validateUser(userData);
  if (errors.length) throw new Error(errors.join(" "));

  // Hash password
  userData.password = await bcrypt.hash(userData.password, 10);

  // Insert user into the collection
  const result = await userCollection().insertOne(userData);
  console.log("User saved:", result.insertedId);
}

// Compare password
async function comparePassword(storedPassword, enteredPassword) {
  return await bcrypt.compare(enteredPassword, storedPassword);
}

// Generate JWT
function generateJsonWebToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
}

// Example usage
async function example() {
  const userData = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "12345678901",
    nic: "1234567890123",
    dob: new Date("1990-01-01"),
    gender: "Male",
    password: "mypassword",
    role: "Patient",
    doctorDepartment: "Cardiology",
    docAvatar: { public_id: "some_public_id", url: "http://avatar.url" },
  };

  try {
    await saveUser(userData);
    console.log("User created successfully");

    // Example of password comparison
    const isMatch = await comparePassword(userData.password, "mypassword");
    console.log("Password match:", isMatch);

    // Example of JWT generation
    const token = generateJsonWebToken(userData._id || "dummyUserId");
    console.log("Generated JWT:", token);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.close();
  }
}

example();
