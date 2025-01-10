import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
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
import axios from "axios"; // Import Axios for API calls

const HomeScreen = ({ navigation }) => {
  const [followings, setFollowings] = React.useState({ data: [], list: [] });
  const [headerHeight, setHeaderHeight] = React.useState(50);
  const StoryTranslate = useSharedValue(false);

  // Add state for activities
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const storyAnimatedStyles = useAnimatedStyle(() => {
    return {
      marginTop: StoryTranslate.value
        ? withTiming(-CONTAINER_HEIGHT)
        : withTiming(0),
      opacity: StoryTranslate.value ? withTiming(0) : withTiming(1),
    };
  });

  const storySvgAnimatedStyles = useAnimatedStyle(() => {
    return {
      position: "absolute",
      transform: [
        {
          translateY: StoryTranslate.value
            ? withTiming(-CONTAINER_HEIGHT)
            : withTiming(0),
        },
      ],
    };
  });

  // Fetch activities from your API
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(
          "https://<your-project-id>.cloudfunctions.net/api/activities"
        ); // Replace <your-project-id> with your Firebase project ID
        setActivities(response.data); // Update activities state
      } catch (error) {
        console.error("Error fetching activities:", error.message);
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
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
