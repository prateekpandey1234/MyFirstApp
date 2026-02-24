import {Article} from './data'
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import React , {memo} from 'react';


const fallbackImage = require('./assets/placeholder.png')
const loadingBlurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
// 

const comparator = (prevProps, nextProps) => {
  return prevProps.article.url === nextProps.article.url;
};

function Articlecard({article}){
    return (
        <View style={styles.card}>
        <Image
            style = {styles.image}
            source = {article.image ? article.image : fallbackImage}
            placeholder = {loadingBlurhash}
            contentFit = "cover"
            transition = {300}
            cachePolicy="memory-disk"
            />
            <Text style={styles.title}>{article.title}</Text>
        </View>
    )
}

export const MemoResizedArticle = memo(Articlecard,comparator);


const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden', // Keeps the image inside the rounded corners
    elevation: 3,       // Android drop shadow
  },
  image: {
    width: '100%',
    height: 200,        // Always give remote images a fixed height!
    backgroundColor: '#E0E0E0', // A nice light grey background just in case
  },
  title: {
    padding: 16,
    fontSize: 18,
    fontWeight: 'bold',
  }
});