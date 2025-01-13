const {firestore} = require("../firebaseAdmin");

const addPost = async (data) => {
  const {userId, caption, tags, mediaUrl, mediaType} = data;

  const post = {
    userId,
    caption,
    tags,
    mediaUrl,
    mediaType,
    likesCount: 0,
    commentsCount: 0,
    createdAt: firestore.FieldValue.serverTimestamp(),
  };

  try {
    const postsCollection = firestore.collection("posts");
    const docRef = await postsCollection.add(post);
    console.log("Post created successfully with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating post:", error.message);
    throw new Error(`Failed to create post: ${error.message}`);
  }
};

module.exports = addPost;
