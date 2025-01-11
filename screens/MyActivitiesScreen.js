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
import { collection, getDocs } from "firebase/firestore";
import { firestore, storage } from "../firebase"; // Import Firestore and Storage instances
import { getDownloadURL, ref } from "firebase/storage";

function MyActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch activities from Firestore and resolve image URLs
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "activities"));

        const activitiesData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const data = doc.data();

            // Resolve the image URL from Firebase Storage
            let imageUrl = null;
            if (data.imagePath) {
              const imageRef = ref(storage, data.imagePath);
              imageUrl = await getDownloadURL(imageRef);
            }

            return {
              id: doc.id,
              ...data,
              imageUrl, // Add the resolved image URL
            };
          })
        );

        setActivities(activitiesData);
      } catch (error) {
        console.error("Error fetching activities:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Render each activity card
  const renderActivity = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>No Image</Text>
        </View>
      )}
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={GlobalStyles.colors.purple} />
        </View>
      ) : activities.length > 0 ? (
        <FlatList
          data={activities}
          renderItem={renderActivity}
          keyExtractor={(item) => item.id}
          numColumns={3} // Display 3 cards per row
          columnWrapperStyle={styles.columnWrapper}
        />
      ) : (
        <View style={styles.noActivitiesContainer}>
          <Text style={styles.noActivitiesText}>No activities published yet!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary,
    padding: 10,
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
    width: "30%",
    height: 150,
    overflow: "hidden",
    elevation: 3,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "70%",
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: "100%",
    height: "70%",
    backgroundColor: GlobalStyles.colors.gray,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    color: "white",
    fontSize: 14,
  },
  title: {
    marginTop: 5,
    color: GlobalStyles.colors.primary,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  noActivitiesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noActivitiesText: {
    color: "white",
    fontSize: 18,
  },
});

export default MyActivities;
