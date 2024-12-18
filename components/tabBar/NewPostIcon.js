import {
  Pressable,
  StyleSheet,
  Image,
  View,
  Dimensions,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { GlobalStyles } from "../../constants/Styles";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "../../store/app-context";
import Loader from "../UI/Loader";

const NewPostIcon = ({ exploreActive, pressed, setPressed }) => {
  const appCtx = useContext(AppContext);
  const navigation = useNavigation();

  const scale = useSharedValue(0);
  const scaleAnimation = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value) }],
  }));

  useEffect(() => {
    scale.value = withSpring(pressed ? 1 : 0, { duration: 100 });
  }, [pressed]);

  const rotation = useSharedValue(0);
  const rotationAnimation = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Pressable
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
      onPress={() => {
        if (exploreActive) {
          if (!appCtx.fetchingUsers) {
            appCtx.setFetchingUsers(true);
          }
        } else {
          // Automatically navigate to ActivitySearchScreen
          navigation.navigate("ActivitySearchScreen");
        }
      }}
    >
      <LinearGradient
        colors={[GlobalStyles.colors.blue, GlobalStyles.colors.cyan]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={{
          width: 50,
          height: 50,
          borderRadius: 50,
          position: "absolute",
        }}
      />
      {exploreActive ? (
        <View>
          {appCtx.fetchingUsers ? (
            <Loader color="white" />
          ) : (
            <Animated.Image
              resizeMode="contain"
              style={{
                width: 30,
                height: 30,
                tintColor: "white",
              }}
              source={require("../../assets/shuffle.png")}
            />
          )}
        </View>
      ) : (
        <Animated.Image
          resizeMode="contain"
          style={[
            {
              width: 20,
              height: 20,
              tintColor: "white",
            },
            rotationAnimation,
          ]}
          source={require("../../assets/search.png")}
        />
      )}
    </Pressable>
  );
};

export default NewPostIcon;

const styles = StyleSheet.create({});
