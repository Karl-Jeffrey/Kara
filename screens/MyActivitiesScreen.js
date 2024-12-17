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

function MyActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simuler la récupération des activités publiées par l'utilisateur
  useEffect(() => {
    setTimeout(() => {
      setActivities([
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
    }, 2000); // Simule un délai d'appel API
  }, []);

  const renderActivity = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
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
          numColumns={3} // 3 cartes par ligne
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
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
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
