import React from 'react';
import { ActivityIndicator,StyleSheet, Text, View , FlatList} from 'react-native';
import { useJobsViewModel } from './cutomHooks';

export default function App() {
  const{data , loading , loadMore} = useJobsViewModel()
  if (loading && data.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    
    <FlatList
      data={data}
      renderItem={
        ({item}) =>
          <Text style = {styles.title}>{item.title}</Text>
          
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Like match_parent
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

// ctrl + c to cancel you ongoing expo
// for fresh build npx expo start -c
// save the file after making changes 