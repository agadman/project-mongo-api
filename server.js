import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
import booksData from "./data/books.json";
import { getModulesPluginNames } from "@babel/preset-env";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const Book = mongoose.model('Book', {
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  isbn: Number,
  isbn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number
})

if (process.env.RESET_DB) {
  const resetDatabase = async () => {
    await Book.deleteMany({});
    booksData.forEach(item => {
      const newBook = new Book(item)
      newBook.save()
    })
  }
  resetDatabase()
}

// Start defining your routes here
app.get("/", (req, res) => {
res.send("This is an api for books.");
});

app.get('/books', async (req, res) => {
  const Books = await Book.find({});
  res.status(200).json ({
    succes: true,
    body: Books
  })
})

app.get('/books/id/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    if (book) {
      res.status(200).json ({
        success: true,
        body: book
      });
    } else {
      res.status(404).json ({
        success: false,
        body: {
          message: "No book with that ID was found"
        }
      });
    }
  } catch (error) {
    res.status(400).json ({
      success: false,
      body: {
        message: "Invalid Id"
      }
    });
  }
});

app.get('/books/title/:title', (req, res) => {
  Book.findOne({ title: req.params.title }).then(book => {
    if (book) {
      res.json(book)
    } else {
      res.status(404).json({ error: 'There is no book with that title.' })
    }
  })
 })

app.get('/books/authors/:authors', async (req, res) => {
  const book = await Book.findOne({ authors: req.params.authors })
  if (book) { 
    res.json(book)
  } else {
    res.status(404).json({ error: 'No book by that author was found' })
  }
 })

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});