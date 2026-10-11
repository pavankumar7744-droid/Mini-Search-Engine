const { getAllDocuments } = require('../services/documentStorage');

class Indexer {
    constructor() {
        this.documents = [];
        this.loadDocuments();
    }

    loadDocuments() {
        this.documents = getAllDocuments();
    }

    addDocument(doc) {
        this.documents.push(doc);
    }

    getDocuments() {
        return this.documents;
    }
}

const indexerInstance = new Indexer();

module.exports = { indexerInstance };
