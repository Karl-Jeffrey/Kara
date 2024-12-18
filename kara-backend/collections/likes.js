const admin = require("firebase-admin");

// Add a new like
exports.addLike = async (data) => {
  const { likeId, activityId, userId } = data;

  try {
    const likeRef = admin.firestore().collection("Likes").doc(likeId);
    await likeRef.set({
      likeId,
      activityId,
      userId,
      createdAt: admin.firestore.Timestamp.now(),
    });
    console.log("Like added successfully");
  } catch (error) {
    console.error("Error adding like:", error.message);
    throw error;
  }
};
