const admin = require("firebase-admin");

// Add a new like
exports.addLike = async (data, userId, activityDetails) => {
  const { activityId } = data;  // Activity ID for the liked post
  const { title, imagePath } = activityDetails;  // Details of the liked activity

  try {
    const likeRef = admin.firestore().collection("LikedPosts").doc(); // Firestore auto-generates a unique ID for the like

    // Add the like to the Firestore collection
    await likeRef.set({
      userId,            // Store the userId of the person who liked the activity
      activityId,        // Store the activityId of the liked activity
      title,             // Store the title of the liked activity
      imagePath,         // Store the imagePath (URL or storage path)
      createdAt: admin.firestore.Timestamp.now(), // Store the timestamp when the like was added
    });

    console.log("Like added successfully");
  } catch (error) {
    console.error("Error adding like:", error.message);
    throw error;
  }
};
