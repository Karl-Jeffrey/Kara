import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { firestore, storage } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CreateActivityScreen = () => {
  const navigation = useNavigation();

  // States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);

  // Image picker handler
  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImage(result.assets[0].uri);
    } else {
      Alert.alert("Error", "Image selection canceled or failed.");
    }
  };

  // Upload image to Firebase Storage and return the URL
  const uploadImage = async (uri) => {
    const fileName = uri.split("/").pop(); // Extract file name
    const imageRef = ref(storage, `activities/${fileName}`); // Create a storage reference

    try {
      const response = await fetch(uri); // Fetch the file
      const blob = await response.blob(); // Convert to blob
      await uploadBytes(imageRef, blob); // Upload the blob
      const downloadURL = await getDownloadURL(imageRef); // Get the URL
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error.message);
      throw new Error("Failed to upload image.");
    }
  };

  // Handle activity submission
  const handleSubmit = async () => {
    if (!title || !description || !date || !location) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    let imageUrl = "";
    if (image) {
      try {
        imageUrl = await uploadImage(image); // Upload image and get URL
      } catch (error) {
        Alert.alert("Error", "Failed to upload image.");
        return;
      }
    }

    const activityData = {
      title,
      description,
      date,
      location,
      imageUrl, // Save the image URL
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(firestore, "activities"), activityData); // Save to Firestore
      Alert.alert("Success", "Activity created successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error creating activity:", error.message);
      Alert.alert("Error", "Failed to create activity.");
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: "#f0f0f0" }}>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderRadius: 5 }}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderRadius: 5 }}
      />
      <TextInput
        placeholder="Date"
        value={date}
        onChangeText={setDate}
        style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderRadius: 5 }}
      />
      <TextInput
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
        style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderRadius: 5 }}
      />
      <TouchableOpacity onPress={handleImagePicker} style={{ marginBottom: 20 }}>
        <Text style={{ color: "blue" }}>Pick an Image</Text>
      </TouchableOpacity>
      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: "100%", height: 200, marginBottom: 20 }}
        />
      )}
      <TouchableOpacity
        onPress={handleSubmit}
        style={{
          padding: 15,
          backgroundColor: "blue",
          borderRadius: 5,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white" }}>Create Activity</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CreateActivityScreen;
