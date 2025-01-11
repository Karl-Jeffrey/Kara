const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid"); // For generating unique file names

// Create a new activity
exports.createActivity = async (data, file) => {
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
  } = data;

  try {
    const bucket = admin.storage().bucket(); // Access the default storage bucket
    let imageUrl = null;

    // Upload the file to Firebase Storage if provided
    if (file) {
      const fileName = `activities/${activityId}_${uuidv4()}`; // Unique file name in Storage
      const fileUpload = bucket.file(fileName);

      // Upload the file to Firebase Storage
      await fileUpload.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });

      // Make the file public or generate a signed URL
      await fileUpload.makePublic();
      imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    }

    // Save the activity to Firestore
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
      imageUrl: imageUrl || null, // Add the generated URL here
      createdAt: admin.firestore.Timestamp.now(),
    });

    console.log("Activity created successfully with image");
  } catch (error) {
    console.error("Error creating activity:", error.message);
    throw error;
  }
};

// Get all activities
exports.getActivities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // Pagination limit
    const startAfter = req.query.startAfter || null; // Start after this document
    const category = req.query.category || null; // Optional filter by category

    let query = admin.firestore().collection("Activities").orderBy("createdAt", "desc").limit(limit);

    if (startAfter) {
      const lastDoc = await admin.firestore().collection("Activities").doc(startAfter).get();
      if (lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }

    if (category) {
      query = query.where("category", "==", category);
    }

    const activitiesSnapshot = await query.get();
    const activities = activitiesSnapshot.docs.map((doc) => ({
      id: doc.id, // Document ID
      ...doc.data(), // Activity data
    }));

    res.status(200).json(activities); // Send the activities as a JSON response
  } catch (error) {
    console.error("Error fetching activities:", error.message);
    res.status(500).json({ error: `Unable to fetch activities: ${error.message}` });
  }
};
