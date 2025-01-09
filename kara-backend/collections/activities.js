const admin = require("firebase-admin");

// Create a new activity
exports.createActivity = async (data) => {
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
    imageUrl, // Include imageUrl in the destructured data
  } = data;

  try {
    const activityRef = admin.firestore().collection("Activities").doc(activityId);
    await activityRef.set({
      activityId,
      title,
      description,
      category,
      price,
      maxParticipants,
      createdBy,
      isBusinessActivity,
      businessDetails: businessDetails || null,
      location,
      availability,
      imageUrl: imageUrl || null, // Add imageUrl here, default to null if not provided
      createdAt: admin.firestore.Timestamp.now(),
    });
    console.log("Activity created successfully");
  } catch (error) {
    console.error("Error creating activity:", error.message);
    throw error;
  }
};
