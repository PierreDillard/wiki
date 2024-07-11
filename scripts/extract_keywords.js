const fs = require('fs');
const path = require('path');
const readline = require('readline');

const INPUT_FILE = path.join(__dirname, 'gpac-wiki.json');
const OUTPUT_FILE = path.join(__dirname, 'keyword_counts.json');
const TECH_TERMS_FILE = path.join(__dirname, 'technical_terms.json');
const STOP_WORDS_FILE = path.join(__dirname, 'stop_words.json');
const TOP_WORDS = 500;

let isFirstRun = !fs.existsSync(TECH_TERMS_FILE) && !fs.existsSync(STOP_WORDS_FILE);

let stopWords = new Set([
    'THE', 'A', 'AN', 'AND', 'OR', 'BUT', 'IN', 'ON', 'AT', 'TO', 'FOR', 'OF', 'WITH', 'WHEN', 'NEW', 'THAT', 'NUMBER', 'PREVIOUS', 'SAME', 'ALSO', 'NOT','SO','LOG','INTO','THEN','KEY','STYLE','AUTO', 'HERE','MAKE','MEANS','ITS','ALWAYS','RETURN','SPECIFIES','ONE','OTHER',
    'BY', 'FROM', 'UP', 'ABOUT', 'INTO', 'OVER', 'AFTER', 'IS', 'WAS', 'WERE', 'BE', 'ONCE', 'ADD', 'LIKE', 'SEQ', 'SRC','DEFAULT','ENUM','JS','YOUR','LET','USES','DURING', 'SPECIFY', 'CUSTOM','BEFORE','SUPPORTED','DIFFERENT','MORE','ADAPTATION','WIKI','ONLY','BOOL'
    ,'BEEN', 'BEING', 'HAVE', 'HAS', 'HAD', 'DO', 'DOES', 'DID', 'WILL', 'WOULD', 'SHALL', 'USED', 'WHICH', 'DISCUSSION','SPECIFIED','THROUGH','POSSIBLE','BASED','LOADED','NONE','OTHERWISE','IGNORE','FS','IMPORTED','DONE','CONFIGURATION','WITHOUT','WANT','TWO',
    'SHOULD', 'CAN', 'COULD', 'MAY', 'MIGHT', 'MUST', 'OUGHT', 'THIS', 'EACH', 'ABOVE', 'GIVEN', 'ASSUME', 'COMMAND','FOLLOWING','NEED','IGNORE','PRINT','SEE','OUT','YOUR','LET','TRUE','TS','VALUES','DISABLED', 'SEND','CALLED','AUTOMATICALLY','UPDATABLE','ONE',
    'IT', 'WE', 'ARE', 'SOME', 'ANY', 'ALL', 'US', 'OPEN', 'FOUND', 'AS', 'USE', 'YOU', 'GPAC', 'INFORMATION', 'IF', 'EXISTING', '&&', 'END', 'WHICH','THAN','THESE','NO','MULTIPLE','REGISTER','GET','PORT','CREATE','SUPORT','IGNORED','INDICATES','SUPPORT','NEGATIVE','KEEP',
]);

let technicalTerms = new Set();

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

function cleanWord(word) {
    return word.replace(/[^\w\s]/gi, '').toUpperCase();
}

function isValidWord(word) {
    return word.length > 1 && isNaN(word) && !stopWords.has(word) && !technicalTerms.has(word);
}

function extractWords(text) {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    return words.map(cleanWord).filter(isValidWord);
}

function analyzeContent(data) {
    const wordCounts = {};

    function processItem(item) {
        if (typeof item === 'string') {
            extractWords(item).forEach(word => {
                wordCounts[word] = (wordCounts[word] || 0) + 1;
            });
        } else if (Array.isArray(item)) {
            item.forEach(processItem);
        } else if (typeof item === 'object' && item !== null) {
            Object.values(item).forEach(processItem);
        }
    }

    processItem(data);
    return wordCounts;
}
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
        console.log(`Total number of stop words: ${stopWords.size}`);
        const data = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf-8'));
        const wordCounts = analyzeContent(data);
        const topWords = getTopWords(wordCounts, TOP_WORDS);

        await promptUserForNewTerms(topWords);
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