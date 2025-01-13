const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const logger = require("firebase-functions/logger");
const { getAuth } = require("firebase-admin/auth");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

// Initialize Express App
const app = express();

// Middleware
app.use(cors({ origin: true })); // Enable CORS for all origins
app.use(express.json()); // Parse JSON requests

// Utility: Async Error Handling Wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

// Import user-related functions
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("./collections/users");

// User API Routes

// Create a new user
app.post(
  "/users",
  asyncHandler(async (req, res) => {
    try {
      await createUser(req.body);
      res.status(201).json({ message: "User created successfully!" });
    } catch (error) {
      logger.error("Error creating user:", error);
      res.status(500).json({ message: error.message });
    }
  })
);

// Fetch all users
app.get(
  "/users",
  asyncHandler(async (req, res) => {
    try {
      await getUsers(req, res);
    } catch (error) {
      logger.error("Error fetching users:", error);
      res.status(500).json({ message: error.message });
    }
  })
);

// Fetch a user by ID
app.get(
  "/users/:id",
  asyncHandler(async (req, res) => {
    try {
      const user = await getUserById(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      logger.error("Error fetching user by ID:", error);
      res.status(500).json({ message: error.message });
    }
  })
);

// Update a user by ID
app.put(
  "/users/:id",
  asyncHandler(async (req, res) => {
    try {
      await updateUser(req.params.id, req.body);
      res.status(200).json({ message: "User updated successfully!" });
    } catch (error) {
      logger.error("Error updating user:", error);
      res.status(500).json({ message: error.message });
    }
  })
);

// Delete a user by ID
app.delete(
  "/users/:id",
  asyncHandler(async (req, res) => {
    try {
      await deleteUser(req.params.id);
      res.status(200).json({ message: "User deleted successfully!" });
    } catch (error) {
      logger.error("Error deleting user:", error);
      res.status(500).json({ message: error.message });
    }
  })
);

// Login a user
app.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    try {
      // Retrieve user using Firebase Auth
      const userRecord = await getAuth().getUserByEmail(email);

      // Generate a custom token for the frontend
      const token = await getAuth().createCustomToken(userRecord.uid);

      res.status(200).json({
        token,
        user: {
          id: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName || "User",
        },
      });
    } catch (error) {
      logger.error("Login error:", error);
      res.status(401).json({ message: "Invalid email or password." });
    }
  })
);

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error("Unhandled error:", err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// Export the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);
