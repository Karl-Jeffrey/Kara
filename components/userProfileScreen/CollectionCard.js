import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const { height, width } = Dimensions.get("window");
// Set the card width and height
const size = width / 2 - 20; // Making the cards half the screen width
const cardHeight = size * 1.5; // Set the card height to be higher than the width

const CollectionCard = ({ title }) => {
  const navigation = useNavigation(); // Initialize navigation

  // Determine the image based on the title
  let imageSource;
  if (title === "Favorite Posts") {
    imageSource = require("../../assets/LikedPosts.png"); // Image for LikedPosts
  } else if (title === "Favorite Activities") {
    imageSource = require("../../assets/LikedActivities.png"); // Image for LikedActivities
  }

  // Handle the press event
  const handlePress = () => {
    if (title === "Favorite Activities") {
      navigation.navigate("LikedActivitiesScreen"); // Navigate to "LikedActivitiesScreen"
    } else if (title === "Favorite Posts") {
      navigation.navigate("LikedPostsScreen"); // Navigate to "LikedPostsScreen"
    }
  };

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      {/* Add an image for the background */}
      <Image source={imageSource} style={styles.image} />
      {/* Title */}
      <View style={{ position: "absolute" }}>
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 24, // Larger text size for better visibility
          }}
        >
          {title} {/* Display the title */}
        </Text>
      </View>
    </Pressable>
  );
};

export default CollectionCard;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    overflow: "hidden",
    margin: 10, // Increase the margin for spacing
    marginTop: 30, // Add margin to lower the card
    backgroundColor: "black", // This ensures the background color of the card
    width: size, // Set width
    height: cardHeight, // Set height to be higher than the width
  },
  image: {
    width: "100%", // Set the image width to fill the container
    height: "100%", // Set the image height to fill the container
    opacity: 0.5, // Add transparency if necessary
    borderRadius: 20, // Optional: round the image corners to match the card
  },
});
