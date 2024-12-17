import firestore from "@react-native-firebase/firestore";

// Add a new document to a collection
export const addDocument = async (collection: string, data: object) => {
  return await firestore().collection(collection).add(data);
};

// Fetch all documents from a collection
export const getAllDocuments = async (collection: string) => {
  const snapshot = await firestore().collection(collection).get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Delete a document by ID
export const deleteDocument = async (collection: string, docId: string) => {
  return await firestore().collection(collection).doc(docId).delete();
};
