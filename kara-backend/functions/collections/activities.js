const admin = require("firebase-admin");
const {v4: uuidv4} = require("uuid"); // For generating unique file names


exports.createActivity = async (data, file) => {
  const {
    activityId,
    title,
    description,
    category,
    price,
    imageUrl,
    maxParticipants,
    createdBy,
    isBusinessActivity,
    businessDetails,
    location,
    availability,
  } = data;

  if (!activityId || !title || !description) {
    throw new Error(
        "Missing required fields: activityId, title, or description",
    );
  }

  try {
    console.log("Initializing activity creation...");
    const bucket = admin.storage().bucket();
    let finalImageUrl = imageUrl || null;

    if (file) {
      const fileName = `activities/${activityId}_${uuidv4()}`;
      const fileUpload = bucket.file(fileName);

      console.log("Uploading file to Firebase Storage:", fileName);

      await fileUpload.save(file.buffer, {
        metadata: {contentType: file.mimetype},
      });

      await fileUpload.makePublic();
      finalImageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      console.log("File uploaded successfully. Public URL:", finalImageUrl);
    }

    console.log("Saving activity to Firestore...");
    const activityRef = admin
        .firestore()
        .collection("activities")
        .doc(activityId);

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
      imageUrl: finalImageUrl,
      createdAt: admin.firestore.Timestamp.now(),
    });

    console.log("Activity created successfully.");
  } catch (error) {
    console.error("Error creating activity:", error.message);
    throw error;
  }
};
exports.getActivities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const startAfter = req.query.startAfter || null;
    const category = req.query.category || null;

    console.log("Fetching activities...");
    console.log("Query parameters:", {limit, startAfter, category});

    let query = admin
        .firestore()
        .collection("activities")
        .orderBy("createdAt", "desc")
        .limit(limit);

    if (startAfter) {
      const lastDoc = await admin
          .firestore()
          .collection("activities")
          .doc(startAfter)
          .get();

      if (!lastDoc.exists) {
        console.error("Invalid startAfter document ID:", startAfter);
        return res
            .status(400)
            .json({error: "Invalid startAfter document ID"});
      }
      query = query.startAfter(lastDoc);
    }

    if (category) {
      query = query.where("category", "==", category);
    }

    console.log("Executing Firestore query...");
    const activitiesSnapshot = await query.get();

    const activities = activitiesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Activities fetched successfully. Count:", activities.length);
    res.status(200).json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error.message);
    res
        .status(500)
        .json({error: `Unable to fetch activities: ${error.message}`});
  }
};
