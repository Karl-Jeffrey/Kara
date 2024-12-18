const admin = require("firebase-admin");

// Add a new comment
exports.addComment = async (data) => {
  const { commentId, activityId, userId, content } = data;

  try {
    const commentRef = admin.firestore().collection("Comments").doc(commentId);
    await commentRef.set({
      commentId,
      activityId,
      userId,
      content,
      createdAt: admin.firestore.Timestamp.now(),
    });
    console.log("Comment added successfully");
  } catch (error) {
    console.error("Error adding comment:", error.message);
    throw error;
  }
};
