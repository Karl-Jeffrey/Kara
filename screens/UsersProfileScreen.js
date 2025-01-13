import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet } from "react-native";
import ProfileHead from "../components/userProfileScreen/ProfileHead";
import ProfileBody from "../components/userProfileScreen/ProfileBody";

import { AuthContext } from "../store/auth-context";
import { GlobalStyles } from "../constants/Styles";
import Header from "../components/userProfileScreen/Header";
import HeaderSvg from "../components/userProfileScreen/HeaderSVG";

const UserProfileScreen = ({ navigation, route }) => {
  const { userData } = useContext(AuthContext); // Get user data from AuthContext
  const [headerHeight, setHeaderHeight] = useState(150);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <View style={styles.container}>
      <HeaderSvg headerHeight={headerHeight} />
      <View
        onLayout={(e) => {
          const height = e.nativeEvent.layout.height;
          setHeaderHeight(height / 2);
        }}
      >
        <Header viewMode={route?.params?.ViewUser} />
        {/* Pass userId and userData */}
        <ProfileHead
          userId={userData?.userId}
          viewMode={route?.params?.ViewUser}
        />
      </View>
      {/* Pass userId to ProfileBody */}
      <ProfileBody userId={userData?.userId} refreshing={false} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary,
  },
});

export default UserProfileScreen;
