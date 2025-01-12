import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import Header from "../components/home/head/Header.js";
import Stories, { CONTAINER_HEIGHT } from "../components/home/head/Stories.js";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlobalStyles } from "../constants/Styles.js";
import Body from "../components/home/body/Body.js";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import HeaderSvg from "../components/home/head/HeaderSVG.js";
import StorySvg from "../components/home/head/StorySvg.js";
import { StatusBar } from "expo-status-bar";
import { collection, getDocs } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { firestore, storage } from "../firebase.js"; // Ensure Firebase is initialized here

const HomeScreen = ({ navigation }) => {
  const [followings, setFollowings] = useState({ data: [], list: [] });
  const [headerHeight, setHeaderHeight] = useState(50);
  const StoryTranslate = useSharedValue(false);

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Fetch activities from Firestore and map image URLs
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "Activities"));
        const activitiesData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const data = doc.data();

            // Fetch image URL from Firebase Storage
            let imageUrl = null;
            if (data.imagePath) {
              const storageRef = ref(storage, data.imagePath);
              imageUrl = await getDownloadURL(storageRef);
            }

            return {
              id: doc.id,
              ...data,
              imageUrl, // Add the resolved image URL
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
          <StorySvg
            headerHeight={headerHeight}
            storyHeight={CONTAINER_HEIGHT}
            size={80}
            paddingTop={20}
            visible_items={5}
            animatedStyle={storyAnimatedStyles}
          />
        </Animated.View>
        <View>
          <HeaderSvg
            headerHeight={headerHeight}
            storyHeight={CONTAINER_HEIGHT}
            size={80}
            paddingTop={20}
            visible_items={5}
            animatedStyle={storyAnimatedStyles}
          />
          <View
            onLayout={(event) => {
              setHeaderHeight(event.nativeEvent.layout.height);
            }}
          >
            <Header navigation={navigation} />
          </View>
        </View>

        <Animated.View style={storyAnimatedStyles}>
          <Stories followingsData={followings.data} />
        </Animated.View>
      </View>
      {/* Pass activities to the Body component */}
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
