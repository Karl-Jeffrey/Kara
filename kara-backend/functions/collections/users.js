const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    storageBucket: "kara-ac8b6.firebasestorage.app",
  });
}

console.log("Firebase Admin initialized.");

// Validate user data before creating or updating
const validateUserData = (data) => {
  const requiredFields = ["username", "email", "role"];
  const missingFields = requiredFields.filter((field) => !data[field]);

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }

  if (typeof data.email !== "string" || !data.email.includes("@")) {
    throw new Error("Invalid email format.");
  }

  if (typeof data.role !== "string" || !["user", "admin"].includes(data.role)) {
    throw new Error("Invalid role. Must be 'user' or 'admin'.");
  }

  if (data.username && typeof data.username !== "string") {
    throw new Error("Username must be a string.");
  }
};

// Create a new user
exports.createUser = async (data) => {
  try {
    validateUserData(data);

    console.log("Creating new user...");
    const userPayload = {
      userId: data.userId || data.email.split("@")[0],
      username: data.username,
      email: data.email,
      role: data.role || "user", // Default role to "user" if not provided
      profilePicture: data.profilePicture || null,
      businessDetails: data.businessDetails || null,
      preferences: data.preferences || null,
      location: data.location || null,
      createdAt: admin.firestore.Timestamp.now(),
    };

    const userRef =
    admin.firestore().collection("Users").doc(userPayload.userId);

    await userRef.set(userPayload);
    console.log("User created successfully:", userPayload);
  } catch (error) {
    console.error("Error creating user:", error.message);
    throw error;
  }
};

