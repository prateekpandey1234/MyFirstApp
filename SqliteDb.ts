import * as SQLite from 'expo-sqlite';
import { Article } from './data';

// We use a helper function to grab the DB connection asynchronously
const getDB = async () => await SQLite.openDatabaseAsync('newsApp.db');


export const initDB = async () => {
    const db = await getDB();
    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS articles (
      url TEXT PRIMARY KEY,
      title TEXT,
      url TEXT,
      image TEXT,
      publishedAt TEXT
    );
  `);
    console.log("SQLite Database Initialized Asynchronously!");
};

// to the below code is already a function like a ternanry operation when 
// we use the => here it creates a function 

// you can also make it a function which returns boolean
// export function saveArticlesToDB(articles: Article[]) {
//     
// }

export const saveArticlesToDB = async (articles: Article[]): Promise<boolean> => {
    const db = await getDB();
    // prepare Async here , is used to make the query in binary format in native c++ format
    // to execute the query faster 
    // prepareAsync is same as simple query but all we do is replace the variables and make the query go bit faster instead of running string query itself 
    const query = await db.prepareAsync(
        'INSERT OR REPLACE INTO articles (url, title,image, publishedAt) VALUES ($url, $title,$image, $publishedAt)'
    );
    // this makes the query to be not detcted by JS garbage collector 

    try {
        for (const article of articles) {
            // executeAsync is used to execute the query
            await query.executeAsync({
                $url: article.url,
                $title: article.title,
                $image: article.image || '',
                $publishedAt: article.publishedAt,
            });
        }
        console.log(` Saved ${articles.length} articles to SQLite DB in the background!`);
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
    finally {
        // have to run this to cleanup the compiled query 
        await query.finalizeAsync();
    }
};

//A JavaScript Promise is an object representing the eventual completion or failure of an asynchronous operation, and its resulting value
export const loadArticlesFromDB = async (): Promise<Article[]> => {
    const db = await getDB();
    const result = await db.getAllAsync<Article>(
        `SELECT * FROM articles ORDER BY publishedAt DESC LIMIT 50`
    );
    console.log(` Loaded ${result.length} articles from SQLite`);
    return result;
};