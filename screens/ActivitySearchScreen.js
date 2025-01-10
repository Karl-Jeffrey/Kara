import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  Image, 
  StyleSheet, 
  Pressable,
  RefreshControl,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GlobalStyles } from '../constants/Styles';
import { StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getFirestore, collection, getDocs } from 'firebase/firestore'; // Firebase Firestore imports
import { firebaseApp } from '../firebaseConfig'; // Your Firebase configuration file

const ActivitySearchScreen = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [activities, setActivities] = useState([]); // Store all activities
  const [filteredActivities, setFilteredActivities] = useState([]); // Store filtered activities
  const [refreshing, setRefreshing] = useState(false);

  const db = getFirestore(firebaseApp); // Initialize Firestore

  // Fetch activities from Firestore
  const fetchActivities = async () => {
    try {
      const activitiesCollection = collection(db, 'Activities'); // Reference the 'Activities' collection
      const activitiesSnapshot = await getDocs(activitiesCollection);
      const activitiesData = activitiesSnapshot.docs.map((doc) => doc.data());
      setActivities(activitiesData);
      setFilteredActivities(activitiesData); // Set initial filtered activities
    } catch (error) {
      console.error('Error fetching activities from Firestore:', error);
    }
  };

  // Refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    fetchActivities();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000); // Simulate data fetching delay
  };

  // Filter activities based on search input
  useEffect(() => {
    if (search.trim() === '') {
      setFilteredActivities(activities); // Show all activities if search is empty
    } else {
      setFilteredActivities(
        activities.filter((activity) =>
          activity.title.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, activities]);

  // Fetch activities on component mount
  useEffect(() => {
    fetchActivities();
  }, []);

  // Render activity card
  const renderActivityCard = ({ item }) => (
    <View style={styles.card}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>No Image</Text>
        </View>
      )}
      <Text style={styles.name}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
    >
      <View
        style={{
          position: 'absolute',
          zIndex: 10,
          top: 0,
          width: '100%',
          marginTop: StatusBar.currentHeight + 15,
        }}
      >
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={25}
            color={GlobalStyles.colors.purple}
          />
          <TextInput
            style={styles.inputField}
            placeholder="Search activities..."
            placeholderTextColor={GlobalStyles.colors.gray}
            onChangeText={setSearch}
            value={search}
          />
        </View>
      </View>

      <FlatList
        data={filteredActivities}
        renderItem={renderActivityCard}
        keyExtractor={(item) => item.activityId}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingTop: 60, gap: 20 }}
      />
      <Pressable
        style={styles.filterButton}
        onPress={() => navigation.navigate('FilterScreen')}
      >
        <Text style={styles.filterButtonText}>Filter</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

export default ActivitySearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary,
    padding: 20,
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GlobalStyles.colors.primary500,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: GlobalStyles.colors.primary500,
    padding: 10,
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GlobalStyles.colors.primary500,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: GlobalStyles.colors.primary500,
    paddingHorizontal: 20,
    marginBottom: 20,
    marginHorizontal: 30,
  },
  card: {
    backgroundColor: GlobalStyles.colors.primary200,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: GlobalStyles.colors.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 150,
  },
  imagePlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: GlobalStyles.colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: 'white',
    fontSize: 14,
  },
  name: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
  },
  description: {
    color: GlobalStyles.colors.gray,
    padding: 10,
  },
  filterButton: {
    backgroundColor: GlobalStyles.colors.blue,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  filterButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
