const fs = require('fs');
const path = require('path');

// The script expects the file path as a command-line argument.
// If no argument is provided, it will default to the one from the user's context.
const defaultPath = 'data/Facilities_API_v1.json';
const filePathArg = process.argv[2];

const jsonFilePath = path.resolve(__dirname, filePathArg || defaultPath);

if (!fs.existsSync(jsonFilePath)) {
    console.error(`Error: File not found at ${jsonFilePath}`);
    console.log('Please provide a valid path to the JSON file as an argument.');
    process.exit(1);
}

try {
    const rawData = fs.readFileSync(jsonFilePath, 'utf8');
    const jsonData = JSON.parse(rawData);
    console.log(JSON.stringify(jsonData, null, 2));
} catch (error) {
    console.error(`Error processing file: ${jsonFilePath}`, error);
    process.exit(1);
}