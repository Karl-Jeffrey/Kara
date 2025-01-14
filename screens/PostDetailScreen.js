import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
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
    likes: [1, 2, 3], // Sample likes
    comments: [
      { user: "Jane", comment: "This looks fun!" },
      { user: "Mike", comment: "Would love to join!" },
    ], // Sample comments
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
      <ScrollView contentContainerStyle={styles.content}>
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

        {/* Social Media Links */}
        <View style={styles.socialMediaContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("WebView", { url: post.socialMedia.facebook })}>
            <Ionicons name="logo-facebook" size={30} color={GlobalStyles.colors.blue} style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("WebView", { url: post.socialMedia.instagram })}>
            <Ionicons name="logo-instagram" size={30} color={GlobalStyles.colors.purpleDark} style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("WebView", { url: post.socialMedia.twitter })}>
            <Ionicons name="logo-twitter" size={30} color={GlobalStyles.colors.cyan} style={styles.socialIcon} />
          </TouchableOpacity>
        </View>

        {/* Likes and Comments */}
        <View style={styles.likesCommentsContainer}>
          <View style={styles.likesContainer}>
            <Ionicons name="heart" size={20} color={GlobalStyles.colors.red} />
            <Text style={styles.likesCount}>{post.likes.length} Likes</Text>
          </View>
          <View style={styles.commentsContainer}>
            <Ionicons name="chatbox" size={20} color={GlobalStyles.colors.greenLight} />
            <Text style={styles.commentsCount}>{post.comments.length} Comments</Text>
          </View>
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: GlobalStyles.colors.primary300 },
  imageBackground: { height: 300, justifyContent: "flex-end" },
  gradientOverlay: { height: "30%" },
  headerInfo: { padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  userAvatar: { width: 50, height: 50, borderRadius: 25 },
  username: { color: "white", fontWeight: "bold", fontSize: 16 },
  date: { color: "rgba(255,255,255,0.6)", fontSize: 12 },
  content: { padding: 16, paddingBottom: 80 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 8, color: GlobalStyles.colors.primary100 },
  tagsContainer: { flexDirection: "row", marginBottom: 8 },
  tag: {
    backgroundColor: GlobalStyles.colors.primary200,
    padding: 6,
    borderRadius: 6,
    marginRight: 8,
    color: "white",
    fontSize: 14,
  },
  price: { fontSize: 20, fontWeight: "bold", color: GlobalStyles.colors.green, marginBottom: 10 },
  location: { fontSize: 16, color: GlobalStyles.colors.gray, marginVertical: 8 },
  description: { fontSize: 16, color: GlobalStyles.colors.black, marginBottom: 20 },
  socialMediaContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 15,
  },
  socialIcon: {
    marginHorizontal: 20,
  },
  likesCommentsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  likesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  likesCount: {
    marginLeft: 5,
    fontSize: 16,
    color: GlobalStyles.colors.primary100,
  },
  commentsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentsCount: {
    marginLeft: 5,
    fontSize: 16,
    color: GlobalStyles.colors.primary100,
  },
  saveButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GlobalStyles.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 30,
  },
  saveButtonText: { color: "white", marginLeft: 8, fontSize: 16 },
});

export default PostDetailScreen;
