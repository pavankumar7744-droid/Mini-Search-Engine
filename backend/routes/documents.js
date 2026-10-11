const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { parseDocument } = require('../services/documentParser');
const { addDocument, getAllDocuments, getDocumentById, removeDocument } = require('../services/documentStorage');
const { indexerInstance } = require('../search/indexer');

const upload = multer({ dest: 'uploads/' });

router.get('/', (req, res) => {
    res.json(getAllDocuments().map(doc => ({
        id: doc.id,
        filename: doc.filename,
        uploadDate: doc.uploadDate,
        length: doc.content.length
    })));
});

router.post('/upload', upload.array('files'), async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
    }

    const existingDocs = getAllDocuments();
    const results = [];

    for (const file of req.files) {
        try {
            // Check for duplicates
            const isDuplicate = existingDocs.some(d => d.filename === file.originalname);
            if (isDuplicate) {
                // If requested to skip/replace, handle it here. 
                // We'll skip silently or return status for now.
                results.push({ filename: file.originalname, status: 'Duplicate skipped' });
                // Clean up temp file
                fs.unlinkSync(file.path);
                continue;
            }

            const textContent = await parseDocument(file.path, file.originalname);
            
            const doc = {
                id: Date.now().toString() + Math.floor(Math.random()*1000),
                filename: file.originalname,
                uploadDate: new Date().toISOString(),
                content: textContent
            };

            addDocument(doc);
            indexerInstance.addDocument(doc);

            const destPath = path.join(__dirname, '..', 'data', 'documents', file.originalname);
            fs.renameSync(file.path, destPath);

            results.push({ filename: file.originalname, status: 'Parsed & Indexed', id: doc.id });
        } catch (err) {
            console.error(`Error processing ${file.originalname}:`, err);
            results.push({ filename: file.originalname, status: 'Parsing warning / failed' });
        }
    }

    res.json({ message: 'Upload batch completed', results });
});

router.get('/:id', (req, res) => {
    const doc = getDocumentById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
});

router.delete('/:id', (req, res) => {
    removeDocument(req.params.id);
    indexerInstance.loadDocuments(); // Reload indexer
    res.json({ message: 'Deleted' });
});

module.exports = router;
