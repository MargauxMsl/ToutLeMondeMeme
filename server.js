const express = require('express');
const path = require('path');
const cors = require('cors');
const jsonServer = require('json-server');
const https = require('https');
const fs = require('fs');
const { randomBytes, randomInt } = require('crypto');

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

// Assuming you have a Meme model defined with other fields
const memeSchema = new mongoose.Schema({
  image: { name: String, type: String, required: true },
});



// Enable CORS for all routes

app.use(cors());

app.use(fileUpload()); // Add the file upload middleware

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

let daily_memes = [];
let randomIndex = 0;

//Get memes from api
function GetApiMemes(callback) {
    https.get('https://api.imgflip.com/get_memes', response => {
        let jsonData = '';

        response.on('data', chunk => {
            jsonData += chunk;
        });

        response.on('end', () => {
            const parsedData = JSON.parse(jsonData);
            callback(null, parsedData);
        });
    }).on('error', error => {
        callback(error); // Pass the error to the callback
    });
}

function updateDailyMemes() {
    GetApiMemes((error, apiData) => {
        if (error) {
            console.error('Error:', error);
        } else {
            daily_memes = apiData.data.memes;
            randomIndex = Math.floor(Math.random() * daily_memes.length);
            console.log("rand:", randomIndex);
        }
    });
}

setTimeout(updateDailyMemes, 2000);

setInterval(updateDailyMemes, 30 * 1000); // Update daily memes every 24 hours

app.get('/api/daily_meme', (req, res) => {
    console.log(daily_memes[randomIndex]);
    res.json(daily_memes[randomIndex]);
});

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

app.post('/api/memes/store', (req, res) => {
  const { id, image } = req.body;

  if (!id || !image) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  // Save the file or base64 image directly to the MongoDB document
  const meme = new Meme({
    id,
    image, // Assuming the image field in the Meme schema matches the base64 string or URL format
  });

  meme
    .save()
    .then(() => {
      console.log('Meme stored in MongoDB');
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Error storing meme in MongoDB:', error);
      res.sendStatus(500);
    });
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
