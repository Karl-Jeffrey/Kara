import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GlobalStyles } from "../constants/Styles"; // Ensure this import is correct

const IdentityScreen = () => {
  const navigation = useNavigation();

  const handleConsumerPress = () => {
    // Redirect to SignupScreen with some params if needed
    navigation.navigate("SignupScreen", { userType: "consumer" });
  };

  const handleBusinessPress = () => {
    // Redirect to SignupScreen with some params if needed
    navigation.navigate("SignupScreen", { userType: "business" });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Who are you?</Text>

      {/* First transparent button with title and description */}
      <TouchableOpacity
        style={styles.transparentButton}
        onPress={handleConsumerPress}
      >
        <Text style={styles.buttonTitle}>I am a consumer</Text>
        <Text style={styles.buttonText}>I would like to find the ideal activity</Text>
      </TouchableOpacity>

      {/* Second transparent button with title and description */}
      <TouchableOpacity
        style={styles.transparentButton}
        onPress={handleBusinessPress}
      >
        <Text style={styles.buttonTitle}>I am a business owner</Text>
        <Text style={styles.buttonText}>I would like to promote my business</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: GlobalStyles.colors.primary,  // Using GlobalStyles color
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    color: "purple",  // Adjust color if necessary
  },
  transparentButton: {
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "transparent",
    padding: 15,
    borderRadius: 6,
    width: "100%",
    marginBottom: 20,
    alignItems: "center",
  },
  buttonTitle: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  buttonText: {
    fontSize: 14,
    color: "white",
  },
});

export default IdentityScreen;
