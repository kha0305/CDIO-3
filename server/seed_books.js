require("dotenv").config();
const Book = require("./models/Book");
const sequelize = require("./models");

const API_KEY = "5b8032cc6d8b4007b27768a25a0d4ec9";
const BASE_URL = "https://api.bigbookapi.com";

// Categories to fetch
const CATEGORIES = [
  { query: "romance novels", category: "Romance", count: 30 },
  { query: "science fiction", category: "Science Fiction", count: 30 },
  { query: "fantasy epic", category: "Fantasy", count: 30 },
  { query: "mystery thriller", category: "Mystery", count: 30 },
  { query: "horror scary", category: "Horror", count: 25 },
  { query: "biography famous people", category: "Biography", count: 25 },
  { query: "history world war", category: "History", count: 25 },
  { query: "self help motivation", category: "Self-Help", count: 25 },
  { query: "cooking recipes", category: "Cooking", count: 20 },
  { query: "business entrepreneurship", category: "Business", count: 20 },
  { query: "children books kids", category: "Children", count: 20 },
  { query: "classic literature", category: "Classics", count: 20 },
];

// Delay function to respect rate limits (60 requests/min = 1 per second)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchBooks(query, number = 25) {
  try {
    const url = `${BASE_URL}/search-books?api-key=${API_KEY}&query=${encodeURIComponent(
      query
    )}&number=${number}`;
    console.log(`Fetching: ${query}...`);

    const response = await fetch(url);
    if (!response.ok) {
      console.error(`API Error: ${response.status} for query: ${query}`);
      return [];
    }

    const data = await response.json();
    if (data && data.books) {
      return data.books.flat();
    }
    return [];
  } catch (error) {
    console.error(`Error fetching ${query}:`, error.message);
    return [];
  }
}

async function fetchBookDetails(bookId) {
  try {
    const response = await fetch(`${BASE_URL}/${bookId}?api-key=${API_KEY}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
}

async function seedBooks() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log("Database connected.");

    // Clear related tables first (to avoid foreign key constraint)
    console.log("Clearing related records...");
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await sequelize.query("DELETE FROM Reservations");
    await sequelize.query("DELETE FROM Transactions");
    await sequelize.query("DELETE FROM Books");
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log("All books and related records deleted.");

    let totalImported = 0;
    const allBooks = [];

    // Fetch books for each category
    for (const cat of CATEGORIES) {
      console.log(`\n📚 Fetching ${cat.category} books...`);
      await delay(1500); // Wait 1.5 seconds between categories

      const books = await fetchBooks(cat.query, cat.count);
      console.log(`   Found ${books.length} books for ${cat.category}`);

      for (const book of books) {
        // Check for duplicates
        const exists = allBooks.some((b) => b.title === book.title);
        if (exists) continue;

        const authorName =
          book.authors?.map((a) => a.name).join(", ") || "Unknown Author";
        const rating = book.rating?.average
          ? Math.round(book.rating.average * 5 * 10) / 10
          : null;

        allBooks.push({
          title: book.title,
          author: authorName,
          category: cat.category,
          publishYear: book.publish_date ? Math.floor(book.publish_date) : null,
          publisher: "Various Publishers",
          description:
            book.subtitle ||
            `A ${cat.category.toLowerCase()} book by ${authorName}.`,
          totalQty: Math.floor(Math.random() * 10) + 3, // Random 3-12 copies
          borrowedQty: 0,
          isbn: `BB-${book.id}`,
          coverUrl: book.image || "",
        });
      }
    }

    console.log(`\n📦 Total unique books collected: ${allBooks.length}`);

    // Insert books in batches
    console.log("Inserting books into database...");
    const BATCH_SIZE = 50;

    for (let i = 0; i < allBooks.length; i += BATCH_SIZE) {
      const batch = allBooks.slice(i, i + BATCH_SIZE);
      await Book.bulkCreate(batch, { ignoreDuplicates: true });
      console.log(
        `   Inserted batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(
          allBooks.length / BATCH_SIZE
        )}`
      );
    }

    totalImported = allBooks.length;

    // Print summary
    console.log("\n✅ Import Complete!");
    console.log(`   Total books imported: ${totalImported}`);

    // Count by category
    const categoryCounts = {};
    allBooks.forEach((b) => {
      categoryCounts[b.category] = (categoryCounts[b.category] || 0) + 1;
    });

    console.log("\n📊 Books by Category:");
    Object.entries(categoryCounts).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} books`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seedBooks();
