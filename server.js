const express = require('express');
const path = require('path');
const fs = require('fs');
const jsonServer = require('json-server');
const cors = require('cors');
const mongoose = require('mongoose');




const app = express();
const port = process.env.PORT || 3001;


mongoose.connect("mongodb://127.0.0.1:27017/Memes", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connexion à MongoDB réussie !');
})
.catch((error) => {
  console.log('Erreur lors de la connexion à MongoDB :', error);
});


// Enable CORS for all routes

app.use(cors());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Create a custom route handler for downloading memes
app.get('/memes/:id', (req, res) => {
  try {
    const memeId = req.params.id;

    // Read the contents of the meme.json file
    const memeData = fs.readFileSync(path.join(__dirname, 'meme.json'), 'utf8');
    const memes = JSON.parse(memeData);

    // Find the meme with the specified ID
    const meme = memes.find(m => m.id === memeId);

    if (!meme) {
      return res.status(404).json({ error: 'Meme not found' });
    }

    // Set the appropriate response headers for file download
    res.set({
      'Content-Type': 'image/jpeg', // Modify this according to your file type
      'Content-Disposition': `attachment; filename=${meme.name}.jpg`, // Set the desired file name
    });

    // Send the file as the response
    res.sendFile(path.join(__dirname, meme.url));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Use json-server middleware
app.use(jsonServer.defaults());
app.use('/api', jsonServer.router('meme.json')); // Replace 'db.json' with your JSON data file

// Return the React app for any other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
