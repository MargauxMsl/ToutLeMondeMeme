const express = require('express');
const path = require('path');
const cors = require('cors');
const jsonServer = require('json-server');
const https = require('https');
const fs = require('fs');
const { randomBytes, randomInt } = require('crypto');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

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
