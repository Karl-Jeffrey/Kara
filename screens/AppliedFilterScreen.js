import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { GlobalStyles } from "../constants/Styles";

const AppliedFilterScreen = () => {
  // Hardcoded fake activities
  const fakeActivities = [
    {
      id: "1",
      title: "Hiking in Mont Royal",
      price: "$50",
      location: "Mont Royal, Montreal",
      hypeLevel: "High",
    },
    {
      id: "2",
      title: "Cooking Class - Italian Cuisine",
      price: "$50",
      location: "Old Montreal",
      hypeLevel: "Medium",
    },
    {
      id: "3",
      title: "Karaoke Night",
      price: "$20",
      location: "Downtown Montreal",
      hypeLevel: "High",
    },
    {
      id: "4",
      title: "Museum Tour: Art & History",
      price: "$30",
      location: "Montreal Museum of Fine Arts",
      hypeLevel: "Low",
    },
    {
      id: "5",
      title: "Yoga in the Park",
      price: "$25",
      location: "Parc La Fontaine, Montreal",
      hypeLevel: "Medium",
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Filtered Activities</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {fakeActivities.length > 0 ? (
          fakeActivities.map((activity) => (
            <View key={activity.id} style={styles.activityCard}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityDescription}>Location: {activity.location}</Text>
              <Text style={styles.activityPrice}>Price: {activity.price}</Text>
              <Text style={styles.activityHype}>Hype Level: {activity.hypeLevel}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noResults}>No activities available.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  activityCard: {
    padding: 16,
    backgroundColor: GlobalStyles.colors.primary200,
    borderRadius: 10,
    marginBottom: 10,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  activityDescription: {
    fontSize: 14,
    color: "white",
    marginTop: 5,
  },
  activityPrice: {
    fontSize: 16,
    color: "white",
    marginTop: 5,
  },
  activityHype: {
    fontSize: 16,
    color: "white",
    marginTop: 5,
  },
  noResults: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    marginTop: 20,
  },
});

export default AppliedFilterScreen;
