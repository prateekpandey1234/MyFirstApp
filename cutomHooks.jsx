// This acts exactly like your ViewModel
import { useState, useEffect } from 'react';
import { apiClient } from './apiClient';

export const useJobsViewModel = () => {
    // a custom hook is a react component where logic handling occurs 
    // javascript also some default hook like useState which store the variable as an state holder 
    // every custom hook has to start with 'use' to tell react that this a custom hook and holds state within it 

  const [data, setData] = useState([]);// initialses the data with empty list first 
  // data -> getter function for data 
  // setData -> setter function for data 
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  // in javascript you dont have to mention data type or care about null safety 

  

  const fetchJobs = async () => {// async function to load data
    if (loading) return; // if already laoding we wait 
    setLoading(true); 
    try {

      
      // Axios is better than fetch - handles JSON automatically, adds interceptors, etc.
      
  const response = await apiClient.get(`/search`, {
        params: { q:'soccer', in:"description",lang:"en",country:"uk",sortBy:'publishedAt',page: page,apikey:'ac64e82d75925c494e960328cfd7e372' }, // these are query parameters , like @Query in android 
        //headers:{'Authorization':''} , for headers in api request
      });

      
      
      // Append logic
      setData(prev => [...prev, ...response.data.articles]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  // React to page changes
  // useEffect is side effects which reacts to state changes from the dependency array we provided here 
  // here the useEffect reacts to change in page variable state 
  useEffect(() => {
    fetchJobs();
    console.log(page+" page changed ")
  }, [page]);

  // Expose only what the UI needs (like public val in ViewModel)
  return { data, loading, loadMore };
};