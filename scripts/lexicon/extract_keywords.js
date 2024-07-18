const fs = require('fs');
const path = require('path');
const readline = require('readline');
const INPUT_DIRECTORY = path.join(__dirname, '../../docs');
const FILTERS_DIRECTORY = path.join(INPUT_DIRECTORY, 'Filters');
const OUTPUT_FILE = path.join(__dirname, 'keyword_counts.json');
const TECH_TERMS_FILE = path.join(__dirname, 'technical_terms.json');
const STOP_WORDS_FILE = path.join(__dirname, 'stop_words.json');
const TOP_WORDS = 500;
const MIN_WORD_LENGTH = 3;
const MIN_WORD_FREQUENCY = 5;



// Check if this is the first run of the script
let isFirstRun = !fs.existsSync(TECH_TERMS_FILE) && !fs.existsSync(STOP_WORDS_FILE);

let stopWords = new Set([
    'THE', 'A', 'AN', 'AND', 'OR', 'BUT', 'IN', 'ON', 'AT', 'TO', 'FOR', 'OF', 'WITH', 'WHEN', 'NEW', 'THAT', 'NUMBER', 'PREVIOUS', 'SAME', 'ALSO', 'NOT','SO','LOG','INTO','THEN','KEY','STYLE','AUTO', 'HERE','MAKE','MEANS','ITS','ALWAYS','RETURN','SPECIFIES','ONE','OTHER',
    'BY', 'FROM', 'UP', 'ABOUT', 'INTO', 'OVER', 'AFTER', 'IS', 'WAS', 'WERE', 'BE', 'ONCE', 'ADD', 'LIKE', 'SEQ', 'SRC','DEFAULT','ENUM','JS','YOUR','LET','USES','DURING', 'SPECIFY', 'CUSTOM','BEFORE','SUPPORTED','DIFFERENT','MORE','ADAPTATION','WIKI','ONLY','BOOL'
    ,'BEEN', 'BEING', 'HAVE', 'HAS', 'HAD', 'DO', 'DOES', 'DID', 'WILL', 'WOULD', 'SHALL', 'USED', 'WHICH', 'DISCUSSION','SPECIFIED','THROUGH','POSSIBLE','BASED','LOADED','NONE','OTHERWISE','IGNORE','FS','IMPORTED','DONE','CONFIGURATION','WITHOUT','WANT','TWO',
    'SHOULD', 'CAN', 'COULD', 'MAY', 'MIGHT', 'MUST', 'OUGHT', 'THIS', 'EACH', 'ABOVE', 'GIVEN', 'ASSUME', 'COMMAND','FOLLOWING','NEED','IGNORE','PRINT','SEE','OUT','YOUR','LET','TRUE','TS','VALUES','DISABLED', 'SEND','CALLED','AUTOMATICALLY','UPDATABLE','ONE',
    'IT', 'WE', 'ARE', 'SOME', 'ANY', 'ALL', 'US', 'OPEN', 'FOUND', 'AS', 'USE', 'YOU', 'GPAC', 'INFORMATION', 'IF', 'EXISTING', '&&', 'END', 'WHICH','THAN','THESE','NO','MULTIPLE','REGISTER','GET','PORT','CREATE','SUPORT','IGNORED','INDICATES','SUPPORT','NEGATIVE','KEEP',
]);

let technicalTerms = new Set();

// Load previously saved technical terms
function loadTechnicalTerms() {
    try {
        const terms = JSON.parse(fs.readFileSync(TECH_TERMS_FILE, 'utf-8'));
        return new Set(terms);
    } catch (error) {
        console.log('No existing technical terms file found. Creating a new one.');
        return new Set();
    }
}

function saveTechnicalTerms() {
    fs.writeFileSync(TECH_TERMS_FILE, JSON.stringify([...technicalTerms], null, 2));
}

function loadStopWords() {
    try {
        const words = JSON.parse(fs.readFileSync(STOP_WORDS_FILE, 'utf-8'));
        console.log('Loaded additional stop words from file.');
        return new Set([...stopWords, ...words]); // Merge default and loaded stop words
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('No additional stop words file found. Using default list only.');
        } else {
            console.error('Error reading stop words file:', error);
        }
        return new Set(stopWords); // Return a new Set to avoid modifying the original
    }
}


function saveStopWords() {
    fs.writeFileSync(STOP_WORDS_FILE, JSON.stringify([...stopWords], null, 2));
}

function preprocessContent(content, filePath) {
    // Remove code blocks
    content = content.replace(/```[\s\S]*?```/g, '');
    
      // Remove words between backticks 
      content = content.replace(/`[^`]+`/g, '');

    // Special treatment for files in the "Filters" folder
    if (filePath.includes(path.join('docs', 'Filters'))) {
        // Remove text between '[' and ']' followed by '(URL)'
        content = content.replace(/\[.*?\]\(URL\)/g, '');
        
        // Remove text between '_' and '_'
        content = content.replace(/_.*?_/g, '');
        
        // Remove terms formatted as "- word :"
        content = content.replace(/^-\s+\w+\s*:/gm, '');
        
        // Find the index of "# Options"
        const optionsIndex = content.indexOf('# Options');
        
        if (optionsIndex !== -1) {
           
            const beforeOptions = content.slice(0, optionsIndex);
            let afterOptions = content.slice(optionsIndex);
            
            // Remove all <a> tags and their content only in the part after "# Options"
            afterOptions = afterOptions.replace(/<a[\s\S]*?<\/a>/g, '');
            
          
            content = beforeOptions + afterOptions;
        }
    }

    return content;
}
// Recursively explore directory and read Markdown files

function exploreDirectory(directoryPath, contents = []) {
    const items = fs.readdirSync(directoryPath);

    for (const item of items) {
        const itemPath = path.join(directoryPath, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
            exploreDirectory(itemPath, contents);
        } else if (path.extname(item).toLowerCase() === '.md') {
            const content = fs.readFileSync(itemPath, 'utf-8');
            contents.push({ path: itemPath, content: preprocessContent(content, itemPath) });
        }
    }

    return contents;
}

function analyzeMarkdownFiles(rootDirectory) {
    console.log(`Analyzing Markdown files in ${rootDirectory}`);
    return exploreDirectory(rootDirectory);
}

// Clean and uppercase a word
function cleanWord(word) {
    return word.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

// Check if a word is valid (not a stop word or technical term)
function isValidWord(word) {
    return word.length > 1 && 
           !/^\d+$/.test(word) && 
           !stopWords.has(word) && 
           !technicalTerms.has(word);
}

// Extract valid words from text

function extractWords(text) {
    // Match words that contain at least one letter
    const words = text.match(/\b(?=[a-zA-Z])[\w']+\b/g) || [];
    return words
        .map(cleanWord)
        .filter(word => word.length > 1 && isValidWord(word));
}

// Analyze content and count word occurrences

function analyzeContent(content) {
    const wordCounts = {};
    extractWords(content).forEach(word => {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
    return wordCounts;
}
// Prompt user to classify words as technical terms or not

async function promptUserForNewTerms(topWords) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log("Please review the following words and enter 'y' if it's a technical term related to GPAC or multimedia processing, or 'n' if it should be ignored:");
    
    for (const [word, count] of Object.entries(topWords)) {
        const answer = await new Promise(resolve => {
            rl.question(`Is "${word}" (count: ${count}) a technical term? (y/n): `, resolve);
        });
        
        if (answer.toLowerCase() === 'y') {
            technicalTerms.add(word);
        } else if (answer.toLowerCase() === 'n') {
            stopWords.add(word);
        }
    }

    rl.close();
}
function getTopWords(wordCounts, topN) {
    return Object.entries(wordCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, topN)
        .reduce((acc, [word, count]) => {
            acc[word] = count;
            return acc;
        }, {});
}



/* async function main() {
    try {
        technicalTerms = loadTechnicalTerms();
        stopWords = loadStopWords();
        if (isFirstRun) {
            console.log("First run detected. All words will be considered for classification.");
        } else {
            console.log("Subsequent run detected. Only new or newly frequent words will be considered.");
        }

        console.log(`Total number of existing technical terms: ${technicalTerms.size}`);
        console.log(`Total number of existing stop words: ${stopWords.size}`);
        console.log(`Total number of stop words: ${stopWords.size}`);
        const markdownContents = analyzeMarkdownFiles(INPUT_DIRECTORY);
        console.log(`Analyzed ${markdownContents.length} Markdown files`);

        let wordCounts = {};
        let fileOccurrences = {};

        for (const { content, path } of markdownContents) {
            const contentCounts = analyzeContent(content);
            for (const [word, count] of Object.entries(contentCounts)) {
                wordCounts[word] = (wordCounts[word] || 0) + count;
                // If the word is not in fileOccurence we create a new Set otherwise we add the file path .
                fileOccurrences[word] = (fileOccurrences[word] || new Set()).add(path);
            }
        }

        // Filter out words that appear in only one file
        wordCounts = Object.fromEntries(
            Object.entries(wordCounts).filter(([word]) => fileOccurrences[word].size > 1)
        );

        const topWords = getTopWords(wordCounts, TOP_WORDS);

        await promptUserForNewTerms(topWords);

        console.log("Simplifying and deduplicating technical terms...");
        const initialTermCount = technicalTerms.size;
        console.log(`Reduced from ${initialTermCount} to ${technicalTerms.size} unique terms.`);

        saveTechnicalTerms();
        saveStopWords();

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(topWords, null, 2));
        console.log(`Top ${TOP_WORDS} keywords have been saved to ${OUTPUT_FILE}`);
        console.log(`Updated technical terms have been saved to ${TECH_TERMS_FILE}`);
        console.log(`Updated stop words have been saved to ${STOP_WORDS_FILE}`);
    } catch (error) {
        console.error('Error:', error);
    }
} */

    function isLikelyTechnicalTerm(word, count, totalWords) {
        const frequency = count / totalWords;
        return word.length >= MIN_WORD_LENGTH && 
               count >= MIN_WORD_FREQUENCY && 
               frequency < 0.01 && // Not too common
               !stopWords.has(word) &&
               !technicalTerms.has(word);
    }
    
    async function main() {
        try {
            technicalTerms = loadTechnicalTerms();
            stopWords = loadStopWords();
            if (isFirstRun) {
                console.log("First run detected. All words will be considered for classification.");
            } else {
                console.log("Subsequent run detected. Only new or newly frequent words will be considered.");
            }
    
            console.log(`Total number of existing technical terms: ${technicalTerms.size}`);
            console.log(`Total number of existing stop words: ${stopWords.size}`);
            const markdownContents = analyzeMarkdownFiles(FILTERS_DIRECTORY);
            console.log(`Analyzed ${markdownContents.length} Markdown files`);
    
            let wordCounts = {};
            let fileOccurrences = {};
            let totalWords = 0;
    
            for (const { content, path } of markdownContents) {
                const contentCounts = analyzeContent(content);
                for (const [word, count] of Object.entries(contentCounts)) {
                    wordCounts[word] = (wordCounts[word] || 0) + count;
                    fileOccurrences[word] = (fileOccurrences[word] || new Set()).add(path);
                    totalWords += count;
                }
            }
    
            // Filter out words that appear in only one file
            wordCounts = Object.fromEntries(
                Object.entries(wordCounts).filter(([word]) => fileOccurrences[word].size > 1)
            );
    
            const topWords = getTopWords(wordCounts, TOP_WORDS);
    
            // Automatically classify words
            for (const [word, count] of Object.entries(topWords)) {
                if (isLikelyTechnicalTerm(word, count, totalWords)) {
                    technicalTerms.add(word);
                } else {
                    stopWords.add(word);
                }
            }
    
            console.log("Classifying technical terms and stop words...");
            console.log(`Identified ${technicalTerms.size} technical terms`);
            console.log(`Identified ${stopWords.size} stop words`);
    
            saveTechnicalTerms();
            saveStopWords();
    
            fs.writeFileSync(OUTPUT_FILE, JSON.stringify(topWords, null, 2));
            console.log(`Top ${TOP_WORDS} keywords have been saved to ${OUTPUT_FILE}`);
            console.log(`Updated technical terms have been saved to ${TECH_TERMS_FILE}`);
            console.log(`Updated stop words have been saved to ${STOP_WORDS_FILE}`);
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
    main();
