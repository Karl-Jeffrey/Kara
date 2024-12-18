import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Pressable,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GlobalStyles, DEFAULT_DP } from "../../constants/Styles.js";
import PressEffect from "../UI/PressEffect.js";

const ProfileHead = ({ userData, viewMode, scrollY }) => {
  const [profilePic, setProfilePic] = React.useState(
    !!userData.picturePath ? userData.picturePath : DEFAULT_DP
  );
  const navigation = useNavigation();

  // Function to render the profile stats
  function ProfileStat({ text, subText, onPress }) {
    return (
      <Pressable style={{ alignItems: "center" }} onPress={onPress}>
        <Text style={{ fontWeight: "400", fontSize: 25, color: "white" }}>
          {text}
        </Text>
        <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
          {subText}
        </Text>
      </Pressable>
    );
  }

  // Header transform animation based on scrollY
  const headerStyle = {
    transform: [
      {
        translateY: scrollY
          ? scrollY.interpolate({
              inputRange: [0, 200], // Scroll range
              outputRange: [0, -60], // Move the header up by -60px
              extrapolate: "clamp", // Prevent the header from moving too far
            })
          : 0, // Fallback in case scrollY is undefined
      },
    ],
  };

  return (
    <Animated.View style={[styles.animatedHeader, headerStyle]}>
      <View style={{ alignItems: "center", margin: 10 }}>
        <ImageBackground
          style={styles.profileImage}
          imageStyle={{ borderRadius: 100 }}
          source={{ uri: profilePic }}
        >
          {/* Edit / Add Friend Button */}
          <View style={styles.editButtonContainer}>
            <PressEffect style={styles.editButton}>
              <Pressable
                onPress={() => {
                  if (!viewMode) navigation.navigate("EditProfileScreen");
                }}
              >
                <Image
                  source={
                    viewMode
                      ? require("../../assets/add-friend.png")
                      : require("../../assets/edit.png")
                  }
                  style={styles.editIcon}
                />
              </Pressable>
            </PressEffect>
          </View>
          {/* Chat Button for View Mode */}
          {viewMode && (
            <View style={styles.chatButtonContainer}>
              <PressEffect>
                <Pressable
                  onPress={() => {
                    navigation.navigate("MessagesScreen");
                  }}
                >
                  <Image
                    source={require("../../assets/chat-focused.png")}
                    style={styles.chatIcon}
                  />
                </Pressable>
              </PressEffect>
            </View>
          )}
        </ImageBackground>
        {/* User Name */}
        <Text style={styles.fullName}>{userData.fullName}</Text>
        <Text style={styles.username}>@{userData.username}</Text>
      </View>

      {/* Profile Stats */}
      <View style={styles.statsContainer}>
        <ProfileStat text={"255"} subText={"Posts"} />
        <ProfileStat text={"14.6k"} subText={"Followers"} />
        <ProfileStat text={"378"} subText={"Followings"} />
      </View>
    </Animated.View>
  );
};

export default ProfileHead;

const styles = StyleSheet.create({
  animatedHeader: {
    backgroundColor: "transparent",
  },
  profileImage: {
    width: 150,
    height: 150,
    marginHorizontal: 10,
  },
  editButtonContainer: {
    position: "absolute",
    right: 0,
    bottom: 5,
  },
  editButton: {
    backgroundColor: GlobalStyles.colors.primary300,
    padding: 10,
    borderRadius: 50,
  },
  editIcon: {
    width: 25,
    height: 25,
    tintColor: "white",
  },
  chatButtonContainer: {
    position: "absolute",
    left: 0,
    top: 5,
    transform: [{ rotateY: "180deg" }],
  },
  chatIcon: {
    width: 30,
    height: 30,
    tintColor: "white",
  },
  fullName: {
    fontWeight: "bold",
    fontSize: 25,
    color: "white",
  },
  username: {
    fontSize: 15,
    color: "rgba(255,255,255,0.6)",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: GlobalStyles.colors.primary200,
    borderRadius: 20,
    marginHorizontal: 10,
    paddingVertical: 10,
  },
});
