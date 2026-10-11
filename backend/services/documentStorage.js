const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', 'data', 'db.json');

function initDB() {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify({ documents: [], stats: { searches: 0, algorithms: {} } }));
    }
}

function getDB() {
    initDB();
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
}

function saveDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function getAllDocuments() {
    const db = getDB();
    return db.documents;
}

function getDocumentById(id) {
    const db = getDB();
    return db.documents.find(doc => doc.id === id);
}

function addDocument(doc) {
    const db = getDB();
    db.documents.push(doc);
    saveDB(db);
}

function removeDocument(id) {
    const db = getDB();
    db.documents = db.documents.filter(doc => doc.id !== id);
    saveDB(db);
}

function getStats() {
    const db = getDB();
    return db.stats;
}

function updateStats(searchTime, algoName) {
    const db = getDB();
    db.stats.searches += 1;
    if (!db.stats.algorithms[algoName]) {
        db.stats.algorithms[algoName] = 0;
    }
    db.stats.algorithms[algoName] += 1;
    saveDB(db);
}

module.exports = {
    getAllDocuments,
    getDocumentById,
    addDocument,
    removeDocument,
    getStats,
    updateStats
};
