const fs = require('fs');
const path = require('path');

// Scan passed directory
// returns number of folders and files
async function traverseFolderContents(directory) {
    try {
        // Read directory contents
        const files = await fs.promises.readdir(directory, { withFileTypes: true });

        let filesCount = files.length;
        let folderCount = 0;
        let infoFileExists = files.find(x => x.name == "info.json") ? 1 : 0;

        // Count folders
        for (const file of files)
            if (file.isDirectory()) folderCount++;

        filesCount -= (folderCount + infoFileExists);

        return [folderCount, filesCount];
    }
    catch (error) {
        console.error(`Error traversing contents: ${directory}:`, error);
        return [-1, -1];
    }
}

// Create info object
// return JSON string
function createInfoJson(folderPath, folderCount, filesCount) {
    const info = {
    path: folderPath,
        folders: folderCount,
        files: filesCount
    };

    return JSON.stringify(info, null, 2);
}

async function createInfoFile(directory) {
    try {
        // Full info file path
        const infoFilePath = path.join(directory, 'info.json');
        
        // Get directory contents
        const [folderCount, filesCount] = await traverseFolderContents(directory);

        const infoJson = createInfoJson(infoFilePath, folderCount, filesCount);

        // Write out
        await fs.promises.writeFile(infoFilePath, infoJson);

        console.log(`info.json has been created in ${directory}`);
    } catch (error) {
        console.error(`Error creating info.json in ${directory}:`, error);
    }
}

module.exports = {
    createInfoFile
};
