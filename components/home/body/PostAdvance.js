import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Pressable,
  ImageBackground,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { DEFAULT_DP, GlobalStyles } from "../../../constants/Styles";
import { LinearGradient } from "expo-linear-gradient";
import PressEffect from "../../UI/PressEffect";
import CommentSheet from "../../Comments/CommentSheet";
import { Platform } from "react-native";
import { timeDifference } from "../../../utils/helperFunctions";

const { height, width } = Dimensions.get("window");

function PostAdvance({ post }) {
  const navigation = useNavigation();

  // Render user avatar
  function Avatar() {
    const profilePic = post.userPicturePath || DEFAULT_DP;
    return (
      <View style={{ flexDirection: "row" }}>
        <PressEffect>
          <Pressable
            style={{ flexDirection: "row" }}
            onPress={() => {
              navigation.navigate("UserProfileScreen", {
                backWhite: true,
                ViewUser: true,
              });
            }}
          >
            <Image
              source={{ uri: profilePic }}
              style={styles.story}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={{ color: "white", fontWeight: "bold", fontSize: 15 }}>
                {post.username || "Anonymous"}
              </Text>
              <Text
                style={{
                  color: "rgba(255,255,255,0.3)",
                  fontSize: 10,
                  fontWeight: "bold",
                }}
              >
                {timeDifference(post.createdAt)}
              </Text>
            </View>
          </Pressable>
        </PressEffect>
      </View>
    );
  }

  // Render image of the post
  function PostImage({ children }) {
    const [resizeModeCover, setResizeModeCover] = useState(true);
    const [ratio, setRatio] = useState(1);

    useEffect(() => {
      if (post.picturePath) {
        Image.getSize(post.picturePath, (width, height) => {
          const imageRatio = width / height;
          setRatio(imageRatio < 0.9 ? 1 : imageRatio);
        });
      }
    }, [post]);

    return (
      <Pressable
        style={{
          borderRadius: 30,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: GlobalStyles.colors.primary600,
        }}
        onPress={() => {
          navigation.navigate("PostDetailScreen", { post });
        }}
      >
        <ImageBackground
          source={{ uri: post.picturePath || DEFAULT_DP }}
          style={{
            width: "100%",
            aspectRatio: ratio,
            backgroundColor: GlobalStyles.colors.primary500,
          }}
          imageStyle={{
            resizeMode: resizeModeCover ? "cover" : "contain",
          }}
        >
          <LinearGradient
            colors={["rgba(0,0,0,.5)", "transparent"]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={{
              bottom: 0,
              height: 40 + 50,
              width: "100%",
              position: "absolute",
            }}
          />
          {children}
        </ImageBackground>
      </Pressable>
    );
  }

  // Render post footer
  function PostFooter() {
    const [showCaptions, setShowCaptions] = useState(false);
    const activityTags = post.tags || [];

    return (
      <View style={{ marginHorizontal: 20 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="location"
              size={15}
              color={GlobalStyles.colors.gray}
            />
            <Text style={{ color: GlobalStyles.colors.gray, paddingHorizontal: 5 }}>
              {post.location || "No location provided"}
            </Text>
          </View>
          <Text style={{ color: GlobalStyles.colors.gray, paddingHorizontal: 5 }}>
            {new Date(post.createdAt).toLocaleDateString("en-CA")}
          </Text>
        </View>
        <Text
          onPress={() => setShowCaptions(!showCaptions)}
          numberOfLines={showCaptions ? undefined : 1}
          style={{
            color: "white",
            padding: 5,
            paddingBottom: 10,
            width: showCaptions ? undefined : "90%",
            fontFamily: Platform.OS === "ios" ? "Poppins" : "sans-serif",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 22,
              color: GlobalStyles.colors.purple,
            }}
          >
            {post.title || "No Title"}{" "}
          </Text>
        </Text>
        <View style={styles.tagsContainer}>
          {activityTags.map((tag, index) => (
            <Text key={index} style={styles.tag}>
              {tag}
            </Text>
          ))}
        </View>
        <Text
          style={{
            color: "white",
            padding: 5,
            paddingBottom: 10,
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          ${post.price || 0}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: GlobalStyles.colors.primary300,
        borderRadius: 30,
        marginHorizontal: 10,
      }}
    >
      <PostImage>
        <Avatar />
      </PostImage>
      <PostFooter />
    </View>
  );
}

export default PostAdvance;

const styles = StyleSheet.create({
  story: {
    width: 35,
    height: 35,
    borderRadius: 50,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  tag: {
    fontSize: 12,
    color: "#FFFF",
    fontFamily: Platform.OS === "ios" ? "Poppins" : "sans-serif",
    fontWeight: "400",
    backgroundColor: GlobalStyles.colors.blue,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
  },
});
