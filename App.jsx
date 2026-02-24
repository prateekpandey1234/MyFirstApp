import React, { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,

} from "react-native";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { useJobsViewMode } from "./cutomHooks";
import { TopAppBar } from "./TopAppBar";

import { MemoResizedArticle } from "./NewsComponent";
import { FlashList } from "@shopify/flash-list";

export default function App() {
  const { data, loading, loadMore } = useJobsViewMode();
  const renderNewsItem = useCallback(({ item }) => {
    return <MemoResizedArticle article={item} />;
  }, []);
  const keyExtractorFun = useCallback(
    (item, index) => item.url ? `${item.url}-${index}` : `article-${index}`,
    []
  );

  const ListFooterComponentMemo = useMemo(() => {
    if (loading && data.length > 0) {
      return <ActivityIndicator size="small" color="#0000ff" />;
    }
    return <Button title="Load More News" onPress={loadMore} />;
  }, [loading, data.length, loadMore]);
  // in react you have to write the if else , it will fail because the code below is
  // javascript which is way different from normal compose
  // the '<' triggers the compiler to make JSX component or UI component
  // that why normal for loops , if else wont work like we did in compose
  //
  return (
    <SafeAreaProvider>
      <TopAppBar title="Latest News" />

      {/*the logic checking works here as {condition ? trueView:falseView}*/}



      {loading && data.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <View style={styles.centered}>
          <FlashList // Flash List is same as recylerView in android , using flat list is not good for fast rendering .
            data={data}
            keyExtractor={keyExtractorFun}
            renderItem={renderNewsItem} // the compose function we have defined here renders whole the array if don't tell the react to  memorize the component separetely 

            ListFooterComponent={
              ListFooterComponentMemo
            }
           />
        </View>
      )}
    </SafeAreaProvider>
  );
}
// we create the style sheet itself

const styles = StyleSheet.create({
  container: {
    flex: 1, // Like match_parent
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  centered: {
    flex: 1, // 1. Tells the View to stretch and fill all available screen space
    justifyContent: "center", // 2. Centers the child vertically (Y-axis)
    alignItems: "center", // 3. Centers the child horizontally (X-axis)
  },
});

// ctrl + c to cancel you ongoing expo
// for fresh build npx expo start -c
// save the file after making changes
