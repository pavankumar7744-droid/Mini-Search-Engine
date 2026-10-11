const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}
const docDir = path.join(__dirname, 'data', 'documents');
if (!fs.existsSync(docDir)) {
    fs.mkdirSync(docDir);
}
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Ensure preloaded documents are added
const documentStorage = require('./services/documentStorage');
const { indexerInstance } = require('./search/indexer');

// If there are no documents, we should probably add some sample ones
// but we will let the upload handle it or just create dummy if needed

// Routes
const documentsRouter = require('./routes/documents');
const searchRouter = require('./routes/search');
const algorithmsRouter = require('./routes/algorithms');

app.use('/api/documents', documentsRouter);
app.use('/api/search', searchRouter);
app.use('/api/algorithms', algorithmsRouter);

app.get('/api/stats', (req, res) => {
    res.json(documentStorage.getStats());
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
