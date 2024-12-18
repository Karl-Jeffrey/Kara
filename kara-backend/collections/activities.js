const admin = require("firebase-admin");

// Create a new activity
exports.createActivity = async (data) => {
  const { activityId, title, description, category, price, maxParticipants, createdBy, isBusinessActivity, businessDetails, location, availability } = data;

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
      createdAt: admin.firestore.Timestamp.now(),
    });
    console.log("Activity created successfully");
  } catch (error) {
    console.error("Error creating activity:", error.message);
    throw error;
  }
};
