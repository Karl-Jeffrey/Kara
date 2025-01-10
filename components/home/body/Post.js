import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { DEFAULT_DP, GlobalStyles } from "../../../constants/Styles";
import { Path, Svg } from "react-native-svg";
import PressEffect from "../../UI/PressEffect";
const { height, width } = Dimensions.get("window");

function Post({ post }) {
  function PostHeader() {
    const navigation = useNavigation();
    const [profilePic, setProfilePic] = React.useState(
      post.userPicturePath || DEFAULT_DP
    );
    return (
      <View style={{ alignSelf: "center", flexDirection: "row" }}>
        <Svg width={20} height={20} viewBox="0 0 20 20">
          <Path
            d="M0,0 L20,0 L20,20 A20,20 0 0,0 0,0 Z"
            fill={GlobalStyles.colors.primary500}
          />
        </Svg>

        <View
          style={{
            backgroundColor: GlobalStyles.colors.primary500,
            padding: 5,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <PressEffect>
              <Pressable
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
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
                <View
                  style={{
                    marginLeft: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 15,
                    }}
                  >
                    {post.title || "Activity"}
                  </Text>
                  <Text
                    style={{
                      color: "rgba(255,255,255,0.3)",
                      fontSize: 10,
                      fontWeight: "bold",
                    }}
                  >
                    {post.category || "Category"}
                  </Text>
                </View>
              </Pressable>
            </PressEffect>
          </View>
        </View>
        <Svg width={20} height={20} viewBox="0 0 20 20">
          <Path
            d="M20,0 L0,0 L00,20 A0,0 0 0,1 20,0 Z"
            fill={GlobalStyles.colors.primary500}
          />
        </Svg>
      </View>
    );
  }

  function PostImage() {
    const [resizeModeCover, setResizeModeCover] = useState(true);

    return (
      <Pressable
        onPress={() => {
          setResizeModeCover(!resizeModeCover);
        }}
      >
        <Image
          source={{ uri: post.imageUrl || DEFAULT_DP }}
          style={{
            width: "100%",
            aspectRatio: 1,
            borderRadius: 15,
            resizeMode: resizeModeCover ? "cover" : "contain",
            backgroundColor: GlobalStyles.colors.primary500,
          }}
        />
      </Pressable>
    );
  }

  function PostStats() {
    const [liked, setLiked] = useState(false);
    const [totalLikes, setTotalLikes] = useState(post.likes?.length || 0);

    function FooterButton({ icon, number, onPress, color = "white" }) {
      return (
        <View>
          <Pressable style={[styles.footerIcon]} onPress={onPress}>
            <PressEffect>
              <Ionicons name={icon} size={25} color={color} />
            </PressEffect>
            <Text
              style={{
                color: "white",
                fontWeight: "600",
              }}
            >
              {number}
            </Text>
          </Pressable>
        </View>
      );
    }

    return (
      <>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <FooterButton
            icon={liked ? "heart" : "heart-outline"}
            number={totalLikes}
            onPress={() => {
              setLiked(!liked);
              setTotalLikes((prev) => (liked ? prev - 1 : prev + 1));
            }}
            color={liked ? GlobalStyles.colors.greenLight : "white"}
          />
          <FooterButton
            icon="chatbubble-ellipses-outline"
            number={post.comments?.length || 0}
            onPress={() => {}}
          />
          <FooterButton icon="bookmark-outline" onPress={() => {}} />
        </View>
        {post.description && (
          <Text
            style={{
              color: "white",
              paddingHorizontal: 5,
              paddingTop: 15,
              textAlign: "center",
            }}
          >
            {post.description}
          </Text>
        )}
      </>
    );
  }

  return (
    <View style={styles.container}>
      <PostHeader />
      <PostImage />
      <PostStats />
    </View>
  );
}

export default Post;

const styles = StyleSheet.create({
  container: {
    backgroundColor: GlobalStyles.colors.primary300,
    borderRadius: 25,
    padding: 15,
    margin: 10,
    marginHorizontal: 20,
  },
  story: {
    width: 35,
    height: 35,
    borderRadius: 50,
  },
  footerIcon: {
    margin: 5,
    flexDirection: "row",
    alignItems: "center",
  },
});
