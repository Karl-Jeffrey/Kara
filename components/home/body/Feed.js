import { StyleSheet, Text, View, FlatList, RefreshControl } from "react-native";
import React from "react";
import { GlobalStyles } from "../../../constants/Styles";
import { useSharedValue } from "react-native-reanimated";
import PostAdvance from "./PostAdvance";

const Feed = ({ StoryTranslate, activities }) => {
  const lastScrollY = useSharedValue(0);

  return (
    <View style={{ flex: 1, backgroundColor: GlobalStyles.colors.primary }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 10,
          paddingBottom: GlobalStyles.styles.tabBarPadding,
          gap: 20,
        }}
        // Handle scroll to translate Story UI
        onMomentumScrollBegin={(event) => {
          const scrollY = event.nativeEvent.contentOffset.y;
          if (scrollY > lastScrollY.value) StoryTranslate.value = true;
          else {
            StoryTranslate.value = false;
          }
        }}
        onMomentumScrollEnd={(event) => {
          const scrollY = event.nativeEvent.contentOffset.y;
          lastScrollY.value = scrollY;
        }}
        // Pull-to-refresh functionality
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => {}} />
        }
        // Use `activityId` as the unique key for each activity
        keyExtractor={(item) => item.activityId}
        // Render activities dynamically
        data={activities}
        renderItem={({ item }) => {
          return (
            <View>
              <PostAdvance
                post={{
                  title: item.title,
                  description: item.description,
                  category: item.category,
                  price: `$${item.price}`,
                  imageUrl: item.imageUrl, // Add this if PostAdvance supports image
                }}
              />
            </View>
          );
        }}
      />
    </View>
  );
};

export default Feed;

const styles = StyleSheet.create({});
