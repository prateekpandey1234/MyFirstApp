# Project Developer Notes

This document contains all the extracted developer comments perfectly categorized by domain. These notes act as a quick reference guide comparing React Native/JavaScript concepts to Android (Jetpack Compose, ViewModels, Room, SharedPreferences, etc.).

##  React Custom Hooks & State 
* **Custom Hooks / ViewModels**: A custom hook acts exactly like an Android `ViewModel`. It's a React component where logic handling occurs. Every custom hook has to start with `use` to tell React that it holds state within it.
* **State vs Variables**: JavaScript has default hooks like `useState` which store variables as state holders:
  * `[data, setData] = useState([])`: `data` is the getter, `setData` is the setter.
  * In JavaScript, you don't have to mention data types or care about null safety.
* **Re-renders**: Every time a state variable changes (like data or loading), your entire component function runs again from top to bottom. Because of this, any functions you write inside it (like `renderItem` or `loadMore`) are destroyed and created brand new every single time. 
* **useCallback**: This is similar to `remember` from Jetpack Compose—it asks React not to recreate the function in memory.
* **useEffect**: Handles side-effects that react to state changes from the dependency array provided (e.g., reacting to a change in the `page` variable).
* **useRef**: Provides a little box to hold data. The data inside this box survives all screen updates, but changing the data is completely silent—it will never trigger a screen redraw. You access or change the data by calling `.current`. This is great to avoid multiple API calls.
* **AbortController**: Used to signal API calls to cancel them, giving you control over asynchronous processes.
* **Stale Closure**: A type of bug in JS whenever a function has variables in it that cause issues when working with state variables inside a JS function.
* **MMKV**: Used for local storage/cache for key-value pairs (like `SharedPreferences` in Android).
* **Encapsulation**: Expose only what the UI needs (like a `public val` in a ViewModel) by returning them at the end of the hook.

##  DB / SQLite & Async 
* **Arrow Functions & Helpers**: We use a helper function to grab the DB connection asynchronously. The `=>` operator creates a function (similar to a ternary operation context).
* **Promises**: A JavaScript Promise is an object representing the eventual completion or failure of an asynchronous operation, and its resulting value.
* **prepareAsync**: Used to make the query in binary format (native C++ format) to execute the query faster. This also makes the query hidden from the JS garbage collector.
* **executeAsync**: Used to actually execute the compiled query.
* **Cleanup**: Always run `finalizeAsync()` in a `finally` block to cleanup the compiled query memory.

##  UI / React Native Components 
* **FlashList vs FlatList**: `FlashList` is the equivalent of `RecyclerView` in Android. Using a standard `FlatList` is not good for fast rendering.
* **JSX vs Compose**: The `<` symbol triggers the compiler to make a JSX or UI component. Writing standard `for` loops or `if-else` blocks inside JSX won't work like they do in Compose. Logic checking must be done using the ternary operator format: `{condition ? trueView : falseView}`.
* **Memoization in Lists**: In the `renderItem` function, if you don't tell React to memorize the component separately, it renders the whole array on updates.
* **Flexbox Styling**:
  * `flex: 1`: Acts like `match_parent` in XML. Tells the View to stretch and fill all available screen space.
  * `justifyContent: "center"`: Centers the child vertically (Y-axis).
  * `alignItems: "center"`: Centers the child horizontally (X-axis).
* **Expo Commands**: Press `ctrl + c` to cancel the ongoing expo server. Run `npx expo start -c` for a fresh build without cache. Save the file after making changes to see fast refresh.

##  Data Models / TypeScript Interfaces 
* **Exporting**: `export` is the equivalent of making it `public`.
* **Classes vs Interfaces**: 
  * Using `interface` instead of `class` saves cost and memory since JS is dynamically typed. Compiling classes actually packages the class data into the final bundle.
  * Use an `interface` (or `type`) when you just need to describe the "shape" of data coming from the internet or passing between screens.
  * Use a `class` only when you need to attach actual behavior or functions to that object (e.g., `class User { calculateAge() { ... } }`). Since JSON from an API doesn't have functions, it should always be an interface.
* **Nullability**: Appending `| null` (e.g., `string | null`) marks the property as nullable.

##  API / Networking 
* **Axios**: Axios is the "Retrofit" of React Native. It is better than fetch because it handles JSON automatically and adds interceptors.
* **Threading**: JavaScript is a single-threaded system; it lacks multi-threading like native software (e.g., Kotlin Coroutines on a background thread). Functions like API calls run in a non-blocking way automatically, so you don't need to manually push them to a background thread.
* **Query Parameters**: In Axios, you can send `params` which acts the same way as `@Query` in Android Retrofit.
