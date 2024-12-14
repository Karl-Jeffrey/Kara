import React, { useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Video } from "expo-av";
import { useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";  // Import BlurView from expo-blur

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const video = useRef(null);

  return (
    <View style={styles.container}>
      {/* Video Background */}
      <Video
        ref={video}
        source={require("../assets/WelcomeScreenVideo.mp4")}
        style={styles.backgroundVideo}
        resizeMode="cover"
        shouldPlay={true}
        isMuted={true}
        onPlaybackStatusUpdate={(status) => {
          if (status.didJustFinish) {
            video.current.replayAsync(); // Manually restart the video
          }
        }}
      />

      {/* Apply blur effect */}
      <BlurView intensity={50} style={styles.blurContainer} />

      {/* Overlay content */}
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome to Our App</Text>

        {/* Sign In Button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "purple" }]}
          onPress={() => navigation.navigate("LoginScreen")}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        {/* Create an Account Button */}
        <TouchableOpacity
          style={styles.transparentButton}
          onPress={() => navigation.navigate("IdentityScreen")} 
        >
          <Text style={styles.transparentButtonText}>Create an Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    position: "absolute",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 6,
    width: "100%",
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  transparentButton: {
    borderWidth: 2, // White border
    borderColor: "white",
    backgroundColor: "transparent",
    padding: 15,
    borderRadius: 6,
    width: "100%",
    marginBottom: 10,
    alignItems: "center",
  },
  transparentButtonText: {
    color: "white",
    fontSize: 18,
  },
  blurContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default WelcomeScreen;
