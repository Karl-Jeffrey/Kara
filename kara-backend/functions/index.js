const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

admin.initializeApp();

const app = express();
app.use(cors());
app.use(express.json());

// Sign-Up: Register a new user with email and password
app.post("/signup", async (req, res) => {
  const {email, password} = req.body;
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });
    res.status(201).json({
      message: "User registered successfully!",
      uid: userRecord.uid,
    });
  } catch (error) {
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
    res.status(500).json({
      error: error.message,
    });
  }
});

// Export the API
exports.api = functions.https.onRequest(app);
