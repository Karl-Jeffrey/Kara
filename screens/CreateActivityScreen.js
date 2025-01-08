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
import { firestore, storage } from "../firebase"; // Import Firestore and Storage
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CreateActivityScreen = () => {
  const navigation = useNavigation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [hashtags, setHashtags] = useState("");
  const [image, setImage] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri); // Ensure we get a valid URI
      } else {
        setImage(null); // Handle the case where no image is selected
      }
    } catch (error) {
      console.error("Error picking image:", error.message);
    }
  };

  const uploadImage = async (uri) => {
    if (!uri) {
      return ""; // Return an empty string if no image is selected
    }

    try {
      // Use Expo FileSystem to get the file
      const fileName = uri.split("/").pop();
      const response = await fetch(uri);

      if (!response.ok) {
        throw new Error("Failed to fetch image for upload");
      }

      const blob = await response.blob();
      const imageRef = ref(storage, `activities/${fileName}`);
      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error.message);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !date || !location) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    try {
      let imageURL = "";

      if (image) {
        imageURL = await uploadImage(image);
      }

      const activityData = {
        title,
        description,
        date,
        location,
        privacy,
        hashtags,
        image: imageURL,
        categories: selectedCategories.length ? selectedCategories : ["General"],
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(firestore, "activities"), activityData);

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
        {/* Title Field */}
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
          onChangeText={(text) => setTitle(text)}
        />

        {/* Description Field */}
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
          onChangeText={(text) => setDescription(text)}
        />

        {/* Date Field */}
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
          onChangeText={(text) => setDate(text)}
        />

        {/* Location Field */}
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
          onChangeText={(text) => setLocation(text)}
        />

        {/* Privacy Options */}
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
            <Text style={[GlobalStyles.styles.privacyOptionText, { color: "#fff" }]}>Friends Only</Text>
          </TouchableOpacity>
        </View>

        {/* Hashtags Field */}
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
          onChangeText={(text) => setHashtags(text)}
        />

        {/* Image Picker */}
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

        {/* Submit Button */}
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
