const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const stripe = require('stripe')('your_stripe_secret_key');  // Import Stripe

// Create the Express app
const app = express();
const port = 3001;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
  host: 'database-1.cxaqc8e0a5ch.eu-north-1.rds.amazonaws.com',
  user: 'reactdatabase',
  password: 'Password1369',
  database: 'reactdb'
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return ;
  }
  console.log('Connected to the database.');
});

// Signup Endpoint (with password hashing)
app.post('/api/signup', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Hash the password before saving to the database
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error: 'Error hashing password' });
    }

    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(query, [username, hashedPassword], (dbErr, result) => {
      if (dbErr) {
        return res.status(500).json({ error: 'Error inserting user into the database' });
      }
      res.status(201).json({ message: 'Signup successful!' });
    });
  });
});

// Login Endpoint (with password verification)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const storedHashedPassword = results[0].password;

    bcrypt.compare(password, storedHashedPassword, (compareErr, isMatch) => {
      if (compareErr || !isMatch) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      res.status(200).json({ message: 'Login successful' });
    });
  });
});

// Get all products from Balajishop
app.get('/api/balajishop', (req, res) => {
  db.query('SELECT * FROM balajishop', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database query error' });
    } else {
      res.json(results);
    }
  });
});

// Get all products from Ravishop
app.get('/api/ravishop', (req, res) => {
  db.query('SELECT * FROM ravishop', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database query error' });
    } else {
      res.json(results);
    }
  });
});

app.get('/api/Mahalaxmishop', (req, res) => {
  db.query('SELECT * FROM Mahalaxmishop', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database query error' });
    } else {
      res.json(results);
    }
  });
});

// Get all products from Srilaxmishop
app.get('/api/srilaxmishop', (req, res) => {
  db.query('SELECT * FROM srilaxmishop', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database query error' });
    } else {
      res.json(results);
    }
  });
});

// Get all products from another shop (Add as needed)
app.get('/api/venkateswarlushop', (req, res) => {
  db.query('SELECT * FROM venkateswarushop', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database query error' });
    } else {
      res.json(results);
    }
  });
});

app.get('/api/parvathishop', (req, res) => {
  db.query('SELECT * FROM parvathishop', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database query error' });
    } else {
      res.json(results);
    }
  });
});

app.get('/api/ganeshshop', (req, res) => {
  db.query('SELECT * FROM ganeshshop', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database query error' });
    } else {
      res.json(results);
    }
  });
});

app.get('/api/vasudevshop', (req, res) => {
  db.query('SELECT * FROM vasudevshop', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database query error' });
    } else {
      res.json(results);
    }
  });
});









// Cart APIs
app.post('/api/cart', (req, res) => {
  const { product_id, image, productname, price, quantity } = req.body;

  const query = 'INSERT INTO cart (product_id, image, productname, price, quantity) VALUES (?, ?, ?, ?, ?)';
  
  db.query(query, [product_id, image, productname, price, quantity], (err, result) => {
    if (err) {
      console.error('Error adding to cart:', err);
      return res.status(500).json({ message: 'Error adding item to cart', error: err.message });
    }

    res.status(201).json({ message: 'Item added to cart', id: result.insertId });
  });
});

app.get('/api/cart', (req, res) => {
  db.query('SELECT * FROM cart', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database query error' });
    } else {
      res.json(results);
    }
  });
});

app.delete('/api/cart/:productId', (req, res) => {
  const { productId } = req.params;
  const query = 'DELETE FROM cart WHERE product_id = ?';

  db.query(query, [productId], (err, result) => {
    if (err) {
      console.error('Error deleting cart item:', err);
      return res.status(500).json({ message: 'Error deleting item from cart' });
    }
    res.status(200).json({ message: 'Item removed from cart' });
  });
});

// Shop Details (Add product)
app.post('/api/ShopDetails', (req, res) => {
  const { id, image, productname, price } = req.body;
  const query = 'INSERT INTO balajishop (id, image, productname, price) VALUES (?, ?, ?, ?)';

  db.query(query, [id, image, productname, price], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error inserting data' });
    } else {
      res.status(201).json({ message: 'Product added successfully' });
    }
  });
});

app.post('/api/payments', async (req, res) => {
  try {
    const { cart, userId } = req.body;  // Assuming you have a userId in the request body
    const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100, // Stripe uses cents, so multiply by 100
      currency: 'inr',  // Adjust currency as needed
    });

    // Insert payment details into the database
    const query = 'INSERT INTO payments (user_id, total_amount, payment_intent_id, payment_status) VALUES (?, ?, ?, ?)';
    db.query(query, [userId, totalAmount, paymentIntent.id, 'pending'], (err, result) => {
      if (err) {
        console.error('Error inserting payment into database:', err);
        return res.status(500).send('Error processing payment');
      }

      // Return the client secret to the frontend for Stripe payment confirmation
      res.send({ clientSecret: paymentIntent.client_secret });
    });
  } catch (error) {
    console.error('Payment Error:', error);
    res.status(500).send('Payment processing failed');
  }
});


app.post('/api/checkout', (req, res) => {
  const { paymentIntentId } = req.body;

  // Update the payment status to 'succeeded' after successful payment
  const query = 'UPDATE payments SET payment_status = ? WHERE payment_intent_id = ?';
  db.query(query, ['succeeded', paymentIntentId], (err, result) => {
    if (err) {
      console.error('Error updating payment status:', err);
      return res.status(500).send('Error updating payment status');
    }

    res.send('Order placed successfully!');
  });
});


app.get('/api/payment', (req, res) => {
  db.query('SELECT * FROM anotherShop', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database query error' });
    } else {
      res.json(results);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
