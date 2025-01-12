import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Switch,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Correct import
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { db, storage } from "../firebase"; // Import Firestore and Storage
import { setLogLevel } from "firebase/app";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Enable verbose Firebase logging
setLogLevel("debug");

const CreateActivityScreen = () => {
  const navigation = useNavigation();

  // States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("1");
  const [isBusinessActivity, setIsBusinessActivity] = useState(false);
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [availability, setAvailability] = useState("0");
  const [image, setImage] = useState(null);

  // Image picker handler
  const handleImagePicker = async () => {
    try {
      console.log("Opening image picker...");
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        console.log("Image selected:", result.assets[0].uri);
        setImage(result.assets[0].uri);
      } else {
        console.log("Image picker canceled or no image selected.");
        setImage(null);
      }
    } catch (error) {
      console.error("Error picking image:", error); // Added detailed logging
      Alert.alert("Error", "Failed to pick image.");
    }
  };

  // Handle activity submission
  const handleSubmit = async () => {
    if (!title || !description || !category || !price || !city) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    try {
      console.log("Starting activity creation...");
      let imageUrl = "";
      if (image) {
        try {
          const fileName = `activity_${Date.now()}.jpg`;
          console.log("Generated file name:", fileName);

          const response = await fetch(image);
          console.log("Fetching image for upload...");

          if (!response.ok) {
            throw new Error("Failed to fetch image for upload.");
          }

          const blob = await response.blob();
          console.log("Image blob created. Blob size:", blob.size);

          const imageRef = ref(storage, `activities/${fileName}`);
          console.log("Uploading image to path:", imageRef.fullPath);

          await uploadBytes(imageRef, blob);
          console.log("Image uploaded successfully.");

          imageUrl = await getDownloadURL(imageRef);
          console.log("Download URL generated:", imageUrl);
        } catch (error) {
          console.error("Error uploading image:", error); // Added detailed logging
          Alert.alert("Error", "Failed to upload image.");
          return; // Exit if the image upload fails
        }
      }

      const activityData = {
        title,
        description,
        category,
        price,
        maxParticipants,
        isBusinessActivity,
        location: { country, province, city },
        availability,
        imageUrl,
        createdAt: serverTimestamp(),
      };

      console.log("Saving activity data to Firestore:", activityData);
      const docRef = await addDoc(collection(db, "activities"), activityData);
      console.log("Activity created successfully with ID:", docRef.id);
      Alert.alert("Success", "Activity created successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error creating activity:", error); // Added detailed logging
      Alert.alert("Error", "Failed to create activity.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Create Activity</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter activity title"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Description (Max 50 chars)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter activity description"
        value={description}
        onChangeText={setDescription}
        maxLength={50}
      />

      <Text style={styles.label}>Category</Text>
      <Picker
        selectedValue={category}
        onValueChange={(value) => setCategory(value)}
        style={styles.picker}
      >
        <Picker.Item label="Select Category" value="" />
        <Picker.Item label="Move & Groove" value="Move & Groove" />
        <Picker.Item label="Art & Vibes" value="Art & Vibes" />
        <Picker.Item label="Foodie Heaven" value="Foodie Heaven" />
        <Picker.Item label="Let’s Hang" value="Let’s Hang" />
        <Picker.Item label="Fam Jam" value="Fam Jam" />
        <Picker.Item label="Zen Zone" value="Zen Zone" />
        <Picker.Item label="Night Owls" value="Night Owls" />
      </Picker>

      <Text style={styles.label}>Price ($)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Max Participants</Text>
      <Picker
        selectedValue={maxParticipants}
        onValueChange={(value) => setMaxParticipants(value)}
        style={styles.picker}
      >
        {[...Array(100).keys()].map((num) => (
          <Picker.Item key={num + 1} label={`${num + 1}`} value={`${num + 1}`} />
        ))}
      </Picker>

      <Text style={styles.label}>Business Activity</Text>
      <View style={styles.switchContainer}>
        <Text>{isBusinessActivity ? "Yes" : "No"}</Text>
        <Switch
          value={isBusinessActivity}
          onValueChange={(value) => setIsBusinessActivity(value)}
        />
      </View>

      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter city"
        value={city}
        onChangeText={setCity}
      />

      <Text style={styles.label}>Select Image</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={handleImagePicker}>
        <Text style={styles.imagePickerText}>Pick an Image</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Create Activity</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#3f4152",
  },
  header: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#fff",
    marginTop: 10,
  },
  input: {
    backgroundColor: "#2B2C3E",
    color: "#fff",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  picker: {
    backgroundColor: "#2B2C3E",
    color: "#fff",
    borderRadius: 8,
    marginTop: 5,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2B2C3E",
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  imagePicker: {
    backgroundColor: "#7A40F8",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  imagePickerText: {
    color: "#fff",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: "#7A40F8",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default CreateActivityScreen;
