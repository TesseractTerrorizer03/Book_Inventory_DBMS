const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
// app.use(cors());
app.use(cors({ origin: 'http://localhost:3001' }));
app.use(bodyParser.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bookstore_db',
  password: 'pant2922',
  port: 5432,
});

app.get('/home', async (req, res) => {
  try {
    const sortBy = req.query.sortBy || 'rating'; // Default sorting by rating if not specified in the request query
    const limit = 10; // Limit to top 10 books

    let query;
    if (sortBy === 'sales') {
      query = {
        text: `
          SELECT Book_Details.*, Sales.quantity
          FROM Book_Details
          INNER JOIN Sales ON Book_Details.book_id = Sales.book_id
          ORDER BY Sales.quantity DESC
          LIMIT $1
        `,
        values: [limit],
      };
    } else {
      // Default sorting by rating
      query = {
        text: 'SELECT * FROM Book_Details ORDER BY rating DESC LIMIT $1',
        values: [limit],
      };
    }

    const client = await pool.connect();
    const result = await client.query(query);
    client.release();

    res.json({ topBooks: result.rows });
  } catch (error) {
    res.status(500).json({ error: `Error fetching top books: ${error.message}` });
  }
});

app.get('/top-books', async (req, res) => {
  try {
    const sortBy = req.query.sortBy || 'rating'; // Default sorting by rating if not specified in the request query
    const page = req.query.page || 1; // Default page is 1 if not specified in the request query
    const limit = 50;
    const offset = (page - 1) * limit;

    let query;
    if (sortBy === 'sales') {
      query = {
        text: `
          SELECT Book_Details.*, Sales.quantity
          FROM Book_Details
          INNER JOIN Sales ON Book_Details.book_id = Sales.book_id
          ORDER BY Sales.quantity DESC
          LIMIT $1 OFFSET $2
        `,
        values: [limit],
      };
    } else {
      // Default sorting by rating
      query = {
        text: 'SELECT * FROM Book_Details ORDER BY rating DESC LIMIT $1 OFFSET $2',
        values: [limit],
      };
    }

    const client = await pool.connect();
    const result = await client.query(query);
    client.release();

    res.json({ topBooks: result.rows });
  } catch (error) {
    res.status(500).json({ error: `Error fetching top books: ${error.message}` });
  }
});


// Purchases. Log of all the orders
app.get('/purchase', async (req, res) => {
  try {
    const cust_id = req.query.customer_id; // Get customer ID from URL path

    const query = {
      text: 'SELECT * FROM ORDERS WHERE customer_id = $1 ORDER BY order_date DESC',
      values: [cust_id],
    };

    const client = await pool.connect();
    const result = await client.query(query);
    client.release();

    res.json({ orders: result.rows });
  } catch (error) {
    res.status(500).json({ error: `Error fetching orders: ${error.message}` });
  }
});

// Getting user reviews
app.get('/my-reviews', async (req, res) => {
  try {
    const cust_id = req.query.customer_id; // Get customer ID from URL path

    const query = {
      text: 'SELECT * FROM ORDERS WHERE customer_id = $1 LEFT JOIN Reviews on Reviews.user_id = Orders.customer_id  ORDER BY order_date DESC',
      values: [cust_id],
    };

    const client = await pool.connect();
    const result = await client.query(query);
    client.release();

    res.json({ orders: result.rows });
  } catch (error) {
    res.status(500).json({ error: `Error fetching orders: ${error.message}` });
  }
});



// Get customer details by ID
app.get('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const client = await pool.connect();
    const userQuery = {
      text: 'SELECT * FROM Customers WHERE customer_id = $1',
      values: [userId],
    };
    const userResult = await client.query(userQuery);

    const reviewsQuery = {
      text: 'SELECT * FROM Reviews WHERE user_id = $1',
      values: [userId],
    };
    const reviewsResult = await client.query(reviewsQuery);

    client.release();

    const userData = userResult.rows[0];
    const userReviews = reviewsResult.rows;

    res.json({ userData, userReviews });
  } catch (error) {
    res.status(500).json({ error: `Error fetching user data: ${error.message}` });
  }
});

// Update user details
app.put('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { name, email, /* other fields you want to update */ } = req.body;

    const client = await pool.connect();
    const updateQuery = {
      text: 'UPDATE Customers SET customer_name = $1, email = $2  WHERE customer_id = $3',
      values: [name, email, userId],
    };
    await client.query(updateQuery);
    client.release();

    res.json({ message: 'User details updated successfully' });
  } catch (error) {
    res.status(500).json({ error: `Error updating user details: ${error.message}` });
  }
});

// Endpoint to get details of a specific book and its reviews by book ID
app.get('/book/:bookId', async (req, res) => {
  try {
    const bookId = req.params.bookId;

    const bookQuery = {
      text: 'SELECT * FROM Book_Details WHERE book_id = $1',
      values: [bookId],
    };
    const reviewsQuery = {
      text: 'SELECT * FROM Reviews WHERE book_id = $1',
      values: [bookId],
    };
    const authorQuery = {
      text: 'SELECT author_name FROM Authors WHERE author_id IN (SELECT author_id FROM Book_Authors WHERE book_id = $1)',
      values: [bookId],
    };
    const client = await pool.connect();
    const bookResult = await client.query(bookQuery);
    const reviewsResult = await client.query(reviewsQuery);
    const authorResult = await client.query(authorQuery);
    client.release();

    const bookDetails = bookResult.rows[0];
    const bookReviews = reviewsResult.rows;
    const bookAuthors = authorResult.rows.map((author) => author.author_name);
    res.json({ bookDetails, bookAuthors, bookReviews });
  } catch (error) {
    res.status(500).json({ error: `Error fetching book details: ${error.message}` });
  }
});

// Endpoint to handle order placement
app.post('/place-order', async (req, res) => {
  try {
    const { bookId, quantity } = req.body;

    const client = await pool.connect();
    const updateBookQuantityQuery = {
      text: 'UPDATE Books SET quantity = quantity - $1 WHERE book_id = $2',
      values: [quantity, bookId],
    };
    await client.query(updateBookQuantityQuery);
    client.release();


    res.json({ message: 'Order placed successfully' });
  } catch (error) {
    res.status(500).json({ error: `Error placing order: ${error.message}` });
  }
});


// Modify book details
app.post('/modify', async (req, res) => {
  try {
    const { bid, title, publish, quantity } = req.body;
    // console.log(bookId)
    const client = await pool.connect();
    const updateBookQuery = {
      text: 'UPDATE Book_Details SET title = $1, publish_date = $2, quantity = $3  WHERE book_id = $4',
      values: [title, publish, quantity, bid],
    };
    await client.query(updateBookQuery);
    client.release();

    res.json({ message: 'Book details updated successfully' });
  } catch (error) {
    res.status(500).json({ error: `Error updating book details: ${error.message}` });
  }
});


app.get('/modify', async (req, res) => {
  try {
    const bid = req.query.bookId;  // Use req.params to get the URL parameter
    const query = {
      text: 'SELECT * FROM book_details WHERE book_id = $1',
      values: [bid],
    };

    const client = await pool.connect();
    const result = await client.query(query);
    client.release();

    res.json({ orders: result.rows });
  } catch (error) {
    res.status(500).json({ error: `Error fetching orders: ${error.message}` });
  }
});

app.post('/addbook', async (req, res) => {
  console.log(req.body)
  // res.json({message:"chal rha"})
  try {
    const { BookId, Title, PublishDate, Quantity } = req.body;
    const rating = 0;
    const result = await pool.query('INSERT INTO Book_Details (book_id, title, publish_date, rating , quantity) VALUES ($1, $2, $3, $4, $5) RETURNING *', [BookId, Title, PublishDate, rating, Quantity]);

    res.status(201).json({ message: 'Book added successfully', newBook: result.rows[0] });
  } catch (error) {
    console.error('Error adding book:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.get('/test', (req, res) => {
  // console.log("hello")
  // res.json({ recentOrders: recentOrdersResult.rows });
  res.json({ message: "hello" });
})

app.put('/modifynew/', async (req, res) => {
  // try {

  // const { bid,title, publish, quantity } = req.body;
  console.log('Test')
  console.log(req.body)

  const client = await pool.connect();

  const updateValues = [];
  const updateParams = [];

  if (title !== null && title !== undefined) {
    updateValues.push(`title = $${updateValues.length + 1}`);
    updateParams.push(title);
  }
  if (publish !== null && publish !== undefined) {
    updateValues.push(`publish = $${updateValues.length + 1}`);
    updateParams.push(publish);
  }
  if (quantity !== null && quantity !== undefined) {
    updateValues.push(`quantity = $${updateValues.length + 1}`);
    updateParams.push(quantity);
  }

  // If there are no valid updates, return a response
  if (updateValues.length === 0) {
    client.release();
    return res.status(400).json({ error: 'No valid updates provided' });
  }

  // Construct the dynamic update query
  const updateBookQuery = {
    text: `UPDATE Books SET ${updateValues.join(', ')} WHERE book_id = $${updateParams.length + 1} RETURNING *`,
    values: [...updateParams, bid],
  };

  // Execute the update query
  const updatedBook = await client.query(updateBookQuery);

  client.release();

  if (updatedBook.rows.length === 0) {
    return res.status(404).json({ error: 'Book not found' });
  }

  const updatedDetailsQuery = {
    text: 'SELECT * FROM Books WHERE book_id = $1',
    values: [bid],
  };
  const updatedDetails = await pool.query(updatedDetailsQuery);

  res.json({
    message: 'Book details updated successfully',
    updatedDetails: updatedDetails.rows[0],
  });


  // } catch (error) {
  // res.status(500).json({ error: `Error updating book details: ${error.message}` });
  // }
});


// Fetch most recent orders
app.get('/recent-orders', async (req, res) => {
  try {
    const client = await pool.connect();
    const recentOrdersQuery = {
      text: 'SELECT * FROM Orders ORDER BY order_id DESC LIMIT 10', // Fetching 10 most recent orders
    };
    const recentOrdersResult = await client.query(recentOrdersQuery);
    client.release();

    res.json({ recentOrders: recentOrdersResult.rows });
  } catch (error) {
    res.status(500).json({ error: `Error fetching recent orders: ${error.message}` });
  }
});

// Endpoint to fetch all genres and tags
app.get('/taggenre', async (req, res) => {
  try {
    const client = await pool.connect();
    const genres = await client.query('SELECT genre_name FROM Genres');
    const tags = await client.query('SELECT tag_name FROM Tags');
    client.release();
    res.json({ genres: genres.rows, tags: tags.rows });
  } catch (error) {
    res.status(500).json({ error: `Error fetching tags and genres: ${error.message}` });
  }
});


// Endpoint to handle the search request
app.post('/topbooks', async (req, res) => {
  try {
    const { genres, tags, excludeGenres, excludeTags, bookName, authorName } = req.body;

    // Build the SQL query dynamically based on the search parameters
    const query = `
      SELECT Book_Details.book_id, Book_Details.title, Book_Details.rating, Authors.author_name
      FROM Book_Details
      JOIN Book_Genres ON Book_Details.book_id = Book_Genres.book_id
      JOIN Genres ON Book_Genres.genre_id = Genres.genre_id
      JOIN Book_Tags ON Book_Details.book_id = Book_Tags.book_id
      JOIN Tags ON Book_Tags.tag_id = Tags.tag_id
      JOIN Book_Authors ON Book_Details.book_id = Book_Authors.book_id
      JOIN Authors ON Book_Authors.author_id = Authors.author_id
      WHERE
        (${genres.length === 0 ? 'true' : 'genres.name IN ($1:csv)'})
        AND (${tags.length === 0 ? 'true' : 'tags.name IN ($2:csv)'})
        AND (${excludeGenres.length === 0 ? 'true' : 'genres.name NOT IN ($3:csv)'})
        AND (${excludeTags.length === 0 ? 'true' : 'tags.name NOT IN ($4:csv)'})
        AND (${bookName ? 'books.name ILIKE $5' : 'true'})
        AND (${authorName ? 'authors.name ILIKE $6' : 'true'})
    `;

    const queryParams = [
      genres.map((genre) => genre.toLowerCase()),
      tags.map((tag) => tag.toLowerCase()),
      excludeGenres.map((genre) => genre.toLowerCase()),
      excludeTags.map((tag) => tag.toLowerCase()),
      `%${bookName ? bookName.toLowerCase() : ''}%`,
      `%${authorName ? authorName.toLowerCase() : ''}%`,
    ];

    const { rows } = await pool.query(query, queryParams);

    res.json(rows);
  } catch (error) {
    console.error('Error executing search query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// review addition endpoint
app.post('/addreview', async (req, res) => {
  try {
    const { BookId, ReviewText, ReviewDate, Rating, UserId } = req.body;

    const result = await pool.query('INSERT INTO Reviews (book_id, review_text, review_date, rating, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *', [BookId, ReviewText, ReviewDate, Rating, UserId]);

    res.status(201).json({ message: 'Review added successfully', newReview: result.rows[0] });
  } catch (error) {
    console.error('Error adding review:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

