import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GlobalStyles } from "../constants/Styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { firestore } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const categories = [
  {
    title: "Types of Activities",
    icon: "run-fast",
    options: [
      "Move & Groove: Sport, outdoor, dance, yoga, team sports",
      "Art & Vibes: Exhibits, concerts, museums, shows, street art",
      "Foodie Heaven: Local food, restaurants, tastings, food trucks",
      "Let’s Hang: Festivals, markets, chill events",
      "Fam Jam: Kid-friendly, family workshops, fun activities",
      "Zen Zone: Meditation, spa, self-care, relaxation fitness",
      "Night Owls: Bars, clubs, cinemas, karaoke, after dark",
    ],
  },
  {
    title: "Budget",
    icon: "currency-usd",
    options: [
      "Ça coûte rien: Free activities",
      "Petite dépense: $0 - $20",
      "Balance ton budget: $20 - $50",
      "Treat Yourself: $50+",
    ],
  },
  {
    title: "Crew Size",
    icon: "account-group",
    options: [
      "Solo Flow: For one person",
      "Duo Goals: Couples or pairs",
      "Squad Time: Small group (3-6 people)",
      "Big Crew Vibes: Large group (7+ people)",
    ],
  },
  {
    title: "Spot (Location)",
    icon: "map-marker-radius",
    options: [
      "Near Me: Nearby activities",
      "Hood Explorer: Specific neighborhoods",
      "Next Stop: Neighboring regions or further",
    ],
  },
  {
    title: "Duration",
    icon: "clock-outline",
    options: [
      "Quickie: Less than 1 hour",
      "Take Your Time: 1 to 3 hours",
      "Half-Day Hustle: Half-day",
      "Full Send: Full day",
    ],
  },
  {
    title: "Hype Level (Popularity)",
    icon: "fire",
    options: [
      "Trending Now: Most popular activities",
      "Top Rated: Community's favorite activities",
    ],
  },
];

const FilterScreen = () => {
  const [selectedFilters, setSelectedFilters] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [filteredResults, setFilteredResults] = useState([]);
  const navigation = useNavigation();

  const handleTilePress = (category) => {
    setCurrentCategory(category);
    setModalVisible(true);
  };

  const handleFilterPress = (categoryTitle, option) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [categoryTitle]: prev[categoryTitle] === option ? null : option,
    }));
  };

  const handleApplyFilters = async () => {
    try {
      const filters = Object.entries(selectedFilters).filter(
        ([_, value]) => value !== null
      );

      if (filters.length === 0) {
        Alert.alert("No Filters Selected", "Please select at least one filter.");
        return;
      }

      const baseQuery = collection(firestore, "activities");
      const filterQueries = filters.map(([key, value]) =>
        where(key, "==", value)
      );

      const finalQuery = query(baseQuery, ...filterQueries);

      const querySnapshot = await getDocs(finalQuery);
      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setFilteredResults(results);

      if (results.length === 0) {
        Alert.alert("No Results", "No activities matched your filters.");
      } else {
        Alert.alert("Success", `${results.length} activities found.`);
      }
    } catch (error) {
      console.error("Error fetching filtered results:", error.message);
      Alert.alert("Error", "Failed to fetch filtered activities.");
    }
  };

  const renderCategoryTile = (category) => (
    <Pressable
      key={category.title}
      style={styles.categoryTile}
      onPress={() => handleTilePress(category)}
    >
      <Icon
        name={category.icon}
        size={32}
        color={GlobalStyles.colors.purple}
        style={styles.iconStyle}
      />
      <Text style={styles.categoryTileText}>{category.title}</Text>
      {selectedFilters[category.title] && (
        <Text style={styles.selectedOptionText}>
          {selectedFilters[category.title]}
        </Text>
      )}
    </Pressable>
  );

  const renderFilterOptions = () => (
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>{currentCategory.title}</Text>
      {currentCategory.options.map((option, index) => (
        <Pressable
          key={index}
          style={[
            styles.filterOption,
            selectedFilters[currentCategory.title] === option &&
              styles.selectedOption,
          ]}
          onPress={() => handleFilterPress(currentCategory.title, option)}
        >
          <Text style={styles.filterOptionText}>{option}</Text>
        </Pressable>
      ))}
      <Pressable
        style={styles.closeModalButton}
        onPress={() => setModalVisible(false)}
      >
        <Text style={styles.closeModalText}>Close</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Filter Activities</Text>
        <View style={styles.tileContainer}>
          {categories.map(renderCategoryTile)}
        </View>
        <Pressable style={styles.applyButton} onPress={handleApplyFilters}>
          <Text style={styles.applyButtonText}>Apply Filters</Text>
        </Pressable>
        {filteredResults.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsHeader}>Filtered Results:</Text>
            {filteredResults.map((result) => (
              <View key={result.id} style={styles.resultItem}>
                <Text style={styles.resultText}>{result.title}</Text>
                <Text style={styles.resultText}>{result.description}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          {currentCategory && renderFilterOptions()}
        </View>
      </Modal>
    </View>
  );
};

export default FilterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  tileContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryTile: {
    backgroundColor: GlobalStyles.colors.primary500,
    width: "48%",
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  categoryTileText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginTop: 8,
  },
  selectedOptionText: {
    fontSize: 12,
    color: GlobalStyles.colors.purple,
    marginTop: 8,
    textAlign: "center",
  },
  iconStyle: {
    marginBottom: 8,
  },
  applyButton: {
    backgroundColor: GlobalStyles.colors.blue,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  applyButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  resultsContainer: {
    marginTop: 20,
  },
  resultsHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  resultItem: {
    padding: 10,
    backgroundColor: GlobalStyles.colors.primary200,
    borderRadius: 8,
    marginVertical: 5,
  },
  resultText: {
    color: "white",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: GlobalStyles.colors.primary200,
    padding: 20,
    borderRadius: 12,
    width: "90%",
  },
  modalTitle: {
    fontSize: 20,
    color: GlobalStyles.colors.purple,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  filterOption: {
    backgroundColor: GlobalStyles.colors.primary500,
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: GlobalStyles.colors.purple,
  },
  filterOptionText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  closeModalButton: {
    backgroundColor: GlobalStyles.colors.blue,
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  closeModalText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
