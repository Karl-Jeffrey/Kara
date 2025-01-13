import { View, Text, StyleSheet, Alert } from "react-native";
import React, { useContext } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Formik } from "formik";
import * as yup from "yup";
import Validator from "email-validator";
import { auth, firestore } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import InputField from "../InputField";
import { GlobalStyles } from "../../constants/Styles";
import { AuthContext } from "../../store/auth-context";

const LoginForm = ({ navigation }) => {
  const authCtx = useContext(AuthContext);

  const LoginFormSchema = yup.object().shape({
    email: yup.string().email().required("Email address is required."),
    password: yup.string().min(8, "Password must have at least 8 characters."),
  });

  async function onLogin(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid; // Get the user's UID
      console.log("Logged in with User ID:", userId);

      // Fetch additional user data from Firestore
      const userDocRef = doc(firestore, "users", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data(); // Get user data from Firestore
        console.log("Fetched user data:", userData);

        // Store user data in AuthContext
        authCtx.authenticate({ ...userData, userId });
      } else {
        console.error(`User document with ID ${userId} does not exist in Firestore.`);
        Alert.alert("Error", "User profile not found. Please contact support.");
      }
    } catch (error) {
      console.error("Login error:", error.message);

      // Provide more specific error messages for known issues
      if (error.code === "auth/user-not-found") {
        Alert.alert("Error", "No user found with this email.");
      } else if (error.code === "auth/wrong-password") {
        Alert.alert("Error", "Incorrect password. Please try again.");
      } else {
        Alert.alert("Error", "An error occurred during login. Please try again.");
      }
    }
  }

  return (
    <View style={styles.wrapper}>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={(values) => {
          onLogin(values.email, values.password);
        }}
        validationSchema={LoginFormSchema}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          isValid,
        }) => (
          <>
            <InputField
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              placeholder="Email"
              keyboardType="email-address"
              textContentType="emailAddress"
              inValid={
                values.email.length < 1 || Validator.validate(values.email)
              }
              containerStyle={{ margin: 10, borderRadius: 6 }}
            />
            <InputField
              textContentType="password"
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              placeholder="Password"
              keyboardType="default"
              inValid={
                values.password.length === 0 || values.password.length > 7
              }
              containerStyle={{ margin: 10, borderRadius: 6 }}
            />
            <TouchableOpacity>
              <Text
                style={{
                  color: GlobalStyles.colors.blue100,
                  fontSize: 18,
                  textAlign: "center",
                  marginVertical: 15,
                }}
              >
                FORGOT PASSWORD?
              </Text>
            </TouchableOpacity>

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
                <Text style={{ color: "white", fontSize: 18 }}>Log in</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.signupContainer}>
              <Text style={{ color: GlobalStyles.colors.gray }}>
                Don't have an account?
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("SignupScreen")}
              >
                <Text style={{ color: "#6BB0F5" }}> Sign up</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Formik>
    </View>
  );
};

export default LoginForm;

const styles = StyleSheet.create({
  wrapper: {},
  inputField: {
    borderRadius: 4,
    borderColor: "gray",
    padding: 8,
    backgroundColor: "FAFAFA",
    marginBottom: 10,
    borderWidth: 1,
  },
  signupContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    marginTop: 10,
  },
});
