const fs = require('fs');
const pdf = require('pdf-parse');

async function parseDocument(filePath, originalname) {
    const ext = originalname.split('.').pop().toLowerCase();
    
    if (ext === 'txt') {
        const text = fs.readFileSync(filePath, 'utf-8');
        return text;
    } else if (ext === 'pdf') {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        return data.text;
    } else {
        throw new Error('Unsupported file format');
    }
}

module.exports = { parseDocument };
