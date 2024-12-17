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
import { GlobalStyles, DEFAULT_DP } from '../constants/Styles';

const ActivitySearchScreen = () => {
  const navigation = useNavigation();
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
      <TextInput
        style={styles.searchBar}
        placeholder="Search activities..."
        placeholderTextColor={GlobalStyles.colors.gray}
      />
      <Text style={styles.suggestionsTitle}>Suggestions</Text>
      <FlatList
        data={activities}
        renderItem={renderActivityCard}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        contentContainerStyle={styles.activityList}
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
    padding: 10
  },
  searchBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker background for better contrast
    color: 'white',
    padding: 15, // Increased padding to make it taller
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 20 // Increased font size for better readability
  },
  suggestionsTitle: {
    color: GlobalStyles.colors.purple,
    fontSize: 24,
    fontWeight: 'light',
    marginBottom: 10,
    paddingLeft: 10,
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
