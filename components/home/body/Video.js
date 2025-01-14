import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { GlobalStyles } from "../../../constants/Styles";
import { FlatList, RefreshControl } from "react-native";
import Post from "./Post";
import { POSTS } from "../../../data/posts";
import { useSharedValue } from "react-native-reanimated";
 
// Define a fallback value for CONTAINER_HEIGHT if not provided elsewhere
const CONTAINER_HEIGHT = 100;
 
const Video = ({ StoryTranslate }) => {
  const lastScrollY = useSharedValue(0);
 
  const calculateHotness = (post) => {
    return post.likes.length + post.comments.length;
  };
 
  const sortedPosts = [...POSTS].sort((a, b) => calculateHotness(b) - calculateHotness(a));
 
  const getRibbonColor = (rank) => {
    switch (rank) {
      case 1:
        return GlobalStyles.colors.gold;
      case 2:
        return GlobalStyles.colors.silver;
      case 3:
        return GlobalStyles.colors.bronze;
      default:
        return GlobalStyles.colors.purple;
    }
  };
 
  return (
    <View style={{ flex: 1, backgroundColor: GlobalStyles.colors.primary }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        onMomentumScrollBegin={(event) => {
          const scrollY = event.nativeEvent.contentOffset.y;
          if (scrollY > lastScrollY.value) StoryTranslate.value = -CONTAINER_HEIGHT;
          else StoryTranslate.value = 0;
        }}
        onMomentumScrollEnd={(event) => {
          const scrollY = event.nativeEvent.contentOffset.y;
          lastScrollY.value = scrollY;
        }}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => {}} />
        }
        keyExtractor={(item) => item._id}
        data={sortedPosts}
        renderItem={({ item, index }) => (
          <View style={styles.cardContainer}>
            <View style={[styles.starBadge, { backgroundColor: getRibbonColor(index + 1) }]}>
              <Text style={[styles.starText, index < 3 && styles.whiteText]}>
                {index === 0 ? "⭐" : index === 1 ? "⭐" : index === 2 ? "⭐" : `${index + 1}`}
              </Text>
            </View>
            <Post post={item} />
          </View>
        )}
      />
    </View>
  );
};
 
export default Video;
 
const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 10,
    paddingBottom: GlobalStyles.styles.tabBarPadding,
  },
  cardContainer: {
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: GlobalStyles.colors.primary500,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  starBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 60,
    flexDirection: "row",
    alignItems: "center",
  },
  starText: {
    color: GlobalStyles.colors.primary,
    fontWeight: "bold",
    fontSize: 24,
  },
  whiteText: {
    color: GlobalStyles.colors.white,
  },
  ribbonTail: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: 4,
  },
});