import React, { useContext, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Image,
  Text,
  ScrollView,
} from "react-native";
import { GlobalStyles } from "../constants/Styles";
import Button from "../components/Button";
import InputField from "../components/InputField";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../store/auth-context";
import ProgressOverlay from "../components/ProgressOverlay";
import ErrorOverlay from "../components/ErrorOverlay";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";

const { width, height } = Dimensions.get("window");

function NewPostScreen({ navigation }) {
  const authCtx = useContext(AuthContext);
  const [type, setType] = useState();
  const [post, setPost] = useState(null);
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [location, setLocation] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [audio, setAudio] = useState(null);
  const [uploading, setUploading] = useState({
    status: false,
    progress: 0,
    success: true,
  });

  const newPostHandler = useCallback(async () => {
    if (post) {
      const formData = new FormData();
      formData.append("userId", authCtx.userData._id);
      formData.append("description", caption);
      formData.append("hashtags", hashtags);
      formData.append("location", location);
      formData.append("privacy", privacy);
      if (audio) {
        formData.append("audio", {
          uri: audio.uri,
          type: audio.type,
          name: audio.fileName,
        });
      }
      formData.append("picture", {
        uri: post.uri,
        type: post.type,
        name: post.fileName,
      });

      try {
        setUploading((prevData) => ({
          ...prevData,
          status: true,
        }));

        setTimeout(() => {
          setUploading({ status: false, progress: 0, success: true });
          navigation.goBack();
        }, 3000);
      } catch (error) {
        setUploading((prevData) => ({
          ...prevData,
          success: false,
        }));
        console.log(error.message);
      }
    }
  }, [authCtx.userData._id, caption, hashtags, location, privacy, audio, post, navigation]);

  const openImagePicker = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log("Full picker result:", result);
      
      if (!result.canceled) {
        // In newer versions of expo-image-picker, the image URI is in result.assets[0]
        const imageUri = result.assets ? result.assets[0].uri : result.uri;
        console.log("Image URI:", imageUri);
        
        setPost({
          uri: imageUri,
          type: 'image/jpeg',
          fileName: 'photo.jpg'
        });
      }
    } catch (error) {
      console.log("Image picker error:", error);
      alert("Error picking image");
    }
  };

  const openCamera = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        alert("Permission to access camera is required!");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log("Camera result:", result);

      if (!result.canceled) {
        const imageUri = result.assets ? result.assets[0].uri : result.uri;
        console.log("Camera image URI:", imageUri);
        
        setPost({
          uri: imageUri,
          type: 'image/jpeg',
          fileName: 'photo.jpg'
        });
      }
    } catch (error) {
      console.log("Camera error:", error);
      alert("Error taking photo");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar backgroundColor={GlobalStyles.colors.primary} />
      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back-outline" size={30} color="white" />
      </Pressable>

      {!post ? (
        <View style={styles.buttonContainer}>
          <Pressable
            onPress={openImagePicker}
            style={[styles.uploadIcon, styles.lightPurple]}
          >
            <Ionicons name="image-outline" size={50} color="white" />
            <Text style={styles.uploadText}>Upload</Text>
          </Pressable>
          <Pressable
            onPress={openCamera}
            style={[styles.uploadIcon, styles.lightPurple]}
          >
            <Ionicons name="camera-outline" size={50} color="white" />
            <Text style={styles.uploadText}>Camera</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.previewContainer}>
            {/* Image Container */}
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: post.uri }}
                style={styles.imagePreview}
                resizeMode="contain"
                onError={(error) => console.log("Image loading error:", error)}
              />
              <Pressable
                style={styles.resizeButton}
                onPress={() => setPost(null)}
              >
                <Ionicons name="close-outline" size={30} color="white" />
              </Pressable>
            </View>

            {/* Input Fields Container */}
            <View style={styles.inputContainer}>
              <InputField
                placeholder="What's on your mind?"
                multiline={true}
                onChangeText={setCaption}
                value={caption}
              />
              <InputField
                placeholder="Hashtags"
                onChangeText={setHashtags}
                value={hashtags}
              />
              <InputField
                placeholder="Location"
                onChangeText={setLocation}
                value={location}
              />

              <View style={styles.privacyContainer}>
                <Text style={styles.privacyLabel}>Privacy:</Text>
                <Pressable onPress={() => setPrivacy("public")}>
                  <Text
                    style={[
                      styles.privacyOption,
                      privacy === "public" && styles.activePrivacy,
                    ]}
                  >
                    Public
                  </Text>
                </Pressable>
                <Pressable onPress={() => setPrivacy("private")}>
                  <Text
                    style={[
                      styles.privacyOption,
                      privacy === "private" && styles.activePrivacy,
                    ]}
                  >
                    Private
                  </Text>
                </Pressable>
                <Pressable onPress={() => setPrivacy("draft")}>
                  <Text
                    style={[
                      styles.privacyOption,
                      privacy === "draft" && styles.activePrivacy,
                    ]}
                  >
                    Draft
                  </Text>
                </Pressable>
              </View>

              <View style={styles.audioContainer}>
                <Button
                  title="Choose Audio"
                  onPress={() => {
                    /* Logic for choosing audio */
                  }}
                />
              </View>
            </View>
          </View>

          <View style={styles.postButtonContainer}>
            <Button title="Post" onPress={newPostHandler} />
          </View>
        </ScrollView>
      )}

      {uploading.status && (
        <>
          {uploading.success ? (
            <ProgressOverlay title={"Uploading"} progress={uploading.progress} />
          ) : (
            <ErrorOverlay
              message={"Uploading Failed"}
              onClose={() =>
                setUploading({ status: false, progress: 0, success: true })
              }
            />
          )}
        </>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary,
  },
  scrollContainer: {
    flex: 1,
    marginTop: 80,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 5,
    backgroundColor: GlobalStyles.colors.primary,
    borderRadius: 5,
    zIndex: 1,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadIcon: {
    marginVertical: 10,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  lightPurple: {
    backgroundColor: GlobalStyles.colors.lightpurple,
  },
  uploadText: {
    marginTop: 5,
    color: "white",
  },
  previewContainer: {
    flex: 1,
    width: "100%",
  },
  imageContainer: {
    width: "100%",
    height: 300,
    marginBottom: 20,
    backgroundColor: '#1a1a1a', // Debug background
    overflow: 'hidden',
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    backgroundColor: '#2a2a2a', // Debug background
  },
  inputContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  resizeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 30,
    padding: 5,
    zIndex: 1,
  },
  privacyContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
  },
  privacyLabel: {
    color: "white",
    marginRight: 10,
  },
  privacyOption: {
    color: "white",
    marginHorizontal: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activePrivacy: {
    backgroundColor: GlobalStyles.colors.purple,
    fontWeight: "bold",
  },
  audioContainer: {
    marginVertical: 10,
  },
  postButtonContainer: {
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
  },
});

export default NewPostScreen;