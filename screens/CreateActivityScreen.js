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
import { firestore } from "../firebase"; // Import Firestore instance
import { collection, addDoc } from "firebase/firestore";

const CreateActivityScreen = () => {
  const navigation = useNavigation();

  // State for input fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [hashtags, setHashtags] = useState("");
  const [image, setImage] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const handleCategorySelection = (category) => {
    setSelectedCategories((prevCategories) => {
      if (prevCategories.includes(category)) {
        return prevCategories.filter((item) => item !== category);
      } else {
        return [...prevCategories, category];
      }
    });
  };

  const handleSubmit = async () => {
    try {
      // Save activity data to Firestore
      const newActivity = {
        title,
        description,
        date,
        location,
        privacy,
        hashtags: hashtags.split(","), // Convert hashtags to an array
        image,
        categories: selectedCategories,
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(firestore, "activities"), newActivity);
      console.log("Document written with ID: ", docRef.id);

      Alert.alert("Success", "Activity created successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error adding document: ", error);
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
