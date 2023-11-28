const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // Port, den der Express-Server verwenden soll

// Statische Dateien aus dem Build-Verzeichnis servieren
app.use(express.static(path.join(__dirname, 'build')));

// Alle anderen Anfragen auf die index.html umleiten (Single-Page Application)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Den Express-Server starten
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});