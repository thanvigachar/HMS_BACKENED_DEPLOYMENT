const { MongoClient } = require('mongodb');
const url = "mongodb://127.0.0.1:27017";

const dbConnection = async () => {
  try {
    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to database!");

    // Access the specific database
    const db = client.db("MERN_STACK_HOSPITAL_MANAGEMENT_SYSTEM");

    // Return the database instance for further use
    return db;
  } catch (err) {
    console.error("Error occurred while connecting to the database:", err);
    throw err; // Rethrow the error for the caller to handle
  }
};

// Export the function to be used elsewhere
module.exports = dbConnection;
