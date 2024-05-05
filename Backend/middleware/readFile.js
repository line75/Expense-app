const fs = require('fs');

function readLastIdFromFile() {
    try {
        const data = fs.readFileSync('last_user_id.txt', 'utf8');
        return parseInt(data);
    } catch (err) {
        return 0; // Return 0 if file doesn't exist or cannot be read
    }
}

// Function to write the last assigned ID to a file
function writeLastIdToFile(id) {
    fs.writeFileSync('last_user_id.txt', id.toString());
}

module.exports = {
    readLastIdFromFile: readLastIdFromFile,
    writeLastIdToFile: writeLastIdToFile
}
