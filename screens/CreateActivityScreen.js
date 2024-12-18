import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { GlobalStyles } from '../constants/Styles';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const CreateActivityScreen = () => {
  const navigation = useNavigation();

  // State for input fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [hashtags, setHashtags] = useState('');
  const [image, setImage] = useState(null);

  // State for selected categories
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
        return prevCategories.filter((item) => item !== category); // Deselect if already selected
      } else {
        return [...prevCategories, category]; // Select the category
      }
    });
  };

  const handleSubmit = () => {
    // Mock submission logic (replace with backend call or storage logic)
    console.log('New Activity:', {
      title,
      description,
      date,
      location,
      privacy,
      hashtags,
      image,
      categories: selectedCategories,
    });

    Alert.alert('Success', 'Activity created successfully!');
    navigation.goBack();
  };

  return (
    <ScrollView
      style={[GlobalStyles.styles.container, { backgroundColor: '#3f4152' }]}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <View style={GlobalStyles.styles.form}>
        {/* Title Field */}
        <Text style={[GlobalStyles.styles.label, { color: '#fff', marginBottom: 8 }]}>Title</Text>
        <TextInput
          style={[GlobalStyles.styles.input, { fontSize: 18, padding: 15, backgroundColor: '#2B2C3E', color: '#fff', borderRadius: 8 }]}
          placeholder="Enter activity title"
          placeholderTextColor="#ccc"
          value={title}
          onChangeText={(text) => setTitle(text)}
        />

        {/* Description Field */}
        <Text style={[GlobalStyles.styles.label, { color: '#fff', marginTop: 20, marginBottom: 8 }]}>Description</Text>
        <TextInput
          style={[GlobalStyles.styles.input, { fontSize: 18, padding: 15, backgroundColor: '#2B2C3E', color: '#fff', borderRadius: 8 }]}
          placeholder="Enter activity description"
          placeholderTextColor="#ccc"
          value={description}
          onChangeText={(text) => setDescription(text)}
        />

        {/* Date Field */}
        <Text style={[GlobalStyles.styles.label, { color: '#fff', marginTop: 20, marginBottom: 8 }]}>Date</Text>
        <TextInput
          style={[GlobalStyles.styles.input, { fontSize: 18, padding: 15, backgroundColor: '#2B2C3E', color: '#fff', borderRadius: 8 }]}
          placeholder="Enter activity date"
          placeholderTextColor="#ccc"
          value={date}
          onChangeText={(text) => setDate(text)}
        />

        {/* Location Field */}
        <Text style={[GlobalStyles.styles.label, { color: '#fff', marginTop: 20, marginBottom: 8 }]}>Location</Text>
        <TextInput
          style={[GlobalStyles.styles.input, { fontSize: 18, padding: 15, backgroundColor: '#2B2C3E', color: '#fff', borderRadius: 8 }]}
          placeholder="Enter activity location"
          placeholderTextColor="#ccc"
          value={location}
          onChangeText={(text) => setLocation(text)}
        />

        {/* Privacy Options */}
        <Text style={[GlobalStyles.styles.label, { color: '#fff', marginTop: 20, marginBottom: 8 }]}>Privacy</Text>
        <View style={GlobalStyles.styles.privacyOptions}>
          <TouchableOpacity
            style={[
              GlobalStyles.styles.privacyOption,
              privacy === 'public' && GlobalStyles.styles.selectedOption,
              { padding: 10, borderRadius: 8, backgroundColor: privacy === 'public' ? '#7A40F8' : '#2B2C3E' }
            ]}
            onPress={() => setPrivacy('public')}
          >
            <Text style={[GlobalStyles.styles.privacyOptionText, { color: '#fff' }]}>Public</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              GlobalStyles.styles.privacyOption,
              privacy === 'private' && GlobalStyles.styles.selectedOption,
              { padding: 10, borderRadius: 8, backgroundColor: privacy === 'private' ? '#7A40F8' : '#2B2C3E' }
            ]}
            onPress={() => setPrivacy('private')}
          >
            <Text style={[GlobalStyles.styles.privacyOptionText, { color: '#fff' }]}>Friends Only</Text>
          </TouchableOpacity>
        </View>

        {/* Hashtags Field */}
        <Text style={[GlobalStyles.styles.label, { color: '#fff', marginTop: 20, marginBottom: 8 }]}>Hashtags</Text>
        <TextInput
          style={[GlobalStyles.styles.input, { fontSize: 18, padding: 15, backgroundColor: '#2B2C3E', color: '#fff', borderRadius: 8 }]}
          placeholder="Enter hashtags (separated by commas)"
          placeholderTextColor="#ccc"
          value={hashtags}
          onChangeText={(text) => setHashtags(text)}
        />

       

       {/* Categories Section */}
<Text style={[GlobalStyles.styles.label, { color: '#fff', marginTop: 20, marginBottom: 8 }]}>Categories</Text>
<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
  <TouchableOpacity
    key="Move & Groove"
    style={[
      GlobalStyles.styles.categoryButton,
      selectedCategories.includes('Move & Groove') && { backgroundColor: '#7A40F8' },
      { margin: 5 }
    ]}
    onPress={() => handleCategorySelection('Move & Groove')}
  >
    <Text style={[GlobalStyles.styles.categoryButtonText, { color: '#fff' }]}>Move & Groove</Text>
  </TouchableOpacity>
  <TouchableOpacity
    key="Art & Vibes"
    style={[
      GlobalStyles.styles.categoryButton,
      selectedCategories.includes('Art & Vibes') && { backgroundColor: '#7A40F8' },
      { margin: 5 }
    ]}
    onPress={() => handleCategorySelection('Art & Vibes')}
  >
    <Text style={[GlobalStyles.styles.categoryButtonText, { color: '#fff' }]}>Art & Vibes</Text>
  </TouchableOpacity>
  <TouchableOpacity
    key="Foodie Heaven"
    style={[
      GlobalStyles.styles.categoryButton,
      selectedCategories.includes('Foodie Heaven') && { backgroundColor: '#7A40F8' },
      { margin: 5 }
    ]}
    onPress={() => handleCategorySelection('Foodie Heaven')}
  >
    <Text style={[GlobalStyles.styles.categoryButtonText, { color: '#fff' }]}>Foodie Heaven</Text>
  </TouchableOpacity>
  <TouchableOpacity
    key="Let’s Hang"
    style={[
      GlobalStyles.styles.categoryButton,
      selectedCategories.includes('Let’s Hang') && { backgroundColor: '#7A40F8' },
      { margin: 5 }
    ]}
    onPress={() => handleCategorySelection('Let’s Hang')}
  >
    <Text style={[GlobalStyles.styles.categoryButtonText, { color: '#fff' }]}>Let’s Hang</Text>
  </TouchableOpacity>
  <TouchableOpacity
    key="Fam Jam"
    style={[
      GlobalStyles.styles.categoryButton,
      selectedCategories.includes('Fam Jam') && { backgroundColor: '#7A40F8' },
      { margin: 5 }
    ]}
    onPress={() => handleCategorySelection('Fam Jam')}
  >
    <Text style={[GlobalStyles.styles.categoryButtonText, { color: '#fff' }]}>Fam Jam</Text>
  </TouchableOpacity>
  <TouchableOpacity
    key="Zen Zone"
    style={[
      GlobalStyles.styles.categoryButton,
      selectedCategories.includes('Zen Zone') && { backgroundColor: '#7A40F8' },
      { margin: 5 }
    ]}
    onPress={() => handleCategorySelection('Zen Zone')}
  >
    <Text style={[GlobalStyles.styles.categoryButtonText, { color: '#fff' }]}>Zen Zone</Text>
  </TouchableOpacity>
  <TouchableOpacity
    key="Night Owls"
    style={[
      GlobalStyles.styles.categoryButton,
      selectedCategories.includes('Night Owls') && { backgroundColor: '#7A40F8' },
      { margin: 5 }
    ]}
    onPress={() => handleCategorySelection('Night Owls')}
  >
    <Text style={[GlobalStyles.styles.categoryButtonText, { color: '#fff' }]}>Night Owls</Text>
  </TouchableOpacity>
</View>


       {/* Budget Section */}
<Text style={[GlobalStyles.styles.label, { color: '#fff', marginTop: 20, marginBottom: 8 }]}>Budget</Text>
<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
  <TouchableOpacity
    key="Ça coûte rien"
    style={[
      GlobalStyles.styles.categoryButton,
      selectedCategories.includes('Ça coûte rien') && { backgroundColor: '#7A40F8' },
      { margin: 5 }
    ]}
    onPress={() => handleCategorySelection('Ça coûte rien')}
  >
    <Text style={[GlobalStyles.styles.categoryButtonText, { color: '#fff' }]}>Ça coûte rien</Text>
  </TouchableOpacity>
  <TouchableOpacity
    key="Petite dépense"
    style={[
      GlobalStyles.styles.categoryButton,
      selectedCategories.includes('Petite dépense') && { backgroundColor: '#7A40F8' },
      { margin: 5 }
    ]}
    onPress={() => handleCategorySelection('Petite dépense')}
  >
    <Text style={[GlobalStyles.styles.categoryButtonText, { color: '#fff' }]}>Petite dépense</Text>
  </TouchableOpacity>
  <TouchableOpacity
    key="Balance ton budget"
    style={[
      GlobalStyles.styles.categoryButton,
      selectedCategories.includes('Balance ton budget') && { backgroundColor: '#7A40F8' },
      { margin: 5 }
    ]}
    onPress={() => handleCategorySelection('Balance ton budget')}
  >
    <Text style={[GlobalStyles.styles.categoryButtonText, { color: '#fff' }]}>Balance ton budget</Text>
  </TouchableOpacity>
  <TouchableOpacity
    key="Treat Yourself"
    style={[
      GlobalStyles.styles.categoryButton,
      selectedCategories.includes('Treat Yourself') && { backgroundColor: '#7A40F8' },
      { margin: 5 }
    ]}
    onPress={() => handleCategorySelection('Treat Yourself')}
  >
    <Text style={[GlobalStyles.styles.categoryButtonText, { color: '#fff' }]}>Treat Yourself</Text>
  </TouchableOpacity>
</View>

{/* Crew Size Section */}
<Text style={[GlobalStyles.styles.label, { color: '#fff', marginTop: 20, marginBottom: 8 }]}>Crew Size</Text>
<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
  <TouchableOpacity
    key="Solo Flow"
    style={[
      GlobalStyles.styles.categoryButton,
      selectedCategories.includes('Solo Flow') && { backgroundColor: '#7A40F8' },
      { margin: 5 }
    ]}
    onPress={() => handleCategorySelection('Solo Flow')}
  >
    <Text style={[GlobalStyles.styles.categoryButtonText, { color: '#fff' }]}>Solo Flow</Text>
  </TouchableOpacity>
  <TouchableOpacity
    key="Duo Goals"
    style={[
      GlobalStyles.styles.categoryButton,
      selectedCategories.includes('Duo Goals') && { backgroundColor: '#7A40F8' },
      { margin: 5 }
    ]}
    onPress={() => handleCategorySelection('Duo Goals')}
  >
    <Text style={[GlobalStyles.styles.categoryButtonText, { color: '#fff' }]}>Duo Goals</Text>
  </TouchableOpacity>
  <TouchableOpacity
    key="Squad Time"
    style={[
      GlobalStyles.styles.categoryButton,
      selectedCategories.includes('Squad Time') && { backgroundColor: '#7A40F8' },
      { margin: 5 }
    ]}
    onPress={() => handleCategorySelection('Squad Time')}
  >
    <Text style={[GlobalStyles.styles.categoryButtonText, { color: '#fff' }]}>Squad Time</Text>
  </TouchableOpacity>
  <TouchableOpacity
    key="Big Crew Vibes"
    style={[
      GlobalStyles.styles.categoryButton,
      selectedCategories.includes('Big Crew Vibes') && { backgroundColor: '#7A40F8' },
      { margin: 5 }
    ]}
    onPress={() => handleCategorySelection('Big Crew Vibes')}
  >
    <Text style={[GlobalStyles.styles.categoryButtonText, { color: '#fff' }]}>Big Crew Vibes</Text>
  </TouchableOpacity>
</View>

{/* Spot Section */}
<Text style={[GlobalStyles.styles.label, { color: '#fff', marginTop: 20, marginBottom: 8 }]}>Spot</Text>
<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
  <TouchableOpacity
    key="Near Me"
    style={[
      GlobalStyles.styles.categoryButton,
      selectedCategories.includes('Near Me') && { backgroundColor: '#7A40F8' },
      { margin: 5 }
    ]}
    onPress={() => handleCategorySelection('Near Me')}
  >
    <Text style={[GlobalStyles.styles.categoryButtonText, { color: '#fff' }]}>Near Me</Text>
  </TouchableOpacity>
  <TouchableOpacity
    key="Hood Explorer"
    style={[
      GlobalStyles.styles.categoryButton,
      selectedCategories.includes('Hood Explorer') && { backgroundColor: '#7A40F8' },
      { margin: 5 }
    ]}
    onPress={() => handleCategorySelection('Hood Explorer')}
  >
    <Text style={[GlobalStyles.styles.categoryButtonText, { color: '#fff' }]}>Hood Explorer</Text>
  </TouchableOpacity>
  <TouchableOpacity
    key="Next Stop"
    style={[
      GlobalStyles.styles.categoryButton,
      selectedCategories.includes('Next Stop') && { backgroundColor: '#7A40F8' },
      { margin: 5 }
    ]}
    onPress={() => handleCategorySelection('Next Stop')}
  >
    <Text style={[GlobalStyles.styles.categoryButtonText, { color: '#fff' }]}>Next Stop</Text>
  </TouchableOpacity>
</View>

{/* Duration Section */}
<Text style={[GlobalStyles.styles.label, { color: '#fff', marginTop: 20, marginBottom: 8 }]}>Duration</Text>
<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
  <TouchableOpacity
    key="Quickie"
    style={[
      GlobalStyles.styles.categoryButton,
      selectedCategories.includes('Quickie') && { backgroundColor: '#7A40F8' },
      { margin: 5 }
    ]}
    onPress={() => handleCategorySelection('Quickie')}
  >
    <Text style={[GlobalStyles.styles.categoryButtonText, { color: '#fff' }]}>Quickie</Text>
  </TouchableOpacity>
  <TouchableOpacity
    key="Take Your Time"
    style={[
      GlobalStyles.styles.categoryButton,
      selectedCategories.includes('Take Your Time') && { backgroundColor: '#7A40F8' },
      { margin: 5 }
    ]}
    onPress={() => handleCategorySelection('Take Your Time')}
  >
    <Text style={[GlobalStyles.styles.categoryButtonText, { color: '#fff' }]}>Take Your Time</Text>
  </TouchableOpacity>
  <TouchableOpacity
    key="Half-Day Hustle"
    style={[
      GlobalStyles.styles.categoryButton,
      selectedCategories.includes('Half-Day Hustle') && { backgroundColor: '#7A40F8' },
      { margin: 5 }
    ]}
    onPress={() => handleCategorySelection('Half-Day Hustle')}
  >
    <Text style={[GlobalStyles.styles.categoryButtonText, { color: '#fff' }]}>Half-Day Hustle</Text>
  </TouchableOpacity>
  <TouchableOpacity
    key="Full Send"
    style={[
      GlobalStyles.styles.categoryButton,
      selectedCategories.includes('Full Send') && { backgroundColor: '#7A40F8' },
      { margin: 5 }
    ]}
    onPress={() => handleCategorySelection('Full Send')}
  >
    <Text style={[GlobalStyles.styles.categoryButtonText, { color: '#fff' }]}>Full Send</Text>
  </TouchableOpacity>
</View>


{/* Image Picker Button */}
<Text style={[GlobalStyles.styles.label, { color: '#fff', marginTop: 20, marginBottom: 8 }]}>Select Image</Text>
        <TouchableOpacity
          style={{
            padding: 15,
            backgroundColor: '#7A40F8',
            borderRadius: 8,
            marginBottom: 20,
            alignItems: 'center',
          }}
          onPress={handleImagePicker}
        >
          <Text style={{ color: '#fff' }}>Pick an Image</Text>
        </TouchableOpacity>

        {/* Display Selected Image */}
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
    backgroundColor: '#7A40F8',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  }}
  onPress={() => navigation.navigate('BusinessInfoScreen')}
>
  <Text style={{ color: '#fff' }}>Create Activity</Text>
</TouchableOpacity>

      </View>
    </ScrollView>
  );
};

export default CreateActivityScreen;
