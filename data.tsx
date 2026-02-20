

// export is kind of same as making it public , 
  //using interface instead of class saves the cost of and memory of javascript classes as they are dynamically typed and it compiles and saves 
  // the class data itself 

//Use an interface (or type) when you just need to describe the "shape" of data coming from the internet or passing between screens.

//Use a class only when you need to attach actual behavior or functions to that object (e.g., class User { calculateAge() 
// { ... } }). Since JSON from an API doesn't have functions, it should always be an interface.

// string|null this means this can nullable 

export interface Root {
  totalArticles: number
  articles: Article[]
}

export interface Article {
  id: string
  title: string
  description: string
  content: string
  url: string
  image: string
  publishedAt: string
  lang: string
  source: Source
}

export interface Source {
  id: string
  name: string
  url: string
  country: string
}
