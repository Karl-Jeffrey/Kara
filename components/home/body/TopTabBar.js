import React, { useEffect, useState } from "react";
import {
  Animated,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  FlatList,
} from "react-native";
import { getFirestore, collection, getDocs } from "firebase/firestore"; // Firebase Firestore imports
import { firebaseApp } from "../firebaseConfig"; // Your Firebase configuration file

const { width } = Dimensions.get("window");

function TopTabBar({ navigation, position }) {
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const tabWidth = width / (categories.length || 1);

  const translateX = position.interpolate({
    inputRange: categories.map((_, i) => i),
    outputRange: categories.map((_, i) => i * tabWidth),
  });

  const db = getFirestore(firebaseApp); // Initialize Firestore

  // Fetch activities from Firestore
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const activitiesCollection = collection(db, "Activities"); // Reference the 'Activities' collection
        const activitiesSnapshot = await getDocs(activitiesCollection);
        const activitiesData = activitiesSnapshot.docs.map((doc) => doc.data());
        setActivities(activitiesData);

        // Extract unique categories from activities
        const uniqueCategories = [
          ...new Set(activitiesData.map((activity) => activity.category)),
        ];
        setCategories(uniqueCategories);
        setSelectedCategory(uniqueCategories[0]); // Set the first category as default
      } catch (error) {
        console.error("Error fetching activities from Firestore:", error);
      }
    };

    fetchActivities();
  }, []);

  const filteredActivities = activities.filter(
    (activity) => activity.category === selectedCategory
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {categories.map((category, index) => {
          const isFocused = selectedCategory === category;

          const onPress = () => {
            setSelectedCategory(category);
            navigation.navigate(category); // Optional: Navigate if each category has a separate screen
          };

          const inputRange = categories.map((_, i) => i);
          const opacity = position.interpolate({
            inputRange,
            outputRange: inputRange.map((i) => (i === index ? 1 : 0.5)),
          });

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={[styles.tab, { width: tabWidth }]}
            >
              <Animated.Text style={{ opacity }}>{category}</Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Animated.View
        style={[
          styles.indicator,
          {
            width: tabWidth,
            transform: [{ translateX }],
          },
        ]}
      />
      <View style={styles.content}>
        <FlatList
          data={filteredActivities}
          keyExtractor={(item) => item.activityId}
          renderItem={({ item }) => (
            <View style={styles.activityCard}>
              <Text style={styles.activityTitle}>{item.title}</Text>
              <Text>{item.description}</Text>
              <Text>Price: ${item.price}</Text>
              <Text>Location: {item.location}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    position: "relative",
  },
  tab: {
    alignItems: "center",
    padding: 10,
  },
  indicator: {
    height: 2,
    backgroundColor: "blue",
    position: "absolute",
    bottom: 0,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  activityCard: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  activityTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default TopTabBar;
