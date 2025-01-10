import { StyleSheet } from "react-native";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Feed from "./Feed";
import Video from "./Video";
import { GlobalStyles } from "../../../constants/Styles";

const TopTab = createMaterialTopTabNavigator();

const Body = ({ StoryTranslate, activities }) => {
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarLabelStyle: {
          textTransform: "none",
          fontSize: 18,
          padding: 0,
          margin: 0,
        },
        tabBarInactiveTintColor: "rgba(255,255,255,0.3)",
        tabBarIndicatorStyle: {
          height: 3,
          width: "10%",
          left: "20%",
          borderRadius: 30,
          backgroundColor: GlobalStyles.colors.purple,
        },
        tabBarStyle: {
          padding: 0,
          margin: 0,
          justifyContent: "center",
          width: "100%",
          elevation: 0,
          backgroundColor: "transparent",
          borderBottomWidth: 1,
          borderBottomColor: "rgba(255,255,255,0.1)",
        },
        tabBarPressColor: "white",
      }}
    >
      <TopTab.Screen name="Feed">
        {() => <Feed StoryTranslate={StoryTranslate} activities={activities} />}
      </TopTab.Screen>
      <TopTab.Screen name="What's Hot">
        {() => <Video StoryTranslate={StoryTranslate} activities={activities} />}
      </TopTab.Screen>
    </TopTab.Navigator>
  );
};

export default Body;

const styles = StyleSheet.create({});
