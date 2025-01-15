const admin = require("firebase-admin");

// Create a new activity in the Firestore "activities" collection
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
    imageUrl, // URL of the uploaded image
  } = data;

  try {
    // Validate required fields
    if (!activityId || !title || !createdBy || !category) {
      throw new Error("Missing required fields: activityId, title, category, or createdBy");
    }

    const activityRef = admin.firestore().collection("activities").doc(activityId);

    // Prepare activity data
    const activityData = {
      activityId,
      title,
      description: description || "",
      category,
      price: price || 0, // Default to 0 if no price provided
      maxParticipants: maxParticipants || null, // Allow null for unlimited participants
      createdBy,
      isBusinessActivity: isBusinessActivity || false,
      businessDetails: businessDetails || null,
      location: location || null,
      availability: availability || [],
      imageUrl: imageUrl || null, // Set null if no image is provided
      createdAt: admin.firestore.Timestamp.now(),
    };

    // Save the activity to Firestore
    await activityRef.set(activityData);
    console.log(`Activity "${title}" created successfully!`);
  } catch (error) {
    console.error("Error creating activity:", error.message);
    throw error; // Re-throw to handle it in calling code if necessary
  }
};
