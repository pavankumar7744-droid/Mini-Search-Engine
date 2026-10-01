const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { htmlToText } = require('html-to-text');

async function parseFile(filePath, mimeType) {
    try {
        let text = '';
        if (mimeType === 'application/pdf') {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdfParse(dataBuffer);
            text = data.text;
        } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || mimeType === 'application/msword') {
            const result = await mammoth.extractRawText({ path: filePath });
            text = result.value;
        } else if (mimeType === 'text/html') {
            const htmlContent = fs.readFileSync(filePath, 'utf-8');
            text = htmlToText(htmlContent, { wordwrap: 130 });
        } else if (mimeType === 'text/plain') {
            text = fs.readFileSync(filePath, 'utf-8');
        } else {
            // fallback for other text-based files
            text = fs.readFileSync(filePath, 'utf-8');
        }
        return text;
    } catch (err) {
        console.error('Error parsing file:', filePath, err);
        return '';
    }
}

module.exports = { parseFile };
