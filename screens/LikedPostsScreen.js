import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import { GlobalStyles } from "../constants/Styles"; // Import GlobalStyles

const LikedPostsScreen = () => {
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating fetching liked posts data
    setTimeout(() => {
      setLikedPosts([
        { id: "1", title: "GoKart", imageUrl: "https://www.lehighvalleygrandprix.com/wp-content/uploads/2018/02/Go_Kart_Speed-1.jpg" },
        { id: "2", title: "Tennis", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/94/2013_Australian_Open_-_Guillaume_Rufin.jpg" },
        { id: "3", title: "Painting", imageUrl: "https://www.kunstloft.com/wordpress/en_UK/eu/wp-content/uploads/2023/07/Painter-with-landscape-painting.jpg" },
        { id: "4", title: "Library", imageUrl: "https://visitorinvictoria.ca/wp-content/uploads/2016/09/ranurte-a-CnhYgTenY-unsplash.jpg" },
        { id: "5", title: "Parc", imageUrl: "https://www.villevillemarie.org/wp-content/uploads/2023/06/Parc-des-Clubs_01-scaled.jpeg" },
        { id: "6", title: "Discothèque", imageUrl: "https://www.capdagde.com/app/uploads/2022/10/AdobeStock-discotheque-1198x800.jpeg" },
        { id: "7", title: "MiniGolf", imageUrl: "https://bigkahunas.com/destin/wp-content/uploads/sites/11/2023/11/Big-Kahunas-Destin-Water-Park-226.jpg" },
        { id: "8", title: "Karaoke", imageUrl: "https://www.ivazio.com/wp-content/uploads/2022/08/karaoke-3-chanteurs-1-2560x1920.jpg" },
        { id: "9", title: "VR", imageUrl: "https://www.levelupreality.ca/wp-content/uploads/2024/09/Couple-Playing-Escape-Simulator.webp" },
      ]);
      setLoading(false);
    }, 2000); // Simulating data fetch delay
  }, []);

  const renderPost = ({ item }) => (
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
      <Text style={styles.header}>Liked Posts</Text>
      <FlatList
        data={likedPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        numColumns={3} // To display 3 items per row
        columnWrapperStyle={styles.columnWrapper} // Styling for rows
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary, // Apply primary color as background
    padding: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 50, // Added marginTop to lower the text
    marginBottom: 40, // Lower the text by increasing the marginBottom
    textAlign: "center",
    color: "white", // White text for better visibility
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
    width: "30%", // This ensures each card is a third of the screen width
    height: 200, // Fixed height for the cards to remain long
  },
  image: {
    width: "100%",
    height: "100%", // Make image fill the whole card
    borderRadius: 8,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
});

export default LikedPostsScreen;
