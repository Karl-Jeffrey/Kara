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
  TouchableOpacity,
} from "react-native";
import { GlobalStyles } from "../../../constants/Styles";
import { collection, getDocs } from "firebase/firestore";
import { firestore, storage } from "../../../firebase";
import { getDownloadURL, ref } from "firebase/storage";
import { useSharedValue } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

const { width } = Dimensions.get("window");

const Feed = ({ StoryTranslate, navigation }) => {
  const [activities, setActivities] = useState([]);
  const [likedActivities, setLikedActivities] = useState({});
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

  const toggleLike = (id) => {
    setLikedActivities((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const renderActivityItem = ({ item }) => {
    const isLiked = likedActivities[item.id];

    return (
      <View style={styles.card}>
        {/* Image Section */}
        <View style={styles.imageContainer}>
          {item.imageUrl ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.cardImage}
              resizeMode="cover"
            />
          ) : null}
          <LinearGradient
            colors={["rgba(0,0,0,0.5)", "transparent"]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={styles.gradient}
          />
        </View>

        {/* Content Section */}
        <View style={styles.contentContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title || "Activity Title"}</Text>
            <Text style={styles.price}>${item.price || "0.00"}</Text>
          </View>
          <TouchableOpacity onPress={() => toggleLike(item.id)}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={24}
              color={isLiked ? GlobalStyles.colors.red : "#555"}
            />
          </TouchableOpacity>
        </View>

        {/* View Details Button */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("PostDetailScreen", {
              post: {
                picturePath: "https://via.placeholder.com/600",
                userPicturePath: "https://via.placeholder.com/100",
                username: "John Doe",
                createdAt: new Date(),
                title: "Sample Activity Title",
                tags: ["Outdoor", "Adventure"],
                prices: { amount: "50" },
                location: "Montreal, QC",
                description:
                  "This is a sample description for the activity. Come and enjoy a wonderful experience!",
                likes: [],
                comments: [],
                socialMedia: {
                  facebook: "https://facebook.com/sample",
                  instagram: "https://instagram.com/sample",
                  twitter: "https://twitter.com/sample",
                },
              },
            })
          }
          style={styles.viewDetailsButton}
        >
          <Text style={styles.viewDetailsText}>View Details</Text>
        </TouchableOpacity>
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
        <Text style={styles.noActivitiesText}>No activities found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    marginHorizontal: 10,
  },
  imageContainer: {
    width: "100%",
    height: 200,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: GlobalStyles.colors.black,
  },
  price: {
    fontSize: 14,
    color: GlobalStyles.colors.green,
  },
  viewDetailsButton: {
    backgroundColor: GlobalStyles.colors.blue,
    padding: 10,
    alignItems: "center",
  },
  viewDetailsText: {
    color: "white",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noActivitiesText: {
    textAlign: "center",
    fontSize: 16,
    color: GlobalStyles.colors.gray,
  },
});

export default Feed;
