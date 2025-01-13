const admin = require("firebase-admin");

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    storageBucket: "kara-ac8b6.appspot.com",
  });
}

// Export Firestore and Storage instances for backend
const db = admin.firestore(); // Firestore instance
const storage = admin.storage(); // Storage instance

module.exports = {admin, db, storage};
