const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

// Initialize Firebase Admin SDK
admin.initializeApp();

// Import collection logic
const { createUser } = require("./collections/users");
const { createActivity } = require("./collections/activities");

const app = express();
app.use(cors());
app.use(express.json());

// Sign-Up: Register a new user with email and password
app.post("/signup", async (req, res) => {
  const { email, password, username, profilePicture, role, businessDetails, preferences, location } = req.body;
  try {
    // Register user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    // Save user to Firestore
    await createUser({
      userId: userRecord.uid,
      username,
      email,
      profilePicture,
      role,
      businessDetails,
      preferences,
      location,
    });

    res.status(201).json({
      message: "User registered successfully!",
      uid: userRecord.uid,
    });
  } catch (error) {
    console.error("Error during sign-up:", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
});

// Login: Verify user credentials and generate a custom token
app.post("/login", async (req, res) => {
  try {
    res.status(400).json({
      error:
        "Login should be handled on the client-side using Firebase Auth SDK.",
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
});

// Fetch all registered users
app.get("/users", async (req, res) => {
  try {
    const listUsersResult = await admin.auth().listUsers();
    const users = listUsersResult.users.map((user) => ({
      uid: user.uid,
      email: user.email,
    }));
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
});

// Create an activity
app.post("/activity", async (req, res) => {
  const {
    activityId, 
    title,
    description, 
    category, 
    price, 
    maxParticipants, 
    createdBy, 
    isBusinessActivity,
    businessDetails, 
    location, 
    availability,
      } = req.body;

  try {
    // Save activity to Firestore
    await createActivity({
      activityId,
      title,
      description,
      category,
      price,
      maxParticipants,
      createdBy,
      isBusinessActivity,
      businessDetails,
      location,
      availability,
    });

    res.status(201).json({ message: "Activity created successfully!" });
  } catch (error) {
    console.error("Error creating activity:", error.message);
    res.status(500).json({ error: error.message });
  }
});


//Route to fetch the activities 
app.get("/activities", getActivities);

// Export the API
exports.api = functions.https.onRequest(app);
