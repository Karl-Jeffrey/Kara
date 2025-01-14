import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { GlobalStyles } from "../constants/Styles";

const PostDetailScreen = () => {
  const navigation = useNavigation();
  const [isFavorite, setIsFavorite] = useState(false);

  // Hardcoded placeholder post details
  const post = {
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
  };

  const handleSave = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <View style={styles.screen}>
      {/* Post Image */}
      <ImageBackground
        source={{ uri: post.picturePath }}
        style={styles.imageBackground}
        imageStyle={{ resizeMode: "cover" }}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.6)", "transparent"]}
          style={styles.gradientOverlay}
        />
        <View style={styles.headerInfo}>
          <View style={{ flexDirection: "row" }}>
            <Image
              source={{ uri: post.userPicturePath }}
              style={styles.userAvatar}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.username}>{post.username}</Text>
              <Text style={styles.date}>
                {new Date(post.createdAt).toLocaleDateString("en-CA")}
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>

      {/* Post Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{post.title}</Text>
        <View style={styles.tagsContainer}>
          {post.tags.map((tag, index) => (
            <Text key={index} style={styles.tag}>
              {tag}
            </Text>
          ))}
        </View>
        <Text style={styles.price}>${post.prices.amount}</Text>
        <Text style={styles.location}>
          <Ionicons name="location" size={15} color={GlobalStyles.colors.magenta} />{" "}
          {post.location}
        </Text>
        <Text style={styles.description}>{post.description}</Text>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={20}
          color="white"
        />
        <Text style={styles.saveButtonText}>
          {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "white" },
  imageBackground: { height: 300, justifyContent: "flex-end" },
  gradientOverlay: { height: "30%" },
  headerInfo: { padding: 16 },
  userAvatar: { width: 50, height: 50, borderRadius: 25 },
  username: { color: "white", fontWeight: "bold", fontSize: 16 },
  date: { color: "rgba(255,255,255,0.6)", fontSize: 12 },
  content: { padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  tagsContainer: { flexDirection: "row", marginBottom: 8 },
  tag: {
    backgroundColor: GlobalStyles.colors.primary200,
    padding: 4,
    borderRadius: 4,
    marginRight: 8,
    color: "white",
  },
  price: { fontSize: 18, fontWeight: "bold", color: GlobalStyles.colors.green },
  location: { fontSize: 16, color: GlobalStyles.colors.gray, marginVertical: 8 },
  description: { fontSize: 16, color: GlobalStyles.colors.black, marginBottom: 16 },
  saveButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GlobalStyles.colors.primary,
    padding: 12,
    borderRadius: 8,
    margin: 16,
  },
  saveButtonText: { color: "white", marginLeft: 8 },
});

export default PostDetailScreen;
