import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { GlobalStyles } from "../constants/Styles";

const { width } = Dimensions.get("window");

const PostDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { post } = route.params;

  const [isFavorite, setIsFavorite] = useState(false);

  const handleSave = () => {
    console.log(isFavorite ? "Removed from favorites" : "Added to favorites");
    setIsFavorite(!isFavorite);
    // Add logic to toggle favorite state (e.g., update database)
  };

  const openSocialMedia = (platform) => {
    const urls = {
      facebook: post.socialMedia?.facebook || "https://facebook.com",
      instagram: post.socialMedia?.instagram || "https://instagram.com",
      twitter: post.socialMedia?.twitter || "https://twitter.com",
    };
    const url = urls[platform];
    console.log(`Opening ${platform}: ${url}`);
    // In a real app, you'd use Linking.openURL(url)
  };

  return (
    <ScrollView style={styles.screen}>
      {/* Post Image */}
      <ImageBackground
        source={{ uri: post.picturePath }}
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
          <View style={{ flexDirection: "row" }}>
            <Pressable
              style={{ flexDirection: "row" }}
              onPress={() => {
                navigation.navigate("UserProfileScreen", {
                  backWhite: true,
                  ViewUser: true,
                });
              }}
            >
              <Image
                source={
                  post.userPicturePath
                    ? { uri: post.userPicturePath }
                    : {
                        uri: "https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg",
                      }
                }
                style={styles.userAvatar}
              />
              <View style={{ marginLeft: 10 }}>
                <Text style={{ color: "white", fontWeight: "bold", fontSize: 15 }}>
                  {post.username}
                </Text>
                <Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: "bold" }}>
                  {new Date(post.createdAt).toLocaleDateString("en-CA")}
                </Text>
              </View>
            </Pressable>
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

        <View style={styles.locationContainer}>
          <Ionicons name="location" size={15} color={GlobalStyles.colors.gray} />
          <Text style={styles.location}>{post.location}</Text>
        </View>

        <Text style={styles.description}>{post.description}</Text>
      </View>

      {/* Post Stats */}
      <View style={styles.statsContainer}>
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={24}
          color={GlobalStyles.colors.greenLight}
          style={styles.icon}
        />
        <Text style={styles.statsText}>{isFavorite ? "Added to favorites" : `${post.likes.length} likes`}</Text>
        <Ionicons
          name="chatbubble-ellipses"
          size={24}
          color={GlobalStyles.colors.blue}
          style={styles.icon}
        />
        <Text style={styles.statsText}>{post.comments.length} comments</Text>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={20} color="white" />
        <Text style={styles.saveButtonText}>{isFavorite ? "Remove from Favorite" : "Add to Favorite"}</Text>
      </TouchableOpacity>

      {/* Social Media Links */}
      <View style={styles.socialMediaContainer}>
        <Text style={styles.socialMediaHeader}>Find us on:</Text>
        <View style={styles.socialMediaButtons}>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => openSocialMedia("facebook")}
          >
            <Ionicons name="logo-facebook" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => openSocialMedia("instagram")}
          >
            <Ionicons name="logo-instagram" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => openSocialMedia("twitter")}
          >
            <Ionicons name="logo-twitter" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: GlobalStyles.colors.purple,
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
    gap: 5,
  },
  tag: {
    backgroundColor: GlobalStyles.colors.blue,
    color: "white",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: "bold",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: GlobalStyles.colors.greenLight,
    marginVertical: 10,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  location: {
    color: GlobalStyles.colors.gray,
    marginLeft: 5,
  },
  description: {
    fontSize: 16,
    color: "white",
    marginTop: 10,
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  icon: {
    marginHorizontal: 10,
  },
  statsText: {
    color: "white",
    fontSize: 16,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: GlobalStyles.colors.purple,
    margin: 20,
    padding: 10,
    borderRadius: 10,
  },
  saveButtonText: {
    color: "white",
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  socialMediaContainer: {
    padding: 20,
    alignItems: "center",
  },
  socialMediaHeader: {
    fontSize: 18,
    color: "white",
    marginBottom: 10,
  },
  socialMediaButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  socialButton: {
    backgroundColor: GlobalStyles.colors.blue,
    padding: 10,
    borderRadius: 50,
  },
});
