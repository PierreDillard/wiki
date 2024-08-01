
const path = require('path');
const fs = require('fs');
const config = require('./config');

function loadJsonFile(filePath) {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (error) {
        console.error(`Error loading file ${filePath}:`, error);
        return null;
    }
}

function saveJsonFile(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}


function loadDefinitions() {
    try {
        const keywordsData = JSON.parse(fs.readFileSync(config.KEYWORDS_FILE, 'utf-8'));
        const definitions = keywordsData.definitions;
        const aliasMap = new Map();

        for (const [term, data] of Object.entries(definitions)) {
            if (data.aliases) {
                data.aliases.forEach(alias => {
                    aliasMap.set(alias.toUpperCase(), term.toUpperCase());
                });
            }
        }

        return { definitions, aliasMap };
    } catch (error) {
        console.error('Error loading definitions and aliases:', error);
        return { definitions: {}, aliasMap: new Map() };
    }
}

function loadCommonEnglishWords() {
    const words = loadJsonFile(config.COMMON_WORDS_FILE);
    return new Set(words?.map(word => word.toUpperCase()) || []);
}

function loadStopWords() {
    const defaultStopWords = new Set(/* ... */); 
    const additionalStopWords = loadJsonFile(config.STOP_WORDS_FILE) || [];
    return new Set([...defaultStopWords, ...additionalStopWords]);
}

function exploreDirectory(directoryPath, ignoredDirectories, ignoredFiles) {
    const contents = [];
    
    function explore(currentPath) {
        const items = fs.readdirSync(currentPath);
        
        for (const item of items) {
            const itemPath = path.join(currentPath, item);
            const stat = fs.statSync(itemPath);
            
            if (stat.isDirectory()) {
                const relativePath = path.relative(config.INPUT_DIRECTORY, itemPath);
                const topLevelDirectory = relativePath.split(path.sep)[0];
                
                if (!ignoredDirectories.includes(topLevelDirectory)) {
                    explore(itemPath);
                }
            } else if (stat.isFile() && path.extname(item).toLowerCase() === '.md' && !ignoredFiles.includes(item)) {
                const content = fs.readFileSync(itemPath, 'utf-8');
                contents.push({ path: itemPath, content });
            }
        }
    }
    
    explore(directoryPath);
    return contents;
}



module.exports = {
    loadJsonFile,
    saveJsonFile,
    loadDefinitions,
    loadCommonEnglishWords,
    loadStopWords,
    exploreDirectory,

};