import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Importing Ionicons from react-native-vector-icons
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook for navigation
import { GlobalStyles } from '../constants/Styles';

const BusinessInfoScreen = () => {
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [license, setLicense] = useState('');
  const [proofOfWork, setProofOfWork] = useState('');

  const navigation = useNavigation();

  const handleSubmit = () => {
    // Example validation
    if (!businessName || !address || !phoneNumber || !license || !proofOfWork) {
      Alert.alert('Error', 'Please fill in all the fields.');
      return;
    }

    console.log('Business Information:', {
      businessName,
      address,
      phoneNumber,
      license,
      proofOfWork,
    });

    Alert.alert('Success', 'Business information submitted!');
  };

  return (
    <ScrollView style={[GlobalStyles.styles.container, { backgroundColor: '#3f4152' }]} contentContainerStyle={{ padding: 20 }}>
      {/* Back Button */}
      <TouchableOpacity style={{ marginBottom: 20 }} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Centered Title */}
      <Text style={[GlobalStyles.styles.title, { color: '#fff', fontSize: 32, textAlign: 'center', marginVertical: 20 }]}>Proof of Business</Text>

      {/* Business Name */}
      <InputField
        label={<><Ionicons name="business" size={24} color="#fff" /> Business Name</>}
        placeholder="Enter your business name"
        value={businessName}
        onChangeText={setBusinessName}
      />

      {/* Address */}
      <InputField
        label={<><Ionicons name="location" size={24} color="#fff" /> Address</>}
        placeholder="Enter your business address"
        value={address}
        onChangeText={setAddress}
      />

      {/* Phone Number */}
      <InputField
        label={<><Ionicons name="call" size={24} color="#fff" /> Phone Number</>}
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      {/* License */}
      <InputField
        label={<><Ionicons name="card" size={24} color="#fff" /> License</>}
        placeholder="Enter your business license"
        value={license}
        onChangeText={setLicense}
      />

      {/* Proof of Work */}
      <InputField
        label={<><Ionicons name="document-text" size={24} color="#fff" /> Proof of Work in Canada</>}
        placeholder="Enter proof of work in Canada"
        value={proofOfWork}
        onChangeText={setProofOfWork}
      />

      {/* Submit Button */}
      <SubmitButton onPress={handleSubmit} />
    </ScrollView>
  );
};

// Component for input fields with consistent styling
const InputField = ({ label, placeholder, value, onChangeText, keyboardType = 'default' }) => (
  <View style={{ marginBottom: 20 }}>
    <Text style={[GlobalStyles.styles.label, { color: '#fff', marginBottom: 8 }]}>{label}</Text>
    <TextInput
      style={[GlobalStyles.styles.input, { backgroundColor: '#2B2C3E', color: '#fff', borderRadius: 8 }]}
      placeholder={placeholder}
      placeholderTextColor="#ccc"
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
    />
  </View>
);

// Component for the submit button with consistent styling
const SubmitButton = ({ onPress }) => (
  <TouchableOpacity
    style={{
      backgroundColor: '#7A40F8',
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 30,
    }}
    onPress={onPress}
  >
    <Text style={{ color: '#fff', fontSize: 18 }}>Submit</Text>
  </TouchableOpacity>
);

export default BusinessInfoScreen;
