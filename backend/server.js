const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/my-database';

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log('MongoDB connection error:', error));

// Create user schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  age: String,
  gender: String,
  dob: String,
  mobile: String
});

const User = mongoose.model('User', userSchema);

// Signup route
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Signup successful' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create and sign a JSON Web Token (JWT)
    const token = jwt.sign({ userId: user._id }, 'secret-key');

    res.json({ message: 'Login successful', token, name: user.name});
  } catch (error) {
    res.status(500).json({ message: 'An error occurred' });
  }
});

// Profile route (GET)
app.get('/api/profile', async (req, res) => {
    try {
      // Retrieve profile data from the database using a unique identifier, such as email
      const { email } = req.query;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const { age, gender, dob, mobile } = user;
  
      res.json({ age, gender, dob, mobile });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred' });
    }
  });
  

// Profile route (PUT)
app.put('/api/profile', async (req, res) => {
      // Retrieve and validate user data from the request body
      const { email, age, gender, dob, mobile } = req.body;
  
      // Update profile data in the database using a unique identifier, such as email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.age = age;
      user.gender = gender;
      user.dob = dob;
      user.mobile = mobile;
  
      await user.save();
  
      res.json({ message: 'Profile updated successfully', user });
  });


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
