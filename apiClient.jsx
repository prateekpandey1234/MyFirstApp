import axios from 'axios'; // The "Retrofit" of React Native



export const apiClient = axios.create({
    baseURL: 'https://gnews.io/api/v4',
    timeout: 10000, // 10 seconds timeout
  })

    // 2. Add the Request Logger
  apiClient.interceptors.request.use(
    (config) => {
      console.log(`\n [API REQUEST] ${config.method?.toUpperCase()} ${config.url}`);
      
      // Log headers or params if you want
      if (config.params) console.log('Params:', JSON.stringify(config.params, null, 2));
      
      return config;
    },
    (error) => {
      console.error(' [API REQUEST ERROR]', error);
      return Promise.reject(error);
    }
  );

  // 3. Add the Response Logger
  apiClient.interceptors.response.use(
    (response) => {
      console.log(` [API RESPONSE] Status: ${response.status}`);
      
      // Optional: Log the actual data (can be huge, so be careful!)
      // console.log('Data:', JSON.stringify(response.data, null, 2));
      
      return response;
    },
    (error) => {
      console.error(` [API RESPONSE ERROR] Status: ${error.response?.status}`);
      console.error('Message:', error.message);
      return Promise.reject(error);
    }
  );