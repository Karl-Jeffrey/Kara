import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Image,
  Text,
} from "react-native";
import React, { useContext, useState, useCallback } from "react";
import { GlobalStyles } from "../constants/Styles";
import Button from "../components/Button";
import InputField from "../components/InputField";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../store/auth-context";
import ProgressOverlay from "../components/ProgressOverlay";
import ErrorOverlay from "../components/ErrorOverlay";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from 'expo-image-picker'; // Import the required library

const { width, height } = Dimensions.get("window");

function NewPostScreen({ navigation }) {
  const authCtx = useContext(AuthContext);
  const [type, setType] = useState();
  const [post, setPost] = useState(null);
  const [caption, setCaption] = useState("");
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

        // Simulate an upload delay for demonstration
        setTimeout(() => {
          setUploading({ status: false, progress: 0, success: true });
          navigation.goBack(); // Navigate back after upload
        }, 3000);
      } catch (error) {
        setUploading((prevData) => ({
          ...prevData,
          success: false,
        }));
        console.log(error.message);
      }
    }
  }, [authCtx.userData._id, caption, post, navigation]);

  const openImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.cancelled) {
      console.log("User cancelled image picker");
    } else if (result.error) {
      console.error("Image picker error:", result.error);
    } else {
      setPost(result);
    }
  };

  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.cancelled) {
      console.log("User cancelled camera picker");
    } else if (result.error) {
      console.error("Camera picker error:", result.error);
    } else {
      setPost(result);
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
          <Pressable onPress={openImagePicker} style={styles.uploadIcon}>
            <Ionicons name="image-outline" size={50} color="white" />
            <Text style={styles.uploadText}>Upload</Text>
          </Pressable>
          <Pressable onPress={openCamera} style={styles.uploadIcon}>
            <Ionicons name="camera-outline" size={50} color="white" />
            <Text style={styles.uploadText}>Camera</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: post.uri }}
            style={styles.imagePreview}
          />
          <Pressable style={styles.resizeButton} onPress={() => setPost(null)}>
            <Ionicons name="close-outline" size={30} color="white" />
          </Pressable>
          <InputField placeholder="What's on your mind?" multiline={true} onChangeText={setCaption} value={caption} />
        </View>
      )}
      {post && (
        <View style={{ padding: 20 }}>
          <Button title={"Post"} onPress={newPostHandler} />
        </View>
      )}
      {uploading.status && (
        <>
          {uploading.success ? (
            <ProgressOverlay title={"Uploading"} progress={uploading.progress} />
          ) : (
            <ErrorOverlay message={"Uploading Failed"} onClose={() => setUploading({ status: false, progress: 0, success: true })} />
          )}
        </>
      )}
    </KeyboardAvoidingView>
  );
}

export default NewPostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 5,
    backgroundColor: GlobalStyles.colors.primary,
    borderRadius: 5,
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
    backgroundColor: GlobalStyles.colors.lightpurple,
    alignItems: "center",
  },
  uploadText: {
    marginTop: 5,
    color: "white",
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePreview: {
    width: "100%",
    height: height / 2,
    borderRadius: 20,
    overflow: "hidden",
  },
  resizeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "black",
    borderRadius: 30,
    padding: 5,
  },
});
