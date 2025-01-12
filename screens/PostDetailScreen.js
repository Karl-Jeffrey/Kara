import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { GlobalStyles } from "../constants/Styles";
import { db } from "../firebase"; // Import Firebase Firestore instance
import { doc, updateDoc } from "firebase/firestore";

const { width } = Dimensions.get("window");

const PostDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { post } = route.params;

  const {
    id,
    picturePath = "",
    userPicturePath = "",
    username = "Unknown User",
    createdAt = Date.now(),
    title = "Untitled",
    tags = [],
    prices = { amount: "0.00" },
    location = "Location not available",
    description = "",
    likes = [],
    comments = [],
    socialMedia = {},
  } = post || {};

  const [isFavorite, setIsFavorite] = useState(false);

  const handleSave = async () => {
    try {
      if (id) {
        const postDocRef = doc(db, "posts", id);
        await updateDoc(postDocRef, {
          isFavorite: !isFavorite,
        });
        setIsFavorite(!isFavorite);
        console.log(isFavorite ? "Removed from favorites" : "Added to favorites");
      } else {
        console.warn("Post ID is missing. Cannot update favorites.");
      }
    } catch (error) {
      console.error("Error updating favorite status:", error.message);
    }
  };

  const openSocialMedia = (platform) => {
    const urls = {
      facebook: socialMedia.facebook || "https://facebook.com",
      instagram: socialMedia.instagram || "https://instagram.com",
      twitter: socialMedia.twitter || "https://twitter.com",
    };
    const url = urls[platform];
    console.log(`Opening ${platform}: ${url}`);
    // In a real app, you'd use Linking.openURL(url)
  };

  if (!post) {
    return (
      <View style={styles.screen}>
        <Text style={{ color: "white", textAlign: "center", marginTop: 20 }}>
          Post not found.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ImageBackground
        source={{ uri: picturePath }}
        style={styles.imageBackground}
        imageStyle={{ resizeMode: "cover" }}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.6)", "transparent"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.gradientOverlay}
        />
        <View style={styles.headerInfo}>
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={() => navigation.navigate("UserProfileScreen", { backWhite: true, ViewUser: true })}
          >
            <Image
              source={{
                uri: userPicturePath || "https://example.com/default-avatar.png",
              }}
              style={styles.userAvatar}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={{ color: "white", fontWeight: "bold", fontSize: 15 }}>{username}</Text>
              <Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: "bold" }}>
                {new Date(createdAt).toLocaleDateString("en-CA")}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.tagsContainer}>
          {tags.map((tag, index) => (
            <Text key={`tag-${index}`} style={styles.tag}>
              {tag}
            </Text>
          ))}
        </View>
        <Text style={styles.price}>${prices.amount}</Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={15} color={GlobalStyles.colors.magenta} />
          <Text style={styles.location}>{location}</Text>
        </View>
        <Text style={styles.description}>{description}</Text>
      </View>

      <View style={styles.statsContainer}>
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={24}
          color={GlobalStyles.colors.greenLight}
          style={styles.icon}
        />
        <Text style={styles.statsText}>
          {isFavorite ? "Added to favorites" : `${likes.length || 0} likes`}
        </Text>
        <Ionicons
          name="chatbubble-ellipses"
          size={24}
          color={GlobalStyles.colors.blue}
          style={styles.icon}
        />
        <Text style={styles.statsText}>{comments.length || 0} comments</Text>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={20} color="white" />
        <Text style={styles.saveButtonText}>
          {isFavorite ? "Remove from Favorite" : "Add to Favorite"}
        </Text>
      </TouchableOpacity>

      <View style={styles.socialMediaContainer}>
        <Text style={styles.socialMediaHeader}>Find us on:</Text>
        <View style={styles.socialMediaButtons}>
          <TouchableOpacity style={styles.socialButton} onPress={() => openSocialMedia("facebook")}>
            <Ionicons name="logo-facebook" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={() => openSocialMedia("instagram")}>
            <Ionicons name="logo-instagram" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={() => openSocialMedia("twitter")}>
            <Ionicons name="logo-twitter" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.seeMoreText}>See more of us</Text>
      <FlatList
        data={[
          { id: "1", imageUrl: "https://example.com/image1.jpg" },
          { id: "2", imageUrl: "https://example.com/image2.jpg" },
          // Add more images here...
        ]}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
          </View>
        )}
        contentContainerStyle={{ padding: 10 }}
      />
    </View>
  );
};

export default PostDetailScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary300,
  },
  imageBackground: {
    width: "100%",
    height: width * 0.6,
    justifyContent: "flex-end",
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    height: 100,
    width: "100%",
  },
  headerInfo: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white"
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  tag: {
    backgroundColor: GlobalStyles.colors.blue,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    margin: 5,
    fontSize: 12,
    color: "white",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: GlobalStyles.colors.green,
    marginBottom: 10,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  location: {
    marginLeft: 5,
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
  },
  description: {
    fontSize: 16,
    color: "white",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: GlobalStyles.colors.primary200,
    padding: 10,
  },
  statsText: {
    fontSize: 12,
    color: "white",
    marginLeft: 5,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GlobalStyles.colors.blue,
    padding: 10,
    marginVertical: 10,
    justifyContent: "center",
  },
  saveButtonText: {
    color: "white",
    marginLeft: 5,
  },
  socialMediaContainer: {
    padding: 20,
    backgroundColor: GlobalStyles.colors.primary300,
    marginVertical: 10,
  },
  socialMediaHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  socialMediaButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  socialButton: {
    backgroundColor: GlobalStyles.colors.blue,
    borderRadius: 25,
    padding: 10,
  },
  card: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
  },
  seeMoreText: {
    fontSize: 18,
    fontWeight: "bold",
    color: GlobalStyles.colors.purple,
    textAlign: "center",
    marginVertical: 10,
  },
});
