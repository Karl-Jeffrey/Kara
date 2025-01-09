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
import { GlobalStyles } from "../constants/Styles";
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
  const [privacy, setPrivacy] = useState("public"); // Privacy state
  const [hashtags, setHashtags] = useState(""); // Hashtags state
  const [image, setImage] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Image picker handler
  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      } else {
        setImage(null);
      }
    } catch (error) {
      console.error("Error picking image:", error.message);
      Alert.alert("Error", "Failed to pick image.");
    }
  };

  // Upload image to Firebase Storage
  const uploadImage = async (uri) => {
    if (!uri) return ""; // Default to empty if no image is selected

    try {
      const fileName = uri.split("/").pop(); // Extract file name from URI
      const response = await fetch(uri);

      if (!response.ok) throw new Error("Failed to fetch image for upload.");

      const blob = await response.blob();
      const imageRef = ref(storage, `activities/${fileName}`);
      await uploadBytes(imageRef, blob);
      return await getDownloadURL(imageRef);
    } catch (error) {
      console.error("Error uploading image:", error.message);
      return ""; // Return empty on failure
    }
  };

  // Handle activity submission
  const handleSubmit = async () => {
    if (!title || !description || !date || !location) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    try {
      let imageURL = "";
      if (image) {
        imageURL = await uploadImage(image); // Upload image and get URL
      }

      const activityData = {
        title,
        description,
        date,
        location,
        privacy, // Include privacy field
        hashtags,
        imageUrl: imageURL, // Save the image URL to Firestore
        categories: selectedCategories.length ? selectedCategories : ["General"],
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(firestore, "activities"), activityData); // Save data
      Alert.alert("Success", "Activity created successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error creating activity:", error.message);
      Alert.alert("Error", "Failed to create activity. Please try again.");
    }
  };

  return (
    <ScrollView
      style={[GlobalStyles.styles.container, { backgroundColor: "#3f4152" }]}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <View style={GlobalStyles.styles.form}>
        <Text style={[GlobalStyles.styles.label, { color: "#fff", marginBottom: 8 }]}>
          Title
        </Text>
        <TextInput
          style={[
            GlobalStyles.styles.input,
            { fontSize: 18, padding: 15, backgroundColor: "#2B2C3E", color: "#fff", borderRadius: 8 },
          ]}
          placeholder="Enter activity title"
          placeholderTextColor="#ccc"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={[GlobalStyles.styles.label, { color: "#fff", marginTop: 20, marginBottom: 8 }]}>
          Description
        </Text>
        <TextInput
          style={[
            GlobalStyles.styles.input,
            { fontSize: 18, padding: 15, backgroundColor: "#2B2C3E", color: "#fff", borderRadius: 8 },
          ]}
          placeholder="Enter activity description"
          placeholderTextColor="#ccc"
          value={description}
          onChangeText={setDescription}
        />

        <Text style={[GlobalStyles.styles.label, { color: "#fff", marginTop: 20, marginBottom: 8 }]}>
          Date
        </Text>
        <TextInput
          style={[
            GlobalStyles.styles.input,
            { fontSize: 18, padding: 15, backgroundColor: "#2B2C3E", color: "#fff", borderRadius: 8 },
          ]}
          placeholder="Enter activity date"
          placeholderTextColor="#ccc"
          value={date}
          onChangeText={setDate}
        />

        <Text style={[GlobalStyles.styles.label, { color: "#fff", marginTop: 20, marginBottom: 8 }]}>
          Location
        </Text>
        <TextInput
          style={[
            GlobalStyles.styles.input,
            { fontSize: 18, padding: 15, backgroundColor: "#2B2C3E", color: "#fff", borderRadius: 8 },
          ]}
          placeholder="Enter activity location"
          placeholderTextColor="#ccc"
          value={location}
          onChangeText={setLocation}
        />

        <Text style={[GlobalStyles.styles.label, { color: "#fff", marginTop: 20, marginBottom: 8 }]}>
          Privacy
        </Text>
        <View style={GlobalStyles.styles.privacyOptions}>
          <TouchableOpacity
            style={[
              GlobalStyles.styles.privacyOption,
              privacy === "public" && GlobalStyles.styles.selectedOption,
              { padding: 10, borderRadius: 8, backgroundColor: privacy === "public" ? "#7A40F8" : "#2B2C3E" },
            ]}
            onPress={() => setPrivacy("public")}
          >
            <Text style={[GlobalStyles.styles.privacyOptionText, { color: "#fff" }]}>Public</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              GlobalStyles.styles.privacyOption,
              privacy === "private" && GlobalStyles.styles.selectedOption,
              { padding: 10, borderRadius: 8, backgroundColor: privacy === "private" ? "#7A40F8" : "#2B2C3E" },
            ]}
            onPress={() => setPrivacy("private")}
          >
            <Text style={[GlobalStyles.styles.privacyOptionText, { color: "#fff" }]}>Private</Text>
          </TouchableOpacity>
        </View>

        <Text style={[GlobalStyles.styles.label, { color: "#fff", marginTop: 20, marginBottom: 8 }]}>
          Hashtags
        </Text>
        <TextInput
          style={[
            GlobalStyles.styles.input,
            { fontSize: 18, padding: 15, backgroundColor: "#2B2C3E", color: "#fff", borderRadius: 8 },
          ]}
          placeholder="Enter hashtags (separated by commas)"
          placeholderTextColor="#ccc"
          value={hashtags}
          onChangeText={setHashtags}
        />

        <Text style={[GlobalStyles.styles.label, { color: "#fff", marginTop: 20, marginBottom: 8 }]}>
          Select Image
        </Text>
        <TouchableOpacity
          style={{
            padding: 15,
            backgroundColor: "#7A40F8",
            borderRadius: 8,
            marginBottom: 20,
            alignItems: "center",
          }}
          onPress={handleImagePicker}
        >
          <Text style={{ color: "#fff" }}>Pick an Image</Text>
        </TouchableOpacity>

        {image && (
          <Image
            source={{ uri: image }}
            style={{ width: 200, height: 200, borderRadius: 8, marginBottom: 20 }}
          />
        )}

        <TouchableOpacity
          style={{
            padding: 15,
            backgroundColor: "#7A40F8",
            borderRadius: 8,
            alignItems: "center",
            marginTop: 30,
          }}
          onPress={handleSubmit}
        >
          <Text style={{ color: "#fff" }}>Create Activity</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CreateActivityScreen;
