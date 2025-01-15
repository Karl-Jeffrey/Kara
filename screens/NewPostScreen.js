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
  Alert,
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
import { firestore } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const { width, height } = Dimensions.get("window");

function NewPostScreen({ navigation }) {
  const authCtx = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [location, setLocation] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [uploading, setUploading] = useState({
    status: false,
    progress: 0,
    success: true,
  });

  const newPostHandler = useCallback(async () => {
    if (!post || !caption.trim()) {
      Alert.alert("Error", "Please upload an image and provide a caption.");
      return;
    }

    try {
      setUploading((prevData) => ({ ...prevData, status: true }));

      const postData = {
        userId: authCtx.userData._id, // User ID from AuthContext
        content: caption,
        hashtags,
        location,
        privacy,
        imageUrl: post.uri, // Image URI
        likesCount: 0,
        commentsCount: 0,
        createdAt: serverTimestamp(), // Firestore server timestamp
      };

      // Save the post data to Firestore
      const docRef = await addDoc(collection(firestore, "posts"), postData);

      console.log("Post added with ID:", docRef.id);
      setUploading({ status: false, progress: 0, success: true });

      Alert.alert("Success", "Your post has been uploaded!");
      navigation.goBack();
    } catch (error) {
      setUploading((prevData) => ({ ...prevData, success: false }));
      console.error("Error creating post:", error.message);
      Alert.alert("Error", "Failed to upload your post. Please try again.");
    }
  }, [authCtx.userData._id, caption, hashtags, location, privacy, post, navigation]);

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

      if (!result.canceled) {
        const imageUri = result.assets ? result.assets[0].uri : result.uri;
        setPost({
          uri: imageUri,
          type: "image/jpeg",
          fileName: "photo.jpg",
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

      if (!result.canceled) {
        const imageUri = result.assets ? result.assets[0].uri : result.uri;
        setPost({
          uri: imageUri,
          type: "image/jpeg",
          fileName: "photo.jpg",
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
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: post.uri }}
                style={styles.imagePreview}
                resizeMode="contain"
              />
              <Pressable
                style={styles.resizeButton}
                onPress={() => setPost(null)}
              >
                <Ionicons name="close-outline" size={30} color="white" />
              </Pressable>
            </View>
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
            </View>
          </View>
          <View style={styles.postButtonContainer}>
            <Button title="Post" onPress={newPostHandler} />
          </View>
        </ScrollView>
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