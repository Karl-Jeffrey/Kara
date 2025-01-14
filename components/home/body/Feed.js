import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Image,
  Dimensions,
} from "react-native";
import { GlobalStyles } from "../../../constants/Styles";
import { collection, getDocs } from "firebase/firestore";
import { firestore, storage } from "../../../firebase";
import { getDownloadURL, ref } from "firebase/storage";
import { useSharedValue } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const Feed = ({ StoryTranslate }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const lastScrollY = useSharedValue(0);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "activities"));

        const activitiesData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const data = doc.data();

            let imageUrl = null;
            if (data.imagePath) {
              const imageRef = ref(storage, data.imagePath);
              imageUrl = await getDownloadURL(imageRef);
            }

            return {
              id: doc.id,
              ...data,
              imageUrl,
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

  const renderActivityItem = ({ item }) => {
    return (
      <View style={styles.card}>
        {/* Image Section */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.cardImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.5)", "transparent"]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={styles.gradient}
          />
        </View>

        {/* Content Section */}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{item.title || "Activity Title"}</Text>
          <Text style={styles.price}>${item.price || "0.00"}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: GlobalStyles.colors.primary }}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={GlobalStyles.colors.purple} />
        </View>
      ) : activities.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 10,
            paddingBottom: GlobalStyles.styles.tabBarPadding,
            gap: 20,
          }}
          onMomentumScrollBegin={(event) => {
            const scrollY = event.nativeEvent.contentOffset.y;
            if (scrollY > lastScrollY.value) StoryTranslate.value = true;
            else {
              StoryTranslate.value = false;
            }
          }}
          onMomentumScrollEnd={(event) => {
            const scrollY = event.nativeEvent.contentOffset.y;
            lastScrollY.value = scrollY;
          }}
          refreshControl={<RefreshControl refreshing={false} onRefresh={() => {}} />}
          keyExtractor={(item) => item.id}
          data={activities}
          renderItem={renderActivityItem}
        />
      ) : (
        <View style={styles.noActivitiesContainer}>
          <Text style={styles.noActivitiesText}>No activities available!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    overflow: "hidden",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: GlobalStyles.colors.primary500,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    height: 40,
    width: "100%",
  },
  contentContainer: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  price: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
  },
});

export default Feed;
