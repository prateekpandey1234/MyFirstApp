import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TopAppBarProps {
  title: string;
}
// a custom top bar , the thing is react doesn't have you know so many predefined components 
// that's why most of the ui stuff is custom made
export const TopAppBar = ({ title }: TopAppBarProps) => {
  // This hook magically knows the height of the status bar on any device
  const insets = useSafeAreaInsets(); 

  return (
    <View 
      style={[
        styles.headerContainer, 
        // We inject the inset here so the background color extends behind the status bar
        { paddingTop: insets.top } 
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.titleText}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#6200EE', // Material Design Purple
    elevation: 4,               // Gives it that nice Android drop shadow
    
    // Optional iOS shadow equivalents
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  content: {
    height: 56, // Standard Android AppBar height
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  }
});