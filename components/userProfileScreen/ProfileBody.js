import React, { useState, useEffect, useContext, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Pressable,
  Image,
  Animated,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { GlobalStyles } from "../../constants/Styles.js";
import { FlatList } from "react-native-gesture-handler";
import CollectionCard from "./CollectionCard.js";
import MyActivities from "../../screens/MyActivitiesScreen.js";
import Post from "../../components/userProfileScreen/Post";
import { AuthContext } from "../../store/auth-context";
import { Ionicons } from "@expo/vector-icons";
import { POSTS } from "../../data/posts.js";

const TopTab = createMaterialTopTabNavigator();

function Posts({ navigation, route, userId, refreshing }) {
  const [fetching, setFetching] = useState(true);
  const [errorFetching, setErrorFetching] = useState(false);
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    if (!userId) {
      console.warn("User ID is missing, cannot fetch posts.");
      return;
    }

    try {
      setFetching(true);
      setErrorFetching(false);
      console.log("Fetching posts for userId:", userId);
      // Replace this with actual API or Firestore query
      const userPosts = POSTS.filter((post) => post.userId === userId);
      setPosts(userPosts);
    } catch (error) {
      setErrorFetching(true);
      console.error("Error fetching posts:", error.message);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, [userId]);

  return (
    <View style={{ flex: 1, backgroundColor: GlobalStyles.colors.primary }}>
      {fetching ? (
        <ActivityIndicator size={50} color={GlobalStyles.colors.purple} />
      ) : errorFetching ? (
        <Pressable onPress={getPosts}>
          <Ionicons
            name="reload-circle"
            color={GlobalStyles.colors.purple}
            size={50}
          />
          <Text style={{ color: GlobalStyles.colors.purple }}>Reload</Text>
        </Pressable>
      ) : posts.length > 0 ? (
        <FlatList
          data={posts}
          renderItem={({ item }) => <Post postData={item} />}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <Text style={{ color: "white" }}>No posts available.</Text>
      )}
    </View>
  );
}


function Likes() {
  return (
    <View style={{ backgroundColor: GlobalStyles.colors.primary }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: GlobalStyles.styles.tabBarPadding,
        }}
        keyExtractor={(item) => item.id.toString()}
        data={[
          { id: 1, title: "Favorite Posts" },
          { id: 2, title: "Favorite Activities" },
        ]}
        numColumns={2}
        renderItem={({ item }) => {
          return (
            <View>
              <CollectionCard title={item.title} />
            </View>
          );
        }}
      />
    </View>
  );
}

const ProfileBody = ({ userId, refreshing }) => {
  const scrollY = useRef(new Animated.Value(0)).current;

  const tabBarStyle = {
    transform: [
      {
        translateY: scrollY.interpolate({
          inputRange: [0, 200],
          outputRange: [0, -60],
          extrapolate: "clamp",
        }),
      },
    ],
  };

  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarLabelStyle: { fontSize: 18, textTransform: "none" },
        tabBarInactiveTintColor: "rgba(255,255,255,0.3)",
        tabBarIndicatorStyle: {
          height: 3,
          width: "10%",
          left: "20%",
          borderRadius: 30,
          backgroundColor: GlobalStyles.colors.purple,
        },
        tabBarStyle: [
          tabBarStyle,
          {
            elevation: 0,
            backgroundColor: "transparent",
            borderBottomWidth: 1,
            borderBottomColor: "rgba(255,255,255,0.1)",
          },
        ],
        tabBarPressColor: "white",
        tabBarPosition: "top",
      }}
    >
      <TopTab.Screen
        name="Posts"
        options={{ title: "My Posts" }}
      >
        {({ navigation, route }) => (
          <Posts
            navigation={navigation}
            route={route}
            userId={userId} // Pass userId
            refreshing={refreshing}
          />
        )}
      </TopTab.Screen>

      <TopTab.Screen
        name="My Activities"
        options={{ title: "My Activities" }}
        children={() => <MyActivities userId={userId} />} // Pass userId
      />

      <TopTab.Screen
        name="Likes"
        options={{ title: "Favorite" }}
      >
        {({ navigation, route }) => (
          <Likes
            navigation={navigation}
            route={route}
            userId={userId} // Pass userId
            refreshing={refreshing}
          />
        )}
      </TopTab.Screen>
    </TopTab.Navigator>
  );
};

export default ProfileBody;

