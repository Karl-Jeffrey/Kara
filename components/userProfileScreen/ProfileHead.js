import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Pressable,
  Animated,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GlobalStyles, DEFAULT_DP } from "../../constants/Styles.js";
import PressEffect from "../UI/PressEffect.js";
import { firestore } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const ProfileHead = ({ userId, viewMode, scrollY }) => {
  const [profilePic, setProfilePic] = useState(DEFAULT_DP); // Default profile picture
  const [fullName, setFullName] = useState("Anonymous");
  const [username, setUsername] = useState("anonymous");
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Log the userId received as a prop
  console.log("ProfileHead received userId:", userId);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        console.warn("Error: User ID is not provided to ProfileHead.");
        setLoading(false); // Stop the loader
        return;
      }
  
      try {
        console.log("Fetching data for userId:", userId);
        const userDoc = await getDoc(doc(firestore, "users", userId));
  
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("Fetched user data:", userData);
  
          // Set the user data in the component state
          setFullName(userData.fullName || "Anonymous");
          setUsername(userData.username || "anonymous");
          setProfilePic(userData.profilePicture || DEFAULT_DP);
        } else {
          console.error(`User with ID ${userId} does not exist in Firestore.`);
          setFullName("Unknown User");
          setUsername("unknown");
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
        setFullName("Error Loading");
        setUsername("error");
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, [userId]);

  const ProfileStat = ({ text, subText, onPress }) => (
    <Pressable style={{ alignItems: "center" }} onPress={onPress}>
      <Text style={{ fontWeight: "400", fontSize: 25, color: "white" }}>{text}</Text>
      <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{subText}</Text>
    </Pressable>
  );

  const headerStyle = {
    transform: [
      {
        translateY: scrollY
          ? scrollY.interpolate({
              inputRange: [0, 200],
              outputRange: [0, -60],
              extrapolate: "clamp",
            })
          : 0,
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
          {viewMode && (
            <View style={styles.chatButtonContainer}>
              <PressEffect>
                <Pressable onPress={() => navigation.navigate("MessagesScreen")}>
                  <Image
                    source={require("../../assets/chat-focused.png")}
                    style={styles.chatIcon}
                  />
                </Pressable>
              </PressEffect>
            </View>
          )}
        </ImageBackground>
        {loading ? (
          <ActivityIndicator size="small" color={GlobalStyles.colors.primary300} />
        ) : (
          <>
            <Text style={styles.fullName}>{fullName}</Text>
            <Text style={styles.username}>@{username}</Text>
          </>
        )}
      </View>

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
