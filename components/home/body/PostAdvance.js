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
import CommentSheet from "../../Comments/CommentSheet";
import { timeDifference } from "../../../utils/helperFunctions";
import { AuthContext } from "../../../store/auth-context";
import PressEffect from "../../UI/PressEffect";
import { LinearGradient } from "expo-linear-gradient";
import { Platform } from "react-native";

const { height, width } = Dimensions.get("window");

function PostAdvance({ post }) {
  const authCtx = useContext(AuthContext);

  function Avatar() {
    const navigation = useNavigation();
    const [profilePic, setProfilePic] = useState(
      !!post.userPicturePath ? post.userPicturePath : DEFAULT_DP
    );
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
              source={
                profilePic
                  ? { uri: profilePic }
                  : {
                      uri: "https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg",
                    }
              }
              style={styles.story}
            />
            <View style={{ marginLeft: 10 }}>
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 15 }}
              >
                {post.username} {/* Display username from post */}
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

  function PostFotter() {
    const [showCaptions, setShowCaptions] = useState(false);

    const activityTags = post.tags || []; // Assuming `tags` is an array of activity tags like ["indoor", "group", "fun"]

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
                    <Text
                        style={{ color: GlobalStyles.colors.gray, paddingHorizontal: 5 }}
                    >
                        {post.location}
                    </Text>
                </View>
                <Text
                    style={{ color: GlobalStyles.colors.gray, paddingHorizontal: 5 }}
                >
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
                    fontFamily: Platform.OS === 'ios' ? 'Poppins' : 'sans-serif',
                }}
            >
                <Text
                    style={{
                        fontWeight: "bold",
                        fontSize: 22,
                        color: GlobalStyles.colors.purple,
                    }}
                >
                    {post.title}{" "}
                </Text>
                <View style={styles.tagsContainer}>
                  {activityTags.map((tag, index) => (
                      <Text
                          key={index}
                          style={styles.tag}
                      >
                          {tag}
                      </Text>
                  ))}
                </View>
            </Text>
            <Text
                style={{
                    color: "white",
                    padding: 5,
                    paddingBottom: 10,
                    fontWeight: "bold",
                    fontSize: 16,
                }}
            >
                ${post.prices.amount}
            </Text>
        </View>
    );
  }

  function PostImage({ children }) {
    const [resizeModeCover, setResizeModeCover] = useState(true);
    const [ratio, setRatio] = useState(1);

    useEffect(() => {
      Image.getSize(post.picturePath, (width, height) => {
        const imageRatio = width / height;
        setRatio(imageRatio < 0.9 ? 1 : imageRatio);
      });
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
          setResizeModeCover(!resizeModeCover);
        }}
      >
        <ImageBackground
          source={{ uri: post.picturePath }}
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

  function PostStats() {
    const [liked, setLiked] = useState(false);
    const [totalLikes, setTotalLikes] = useState(post.likes.length);
    const [showComments, setShowComments] = useState(false);

    async function handleLike() {
      setTotalLikes((prevData) => (liked ? prevData - 1 : prevData + 1));
      setLiked(!liked);
    }

    function FooterButton({ icon, number, onPress, color = "white" }) {
      return (
        <View style={{ zIndex: 10 }}>
          <Pressable style={[styles.footerIcon]} onPress={onPress}>
            <PressEffect>
              <View
                style={{
                  backgroundColor: GlobalStyles.colors.primary,
                  padding: 10,
                  borderRadius: 50,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Ionicons
                  style={{ paddingHorizontal: 5 }}
                  name={icon}
                  size={20}
                  color={color}
                />
              </View>
            </PressEffect>
          </Pressable>
        </View>
      );
    }

    return (
      <>
        <CommentSheet visible={showComments} setVisible={setShowComments} />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            margin: 10,
          }}
        >
          <Avatar />
          <View style={{ alignItems: "center", flexDirection: "row", gap: 5 }}>
            <FooterButton
              icon={liked ? "heart" : "heart-outline"}
              number={totalLikes}
              onPress={handleLike}
              color={GlobalStyles.colors.greenLight}
            />
            <FooterButton
              icon={"chatbubble-ellipses"}
              number={post.comments.length}
              onPress={() => setShowComments(true)}
            />
            <FooterButton icon={"arrow-redo"} onPress={() => {}} left={20} />
          </View>
        </View>
      </>
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
        <PostStats />
      </PostImage>
      <PostFotter />
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
    gap: 5, // Space between tags
  },
  tag: {
    fontSize: 12,
    color: "#FFFF",
    fontFamily: Platform.OS === 'ios' ? 'Poppins' : 'sans-serif',
    fontWeight: "400",
    backgroundColor: GlobalStyles.colors.blue,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
  },
});
