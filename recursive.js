const { createInfoFile } = require('./fileman.js');

const fs = require('fs');
const path = require('path');

// Basic approach
async function firstRecursiveApproach(directory) {
    try {
        // Get directory contents
        const files = await fs.promises.readdir(directory, { withFileTypes: true });
        
        // Call info func
        await createInfoFile(directory);

        // Recursive call for all subdirs
        for (const file of files) {
            if (file.isDirectory()) {
                const subdirectory = path.join(directory, file.name);
                await firstRecursiveApproach(subdirectory);
            }
        }
    } catch (error) {
        console.error(`Error during basic recursive approach: ${directory}:`, error);
    }
}

// List all the paths, then call info
let dirs = [];

// Traverse all the subdirs and save absolute paths
function ThroughDirectory(directory) {
    fs.readdirSync(directory).forEach(file => {
        const absolute = path.join(directory, file);
        if (fs.statSync(absolute).isDirectory()) {   
                dirs.push(absolute);
                return ThroughDirectory(absolute);
        }
    });
}

// For each of the subdirs create info
async function secondRecursiveApproach(directory) {
    dirs.length = 0;

    dirs.push(directory);

    ThroughDirectory(directory);
    
    for(dr of dirs)
        await createInfoFile(dr);
}

module.exports = {
    firstRecursiveApproach,
    secondRecursiveApproach
};