import { firestore } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const addPost = async (data) => {
  // Destructure the required fields from the data parameter
  const {
    activityId,
    userId,
    content,
    imageUrl,
    likesCount = 0,
    commentsCount = 0,
  } = data;

  // Construct the post object
  const post = {
    activityId,
    userId,
    content,
    imageUrl: imageUrl || "", // Ensure imageUrl is never undefined
    likesCount,
    commentsCount,
    createdAt: serverTimestamp(),
  };

  try {
    // Add the post to the "posts" collection in Firestore
    const docRef = await addDoc(collection(firestore, "posts"), post);
    console.log("Post added successfully with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding post: ", error.message);
    throw error; // Rethrow the error for handling in the calling function
  }
};

export default addPost;
