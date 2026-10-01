const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { parseFile } = require('./fileParser');
const SearchEngine = require('./searchEngine');

const app = express();
const port = 3000;

// Set up storage for uploaded files
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Initialize search engine
const searchEngine = new SearchEngine();
let uploadedFiles = []; // To keep track of files for UI

app.use(express.static('public'));
app.use(express.json());

// API to upload file
app.post('/api/upload', upload.array('documents'), async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded.' });
        }

        const newFilesInfo = [];
        for (const file of files) {
            const content = await parseFile(file.path, file.mimetype);
            const docId = file.filename;
            
            searchEngine.addDocument(docId, file.originalname, content);
            
            const fileInfo = { id: docId, name: file.originalname, type: file.mimetype, size: file.size };
            uploadedFiles.push(fileInfo);
            newFilesInfo.push(fileInfo);
        }

        res.json({ message: 'Files uploaded and indexed successfully.', files: newFilesInfo });
    } catch (err) {
        console.error('Upload Error:', err);
        res.status(500).json({ error: 'Failed to process files.' });
    }
});

// API to search
app.get('/api/search', (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.json([]);
    }
    const results = searchEngine.search(query);
    res.json(results);
});

// API to get all uploaded files
app.get('/api/files', (req, res) => {
    res.json(uploadedFiles);
});

// API to get document content by ID
app.get('/api/document/:id', (req, res) => {
    const docId = req.params.id;
    const doc = searchEngine.documents.get(docId);
    if (!doc) {
        return res.status(404).json({ error: 'Document not found' });
    }
    res.json({ name: doc.name, content: doc.lines.join('\n') });
});

// API to clear session
app.post('/api/clear', (req, res) => {
    // Clear search engine
    searchEngine.clear();
    
    // Clear files from array
    uploadedFiles = [];
    
    // Delete files from filesystem
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            console.error('Failed to read upload directory', err);
            return res.status(500).json({ error: 'Failed to clear session.' });
        }
        for (const file of files) {
            fs.unlink(path.join(uploadDir, file), (err) => {
                if (err) console.error('Failed to delete file', file, err);
            });
        }
    });

    res.json({ message: 'Session cleared successfully.' });
});

app.listen(port, () => {
    console.log(`Mini Search Engine listening at http://localhost:${port}`);
});
