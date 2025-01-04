import { View, Text, Alert, StyleSheet } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Formik } from "formik";
import * as yup from "yup";
import Validator from "email-validator";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "../../firebase"; // Ensure firebase.js is properly set up
import { collection, addDoc } from "firebase/firestore";

import InputField from "../InputField";
import { GlobalStyles } from "../../constants/Styles";

const SignupForm = ({ navigation }) => {
  const SignupFormSchema = yup.object().shape({
    email: yup.string().email().required("Email address is required."),
    password: yup.string().min(8, "Password must have at least 8 characters."),
    username: yup
      .string()
      .required("Username is required.")
      .min(2, "Username must contain at least 2 characters."),
    fullname: yup.string().required("Full Name is required."),
  });

  const onSignup = async (email, password, username, fullname) => {
    try {
      // Create a new user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save the user details in Firestore with an auto-generated document ID
      await addDoc(collection(firestore, "users"), {
        userId: user.uid,
        fullName: fullname,
        username: username,
        email: email,
        profilePicture: "",
        friends: [],
        occupation: "",
        bio: "Edit Bio",
        createdAt: new Date(),
      });

      Alert.alert("Success", "Account created successfully!");
      navigation.replace("LoginScreen");
    } catch (error) {
      console.error("Error during signup:", error.message);
      Alert.alert("Signup Failed", error.message);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Formik
        initialValues={{ fullname: "", username: "", email: "", password: "" }}
        onSubmit={(values) => {
          onSignup(values.email, values.password, values.username, values.fullname);
        }}
        validationSchema={SignupFormSchema}
      >
        {({ handleChange, handleBlur, handleSubmit, values, isValid }) => (
          <>
            <InputField
              placeholder="Full Name"
              keyboardType="default"
              textContentType="username"
              onChangeText={handleChange("fullname")}
              onBlur={handleBlur("fullname")}
              value={values.fullname}
              containerStyle={{ margin: 10, borderRadius: 6 }}
            />
            <InputField
              placeholder="Username"
              keyboardType="default"
              textContentType="username"
              onChangeText={handleChange("username")}
              onBlur={handleBlur("username")}
              value={values.username}
              containerStyle={{ margin: 10, borderRadius: 6 }}
            />
            <InputField
              placeholder="Email"
              keyboardType="email-address"
              textContentType="emailAddress"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              containerStyle={{ margin: 10, borderRadius: 6 }}
            />
            <InputField
              placeholder="Password"
              keyboardType="default"
              textContentType="password"
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              containerStyle={{ margin: 10, borderRadius: 6 }}
            />
            <View style={{ margin: 10, marginBottom: 0 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: GlobalStyles.colors.blue,
                  paddingVertical: 12,
                  borderRadius: 6,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={handleSubmit}
                disabled={!isValid}
              >
                <Text style={{ color: "white", fontSize: 18 }}>Sign Up</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.signupContainer}>
              <Text style={{ color: GlobalStyles.colors.gray }}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
                <Text style={{ color: "#6BB0F5" }}> Log in</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Formik>
    </View>
  );
};

export default SignupForm;

const styles = StyleSheet.create({
  wrapper: {},
  signupContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
  },
});
