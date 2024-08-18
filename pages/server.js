const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK with service account credentials
const serviceAccount = require('key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://learn-21ea5.firebaseio.com"
});

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files (e.g., your signup.html)
app.use(express.static(path.join(__dirname, 'public')));

app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Create a new user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: username,
    });

    console.log('Successfully created new user:', userRecord.uid);
    res.redirect('/loginpage.html'); // Redirect to login page after successful signup
  } catch (error) {
    console.error('Error creating new user:', error);
    res.status(500).send('Error creating new user');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
