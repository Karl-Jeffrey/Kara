import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { collection, getDocs } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../firebase.js"; // Firebase initialization
import Header from "../components/home/head/Header.js";
import Stories, { CONTAINER_HEIGHT } from "../components/home/head/Stories.js";
import HeaderSvg from "../components/home/head/HeaderSVG.js";
import StorySvg from "../components/home/head/StorySvg.js";
import Body from "../components/home/body/Body.js";
import { StatusBar } from "expo-status-bar";
import { GlobalStyles } from "../constants/Styles.js";

const HomeScreen = ({ navigation }) => {
  const [followings, setFollowings] = useState({ data: [], list: [] });
  const [headerHeight, setHeaderHeight] = useState(50);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const StoryTranslate = useSharedValue(false);

  const storyAnimatedStyles = useAnimatedStyle(() => ({
    marginTop: StoryTranslate.value ? withTiming(-CONTAINER_HEIGHT) : withTiming(0),
    opacity: StoryTranslate.value ? withTiming(0) : withTiming(1),
  }));

  const storySvgAnimatedStyles = useAnimatedStyle(() => ({
    position: "absolute",
    transform: [
      {
        translateY: StoryTranslate.value
          ? withTiming(-CONTAINER_HEIGHT)
          : withTiming(0),
      },
    ],
  }));

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "activities")); // Corrected collection name
        console.log("QuerySnapshot size:", querySnapshot.size);

        const activitiesData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const data = doc.data();
            console.log("Document data:", data);

            let imageUrl = null;
            if (data.imagePath) {
              try {
                const storageRef = ref(storage, data.imagePath);
                imageUrl = await getDownloadURL(storageRef);
              } catch (error) {
                console.error("Error fetching image URL:", error.message);
              }
            }

            return {
              id: doc.id,
              ...data,
              imageUrl,
            };
          })
        );

        setActivities(activitiesData);
      } catch (error) {
        console.error("Error fetching activities:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={GlobalStyles.colors.primary300} />
        <Text>Loading activities...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={GlobalStyles.colors.primary300} />
      <View>
        <Animated.View style={storySvgAnimatedStyles}>
          <StorySvg headerHeight={headerHeight} storyHeight={CONTAINER_HEIGHT} size={80} paddingTop={20} visible_items={5} animatedStyle={storyAnimatedStyles} />
        </Animated.View>
        <View>
          <HeaderSvg headerHeight={headerHeight} storyHeight={CONTAINER_HEIGHT} size={80} paddingTop={20} visible_items={5} animatedStyle={storyAnimatedStyles} />
          <View onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}>
            <Header navigation={navigation} />
          </View>
        </View>
        <Animated.View style={storyAnimatedStyles}>
          <Stories followingsData={followings.data} />
        </Animated.View>
      </View>
      <Body StoryTranslate={StoryTranslate} activities={activities} />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
