const admin = require("firebase-admin");

// Create a new user
exports.createUser = async (data) => {
  const { userId, username, email, profilePicture, role, businessDetails, preferences, location } = data;

  try {
    const userRef = admin.firestore().collection("Users").doc(userId);
    await userRef.set({
      userId,
      username,
      email,
      profilePicture: profilePicture || null,
      role,
      businessDetails: businessDetails || null,
      preferences: preferences || null,
      location,
      createdAt: admin.firestore.Timestamp.now(),
    });
    console.log("User created successfully");
  } catch (error) {
    console.error("Error creating user:", error.message);
    throw error;
  }
};
