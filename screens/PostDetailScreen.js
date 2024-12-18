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
    <View style={styles.screen}>
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
            <TouchableOpacity
              style={{ flexDirection: "row" }}
              onPress={() => {
                navigation.navigate("UserProfileScreen", {
                  backWhite: true,
                  ViewUser: true,
                });
              }}
            >
              <Image
                source={post.userPicturePath ? { uri: post.userPicturePath } : { uri: "https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg" }}
                style={styles.userAvatar}
              />
              <View style={{ marginLeft: 10 }}>
                <Text style={{ color: "white", fontWeight: "bold", fontSize: 15 }}>{post.username}</Text>
                <Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: "bold" }}>{new Date(post.createdAt).toLocaleDateString("en-CA")}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {/* Post Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{post.title}</Text>
        <View style={styles.tagsContainer}>
          {post.tags.map((tag, index) => (
            <Text key={index} style={styles.tag}>{tag}</Text>
          ))}
        </View>
        <Text style={styles.price}>${post.prices.amount}</Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={15} color={GlobalStyles.colors.magenta} />
          <Text style={styles.location}>{post.location ? post.location : "Location not available"}</Text>
        </View>
        <Text style={styles.description}>{post.description}</Text>
      </View>

      {/* Post Stats */}
      <View style={styles.statsContainer}>
        <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color={GlobalStyles.colors.greenLight} style={styles.icon} />
        <Text style={styles.statsText}>{isFavorite ? "Added to favorites" : `${post.likes.length} likes`}</Text>
        <Ionicons name="chatbubble-ellipses" size={24} color={GlobalStyles.colors.blue} style={styles.icon} />
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

      {/* Images Below Social Media Links */}
      <Text style={styles.seeMoreText}>See more of us</Text>
      <FlatList
        data={[
          { id: "1", imageUrl: "https://www.lehighvalleygrandprix.com/wp-content/uploads/2018/02/Go_Kart_Speed-1.jpg" },
          { id: "2", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/94/2013_Australian_Open_-_Guillaume_Rufin.jpg" },
          { id: "3", imageUrl: "https://www.kunstloft.com/wordpress/en_UK/eu/wp-content/uploads/2023/07/Painter-with-landscape-painting.jpg" },
          { id: "4", imageUrl: "https://visitorinvictoria.ca/wp-content/uploads/2016/09/ranurte-a-CnhYgTenY-unsplash.jpg" },
          { id: "5", imageUrl: "https://www.villevillemarie.org/wp-content/uploads/2023/06/Parc-des-Clubs_01-scaled.jpeg" },
          { id: "6", imageUrl: "https://www.capdagde.com/app/uploads/2022/10/AdobeStock-discotheque-1198x800.jpeg" },
          { id: "7", imageUrl: "https://bigkahunas.com/destin/wp-content/uploads/sites/11/2023/11/Big-Kahunas-Destin-Water-Park-226.jpg" },
          { id: "8", imageUrl: "https://www.ivazio.com/wp-content/uploads/2022/08/karaoke-3-chanteurs-1-2560x1920.jpg" },
          { id: "9", imageUrl: "https://www.levelupreality.ca/wp-content/uploads/2024/09/Couple-Playing-Escape-Simulator.webp" },
        ]}
        keyExtractor={item => item.id}
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
