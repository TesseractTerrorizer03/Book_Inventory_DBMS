const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
app.use(cors());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bookstore_db',
  password: 'shashwat03',
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

    const client = await pool.connect();
    const bookResult = await client.query(bookQuery);
    const reviewsResult = await client.query(reviewsQuery);
    client.release();

    const bookDetails = bookResult.rows[0];
    const bookReviews = reviewsResult.rows;

    res.json({ bookDetails, bookReviews });
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
// app.put('/modify', async (req, res) => {
//   try {
//     const bookId = req.params.bookId;
//     const { title, publish, quantity} = req.body;

//     const client = await pool.connect();
//     const updateBookQuery = {
//       text: 'UPDATE Books SET title = $1, publish = $2, quantity = $3  WHERE book_id = $4',
//       values: [title, publish, quantity,bookId],
//     };
//     await client.query(updateBookQuery);
//     client.release();

//     res.json({ message: 'Book details updated successfully' });
//   } catch (error) {
//     res.status(500).json({ error: `Error updating book details: ${error.message}` });
//   }
// });

// app.put('/modify', async (req, res) => {
//   try {
//     const bookId = req.params.bookId;
//     const { title, publish, quantity } = req.body;

//     const client = await pool.connect();

//     const updateBookQuery = {
//       text: 'UPDATE Books SET title = $1, publish = $2, quantity = $3  WHERE book_id = $4 RETURNING *',
//       values: [title, publish, quantity, bookId],
//     };
//     const updatedBook = await client.query(updateBookQuery);

//     client.release();

//     if (updatedBook.rows.length === 0) {
//       return res.status(404).json({ error: 'Book not found' });
//     }

//     const updatedDetailsQuery = {
//       text: 'SELECT * FROM Books WHERE book_id = $1',
//       values: [bookId],
//     };
//     const updatedDetails = await pool.query(updatedDetailsQuery);

//     res.json({
//       message: 'Book details updated successfully',
//       updatedDetails: updatedDetails.rows[0],
//     });
//   } catch (error) {
//     res.status(500).json({ error: `Error updating book details: ${error.message}` });
//   }
// });

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


app.put('/modify', async (req, res) => {
  try {
    
    const bookId = req.query.bookId;
    const { title, publish, quantity } = req.body;

    const client = await pool.connect();

    // Create an array to store the non-null updates
    const updateValues = [];
    const updateParams = [];

    // Check each input and add non-null values to the update array
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
      values: [...updateParams, bookId],
    };

    // Execute the update query
    const updatedBook = await client.query(updateBookQuery);

    client.release();

    if (updatedBook.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const updatedDetailsQuery = {
      text: 'SELECT * FROM Books WHERE book_id = $1',
      values: [bookId],
    };
    const updatedDetails = await pool.query(updatedDetailsQuery);

    res.json({
      message: 'Book details updated successfully',
      updatedDetails: updatedDetails.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: `Error updating book details: ${error.message}` });
  }
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

