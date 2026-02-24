// This acts exactly like your ViewModel
import { useState, useEffect, useRef, useCallback } from 'react';
import { apiClient } from './apiClient';
import { Article } from './data';
import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV();// mmkv is used for local storage / cache for key-value pair
// like shared preference in android 
const CACHE_KEY = 'cached_news_articles';
// In JavaScript, functions are objects, and a new function instance with a new reference is created every time a component re-renders.
export function useJobsViewMode() {
  // a custom hook is a react component where logic handling occurs 
  // javascript also some default hook like useState which store the variable as an state holder 
  // every custom hook has to start with 'use' to tell react that this a custom hook and holds state within it 

  const [data, setData] = useState<Article[]>([]);// initialses the data with empty list first 
  // data -> getter function for data 
  // setData -> setter function for data 
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  // in javascript you dont have to mention data type or care about null safety 

  // use 'useRef' , to avoid multiple api calls 
  // What useRef does: It gives you a little box to hold data. The data inside this box survives all screen updates, but changing the data is completely silent—it will never trigger a screen redraw. You access or change the data by calling .current
  const abortControl = useRef<AbortController | null>(null);// AbortController is used in react to signal any API calls to cancel them 
  // to have control over asynchronous process 
  const isFetchRef = useRef<boolean>(false);
  // loading cached data from local storage 
  const loadCache = useCallback(() => {
    const cachedData = storage.getString(CACHE_KEY);
    if (cachedData) {
      setData(JSON.parse(cachedData));
    }
  }, []);

  //Every time a state variable changes (like your data or loading), your entire component function runs again from top to bottom.
  //Because your component runs from top to bottom on every screen update, any functions you write inside it (like renderItem or loadMore) are destroyed and created brand new every single time.
  // useCallback is kind of same as remember from compose , asks react not to recreate this function in memory 
  const fetchJobs = useCallback(async () => {// async function to load data
    if (isFetchRef.current) {
      return; //same instance is being loading on , so return back 
    }
    if (abortControl.current) {
      abortControl.current.abort();
    }
    abortControl.current = new AbortController();
    isFetchRef.current = true;
    setLoading(true);
    setError(null);

    try {
      // Axios is better than fetch - handles JSON automatically, adds interceptors, etc.

      const response = await apiClient.get(`/search`, {// this function already runs in a non-blocking way already , no need here 
        // javascript is single thread system , doesn't have multi thread like native software .

        params: { q: 'soccer', in: "description", lang: "en", max: 20, country: "uk", sortBy: 'publishedAt', page: page, apikey: 'ac64e82d75925c494e960328cfd7e372' }, // these are query parameters , like @Query in android 
        //headers:{'Authorization':''} , for headers in api request
      });
      if (page == 1) {
        storage.set(CACHE_KEY, JSON.stringify(response.data.articles));
      }
      const newArticles: Article[] = response.data.articles || [];

      console.log('Fetched Articles:', newArticles.length);
      setData(prev => {
        // Collect URLs that are already in the list
        const prevUrls = new Set(prev.map(item => item.url));

        // Only keep new articles whose URL is NOT already in our Set
        const uniqueNewArticles = newArticles.filter(item => {
          if (!item.url) return true; // If somehow it has no URL, don't filter it out
          return !prevUrls.has(item.url);
        });

        console.log(`Appending ${uniqueNewArticles.length} unique new articles`);
        return [...prev, ...uniqueNewArticles];
      });
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Fetch error:', err);
        setError(err.message || 'Failed to load jobs');
        setPage(prev => Math.max(1, prev - 1)); // Rollback page
      }
    } finally {
      setLoading(false);
      isFetchRef.current = false;
    }
  }, [page]);

  const loadMore = useCallback(() => {
    if (!loading && !error) {
      setPage(prev => prev + 1);
    }
  }, [loading, error]);

  // React to page changes
  // useEffect is side effects which reacts to state changes from the dependency array we provided here 
  // here the useEffect reacts to change in page variable state 
  useEffect(() => {

    if (page == 1) {
      loadCache();
    }
    fetchJobs();

    // Cleanup
    return () => {
      if (abortControl.current) {
        abortControl.current.abort();
      }
    };
  }, [fetchJobs]);

  // Expose only what the UI needs (like public val in ViewModel)
  return { data, loading, loadMore };
};

// A stale closure is type of bug in js whenver we define our function and the function has some variables in it and they can cause 
// issue when working with state variables inside a js function ...