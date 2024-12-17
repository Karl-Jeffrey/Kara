import firestore from "@react-native-firebase/firestore";

// Fetch user profile by user ID
export const getUserProfile = async (userId: string) => {
  const doc = await firestore().collection("users").doc(userId).get();
  return doc.exists ? doc.data() : null;
};

// Update user profile
export const updateUserProfile = async (userId: string, data: object) => {
  return await firestore().collection("users").doc(userId).update(data);
};
