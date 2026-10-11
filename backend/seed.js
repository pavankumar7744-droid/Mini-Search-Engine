const fs = require('fs');
const path = require('path');
const { addDocument, getAllDocuments } = require('./services/documentStorage');

const docs = [
    {
        filename: 'article1_operating_system.txt',
        content: `An operating system (OS) is system software that manages computer hardware, software resources, and provides common services for computer programs.
Time-sharing operating systems schedule tasks for efficient use of the system and may also include accounting software for cost allocation of processor time, mass storage, printing, and other resources.
For hardware functions such as input and output and memory allocation, the operating system acts as an intermediary between programs and the computer hardware.`
    },
    {
        filename: 'article2_algorithm.txt',
        content: `In mathematics and computer science, an algorithm is a finite sequence of rigorous instructions, typically used to solve a class of specific problems or to perform a computation.
Algorithms are used as specifications for performing calculations and data processing.
More advanced algorithms can perform automated deductions (referred to as automated reasoning) and use mathematical and logical tests to direct the code execution through various routes.`
    },
    {
        filename: 'article3_india_history.txt',
        content: `India is a country in South Asia. It is the seventh-largest country by area and the most populous country in the world.
Bounded by the Indian Ocean on the south, the Arabian Sea on the southwest, and the Bay of Bengal on the southeast, it shares land borders with Pakistan to the west; China, Nepal, and Bhutan to the north; and Bangladesh and Myanmar to the east.
The history of India is diverse and culturally rich, encompassing various empires and civilizations.`
    }
];

const docDir = path.join(__dirname, 'data', 'documents');

if (getAllDocuments().length === 0) {
    console.log("Seeding documents...");
    docs.forEach((doc, idx) => {
        const id = Date.now().toString() + idx;
        const filepath = path.join(docDir, doc.filename);
        fs.writeFileSync(filepath, doc.content);
        
        addDocument({
            id,
            filename: doc.filename,
            uploadDate: new Date().toISOString(),
            content: doc.content
        });
    });
    console.log("Seeding complete.");
} else {
    console.log("Documents already exist. Skipping seed.");
}
