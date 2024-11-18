const { MongoClient } = require("mongodb");
const validator = require("validator");

const url = "mongodb://localhost:27017"; // MongoDB connection URL
const dbName = "myDatabase"; 
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

// Message schema validation (manual)
function validateMessage(messageData) {
  const errors = [];

  if (!messageData.firstName || messageData.firstName.length < 3) errors.push("First Name must be at least 3 characters.");
  if (!messageData.lastName || messageData.lastName.length < 3) errors.push("Last Name must be at least 3 characters.");
  if (!validator.isEmail(messageData.email)) errors.push("Invalid email.");
  if (!messageData.phone || messageData.phone.length !== 11) errors.push("Phone number must be exactly 11 digits.");
  if (!messageData.message || messageData.message.length < 10) errors.push("Message must be at least 10 characters.");
  
  return errors;
}

// Save message
async function saveMessage(messageData) {
  await connectDB();

  // Validate message data
  const errors = validateMessage(messageData);
  if (errors.length) throw new Error(errors.join(" "));

  // Insert message into the collection
  const result = await db.collection("messages").insertOne(messageData);
  console.log("Message saved:", result.insertedId);
}

// Example usage
async function example() {
  const messageData = {
    firstName: "John",
    lastName: "D",
    email: "john.d@example.com",
    phone: "12345678901",
    message: "This is a welcome message.",
  };

  try {
    await saveMessage(messageData);
    console.log("Message saved successfully");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.close();
  }
}

example();
