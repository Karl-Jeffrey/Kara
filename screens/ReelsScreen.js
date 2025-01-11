import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, StyleSheet, StatusBar, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getFirestore, collection, getDocs, query, orderBy } from "firebase/firestore"; // Firebase Firestore imports
import VideoPost from "../components/reelsScreen/VideoPost";
import { GlobalStyles } from "../constants/Styles";
import { firestore } from "../firebase";
const ITEM_SIZE =
  GlobalStyles.styles.windowHeight - GlobalStyles.styles.tabBarPadding + 25;

const ReelsScreen = () => {
  const [activePostId, setActivePostId] = useState(null); // Track the active post
  const [posts, setPosts] = useState([]); // Posts fetched from Firestore
  const ScrollY = useRef(new Animated.Value(0)).current;

  

  // Fetch posts from Firestore
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsQuery = query(
          collection(firestore, "posts"), // Reference the "posts" collection
          orderBy("createdAt", "desc") // Order posts by creation time
        );
        const postsSnapshot = await getDocs(postsQuery);
        const fetchedPosts = postsSnapshot.docs.map((doc) => ({
          id: doc.id, // Include the document ID
          ...doc.data(), // Spread the post data
        }));
        setPosts(fetchedPosts);
        setActivePostId(fetchedPosts[0]?.id); // Set the first post as active
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  // Viewability configuration to track the active post
  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig: { itemVisiblePercentThreshold: 50 },
      onViewableItemsChanged: ({ changed, viewableItems }) => {
        if (viewableItems.length > 0 && viewableItems[0].isViewable) {
          setActivePostId(viewableItems[0].item.id);
        }
      },
    },
  ]);

  const onEndReached = () => {
    // Optional: Fetch more posts for pagination
    // Example: fetch more posts from Firestore
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={"black"} />

      <Animated.FlatList
        data={posts}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: ScrollY } } }],
          { useNativeDriver: true }
        )}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE,
            (index + 1) * ITEM_SIZE,
          ];
          const scale = ScrollY.interpolate({
            inputRange,
            outputRange: [1, 1, 0.7],
          });
          const translateY = ScrollY.interpolate({
            inputRange,
            outputRange: [0, 0, ITEM_SIZE / 2],
          });
          return (
            <Animated.View
              style={{
                transform: [{ scale }, { translateY }],
              }}
            >
              <VideoPost
                post={item} // Pass the post data to VideoPost component
                activePostId={activePostId}
                index={index}
              />
            </Animated.View>
          );
        }}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        pagingEnabled
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={3}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingBottom: GlobalStyles.styles.tabBarPadding - 25,
  },
});

export default ReelsScreen;
