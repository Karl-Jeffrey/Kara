import React from 'react';
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
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons

const ActivitySearchScreen = () => {
  const navigation = useNavigation();
  const [search, setSearch] = React.useState('');
  const [paddingTop, setPaddingTop] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);

  const activities = [
    {
      id: '1',
      name: 'Yoga Class',
      image: require('../assets/yoga.png'), // Adjust the path to your assets if needed
      description: 'A relaxing yoga session for all skill levels.'
    },
    {
      id: '2',
      name: 'Mountain Hiking',
      image: require('../assets/hiking.png'), // Use a default profile picture if not available
      description: 'Explore the scenic mountains with a guided hike.'
    },
    {
      id: '3',
      name: 'Cooking Workshop',
      image: require('../assets/cooking.png'), // Use a default profile picture if not available
      description: 'Join a workshop to learn how to cook gourmet dishes.'
    }
  ];

  const onRefresh = () => {
    setRefreshing(true);
    // Add logic to refresh the list data here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000); // Simulate data fetching delay
  };

  const renderActivityCard = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0} // Adds space above the search bar
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
        data={activities}
        renderItem={renderActivityCard}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingTop: 60, gap: 20 }} // Adjust paddingTop as needed
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
    padding: 20
  },
  inputField: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GlobalStyles.colors.primary500,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: GlobalStyles.colors.primary500,
    padding: 10,
    flex: 1 // Ensures the text input takes up all available space
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Centers the search bar horizontally
    backgroundColor: GlobalStyles.colors.primary500,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: GlobalStyles.colors.primary500,
    paddingHorizontal: 20, // Adds horizontal padding to the search bar
    marginTop: 0, // Centers the search bar at the top
    marginBottom: 20,
    marginHorizontal: 30
  },
  activityList: {
    flexGrow: 1,
    gap: 20
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
    elevation: 5
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  name: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10
  },
  description: {
    color: GlobalStyles.colors.gray,
    padding: 10
  },
  filterButton: {
    backgroundColor: GlobalStyles.colors.blue,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center'
  },
  filterButtonText: {
    color: 'white',
    fontSize: 16
  }
});
