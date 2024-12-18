import React, { useState } from "react";
import { Text, View, StyleSheet, Image, Pressable, Modal, TouchableOpacity } from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { GlobalStyles, DEFAULT_DP } from "../../../constants/Styles";
import PressEffect from "../../UI/PressEffect";
import { useNavigation } from "@react-navigation/native"; // Import navigation
const Header = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [addMenuVisible, setAddMenuVisible] = useState(false);

  const toggleMenu = () => setMenuVisible(!menuVisible);
  const toggleAddMenu = () => setAddMenuVisible(!addMenuVisible);

  return (
    <View style={[styles.container]}>
      <Pressable onPress={toggleAddMenu} style={{ position: "absolute", left: 0 }}>
        <PressEffect>
          <Image
            style={{ width: 30, height: 30, borderRadius: 50 }}
            source={{ uri: "https://p16.tiktokcdn.com/tos-maliva-avt-0068/2f134ee6b5d3a1340aeb0337beb48f2d~c5_720x720.jpeg" }}
          />
        </PressEffect>
      </Pressable>

      <View style={{ alignItems: "center" }}>
        <Text style={{ color: "white", fontSize: 30, fontWeight: "bold" }}>Kara</Text>
      </View>

      <View style={styles.iconsContainer}>
        <PressEffect>
          <Pressable
            style={styles.icon}
            onPress={() => {
              navigation.navigate("SearchScreen");
            }}
          >
            <MaterialIcons name="person-add" size={25} color={"white"} />
          </Pressable>
        </PressEffect>
        <PressEffect>
          <Pressable
            style={styles.icon}
            onPress={() => {
              navigation.navigate("NotificationsScreen");
            }}
          >
            <MaterialIcons name="notifications" size={25} color={"white"} />
            <View style={styles.unreadBadge} />
          </Pressable>
        </PressEffect>
        <PressEffect>
          <Pressable style={styles.icon} onPress={toggleMenu}>
            <MaterialIcons name="account-circle" size={25} color={"white"} />
          </Pressable>
        </PressEffect>
      </View>

      {/* Dropdown Menu for Add Options */}
      <Modal transparent={true} visible={addMenuVisible} animationType="fade">
        <TouchableOpacity style={styles.overlay} onPress={toggleAddMenu}>
          <View style={styles.dropdownMenu}>
            <TouchableOpacity style={styles.menuItem} onPress={() => console.log("Add Activity")}>
              <Ionicons name="add-circle-outline" size={24} color={GlobalStyles.colors.purple} />
              <Text style={styles.menuText}>Add Activity</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => console.log("Add Post")}>
              <Ionicons name="add-circle-outline" size={24} color={GlobalStyles.colors.purple} />
              <Text style={styles.menuText}>Add Post</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => console.log("Add Story")}>
              <Ionicons name="add-circle-outline" size={24} color={GlobalStyles.colors.purple} />
              <Text style={styles.menuText}>Add Story</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Dropdown Menu for Account Options */}
      <Modal transparent={true} visible={menuVisible} animationType="fade">
        <TouchableOpacity style={styles.overlay} onPress={toggleMenu}>
          <View style={styles.dropdownMenu}>
            <TouchableOpacity style={styles.menuItem} onPress={() => console.log("My profile")}>
              <MaterialIcons name="account-circle" size={24} color={GlobalStyles.colors.primary} />
              <Text style={styles.menuText}>My profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => console.log("Edit profile")}>
              <MaterialIcons name="edit" size={24} color={GlobalStyles.colors.primary} />
              <Text style={styles.menuText}>Edit profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => console.log("Inbox")}>
              <MaterialIcons name="inbox" size={24} color={GlobalStyles.colors.primary} />
              <Text style={styles.menuText}>Inbox</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => console.log("Settings")}>
              <MaterialIcons name="settings" size={24} color={GlobalStyles.colors.primary} />
              <Text style={styles.menuText}>Setting</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => console.log("Help")}>
              <MaterialIcons name="help" size={24} color={GlobalStyles.colors.primary} />
              <Text style={styles.menuText}>Help</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => console.log("Logout")}>
              <MaterialIcons name="logout" size={24} color={GlobalStyles.colors.primary} />
              <Text style={styles.menuText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 5,
    marginHorizontal: 20,
  },
  iconsContainer: {
    position: "absolute",
    right: 0,
    flexDirection: "row",
  },
  icon: {
    marginLeft: 10,
  },
  unreadBadge: {
    backgroundColor: GlobalStyles.colors.red,
    position: "absolute",
    right: 2,
    top: 2,
    width: 8,
    height: 8,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  dropdownMenu: {
    backgroundColor: GlobalStyles.colors.primary600,
    width: 200,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: 10,
    alignItems: "center",
  },
  menuItem: {
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  menuText: {
    color: GlobalStyles.colors.purple,
    fontSize: 16,
  },
});