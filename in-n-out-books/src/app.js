/**
 * Author: Jennifer
 * Date: June 28, 2026
 * File Name: app.js
 * Description: Initial server setup for the In-N-Out-Books API.
 * Includes an Express application setup, a fully designed HTML landing page route,
 * API data routes, and error handling middleware.
 */

// Require the Express module
const express = require('express');

// Mock database dependency required for testing data retrieval
const books = require('../database/books');

// Set up the Express application
const app = express();

// GET route for the root URL ("/") returning a fully designed landing page
app.get('/', (req, res) => {
  const htmlLandingPage = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>In-N-Out-Books</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background-color: #f4f7f6;
          color: #333;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .card {
          background: #ffffff;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          text-align: center;
          max-width: 600px;
        }
        h1 {
          color: #2c3e50;
          margin-bottom: 10px;
        }
        p {
          font-size: 1.1em;
          color: #7f8c8d;
          line-height: 1.6;
        }
        .highlight {
          color: #e74c3c;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Welcome to <span class="highlight">In-N-Out-Books</span></h1>
        <p>Your ultimate platform for managing collections of books.</p>
        <p>Whether you are an avid reader keeping track of your latest adventures, or a book club organizer managing a shared library, we have all the tools you need.</p>
      </div>
    </body>
    </html>
  `;

  // Send the HTML response
  res.send(htmlLandingPage);
});

// --- NEW API ROUTES GO HERE ---

// Expose full inventory for client-side rendering.
// Wrapped in a try/catch to guarantee server stability if the underlying data layer fails.
app.get('/api/books', async (req, res) => {
  try {
    const allBooks = await books.find();
    res.status(200).json(allBooks);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Parameterized route to fetch specific resources, keeping payload sizes small for the client.
app.get('/api/books/:id', async (req, res) => {
  try {
    // Coerce the URL string parameter into an integer to strictly match database schema types
    const bookId = parseInt(req.params.id, 10);

    // Guard clause: Fail fast on malformed requests to save server processing power
    if (isNaN(bookId)) {
      return res.status(400).json({ message: 'Input must be a number' });
    }

    const book = await books.findOne({ id: bookId });
    res.status(200).json(book);

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// --- ERROR HANDLERS GO LAST ---

// Middleware function to handle 404 errors (Route not found)
app.use((req, res, next) => {
  res.status(404).send('404 - Page Not Found');
});

// Middleware function to handle 500 errors (Internal Server Error)
app.use((err, req, res, next) => {
  res.status(500).json({
    message: "Internal Server Error",
    errorDetails: err.message,
    // Include the error stack ONLY if running in development mode
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Export the Express application
module.exports = app;