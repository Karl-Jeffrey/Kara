import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { GlobalStyles } from "../constants/Styles"; // Import GlobalStyles
import { collection, getDocs, query, where } from "firebase/firestore"; // Firebase Firestore imports
import { firestore } from "../firebase"; // Use shared Firestore instance

const LikedActivitiesScreen = ({ userId }) => {
  const [likedActivities, setLikedActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedActivities = async () => {
      try {
        // Fetch the "Likes" collection for the current user
        const likesQuery = query(
          collection(firestore, "Likes"),
          where("userId", "==", userId)
        );
        const likesSnapshot = await getDocs(likesQuery);
        const likedActivityIds = likesSnapshot.docs.map((doc) => doc.data().activityId);

        // Fetch the corresponding activities from the "Activities" collection
        if (likedActivityIds.length > 0) {
          const activitiesSnapshot = await getDocs(collection(firestore, "Activities"));
          const activitiesData = activitiesSnapshot.docs
            .map((doc) => doc.data())
            .filter((activity) => likedActivityIds.includes(activity.activityId));

          setLikedActivities(activitiesData);
        } else {
          setLikedActivities([]); // No likes found
        }
      } catch (error) {
        console.error("Error fetching liked activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedActivities();
  }, [userId]);

  const renderActivity = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Favorite Activities</Text>
      <FlatList
        data={likedActivities}
        renderItem={renderActivity}
        keyExtractor={(item) => item.activityId}
        numColumns={3} // Display 3 items per row
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary,
    padding: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 50,
    marginBottom: 40,
    textAlign: "center",
    color: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    margin: 5,
    elevation: 5,
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    width: "30%",
    height: 200,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
});

export default LikedActivitiesScreen;
