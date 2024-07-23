const fs = require('fs');
const path = require('path');
const readline = require('readline');
const INPUT_DIRECTORY = path.join(__dirname, '../../docs');
const OUTPUT_FILE = path.join(__dirname, 'keyword_counts.json');
const TECH_TERMS_FILE = path.join(__dirname, 'technical_terms.json');
const STOP_WORDS_FILE = path.join(__dirname, 'stop_words.json');
const KEYWORDS_FILE = path.join(__dirname, '../../docs/data/keywords.json');
const IS_IT_GLOSSARY_TERM_FILE = path.join(__dirname,'is_it_glossary_term.json');
const TOP_WORDS = 600;
const MIN_WORD_LENGTH = 3;
const MIN_WORD_FREQUENCY = 5;







// Check if this is the first run of the script
let isFirstRun = !fs.existsSync(TECH_TERMS_FILE) && !fs.existsSync(STOP_WORDS_FILE);

let stopWords = new Set([
    'THE', 'A','IMPORT','WWW','EXPORT','NAME','LINK','WORK','WAY','ALLOW','TAG','CLASS','READ','FULL','DIRECTORY','AVAILABLE','DOCUMENTATION','HEIGHT','RUN','WIDTH','NULL','CASE','CANNOT','CHECK','BOTH','ETC','USAGE','COMPLEX','RANDOM','MAXIMUN','EITHER','LENGTH','BETWEEN', 'AN', 'AND', 'OR', 'BUT', 'IN', 'ON', 'AT', 'TO', 'FOR', 'OF', 'WITH', 'WHEN', 'NEW', 'THAT', 'NUMBER', 'PREVIOUS', 'SAME', 'ALSO', 'NOT','SO','LOG','INTO','THEN','KEY','STYLE','AUTO', 'HERE','MAKE','MEANS','ITS','ALWAYS','RETURN','SPECIFIES','ONE','OTHER',
    'BY', 'FROM', 'UP', 'ABOUT', 'INTO', 'OVER', 'AFTER', 'IS', 'WAS', 'WERE', 'BE', 'ONCE', 'ADD', 'LIKE', 'SEQ', 'SRC','DEFAULT','ENUM','JS','YOUR','LET','USES','DURING', 'SPECIFY', 'CUSTOM','BEFORE','SUPPORTED','DIFFERENT','MORE','ADAPTATION','WIKI','ONLY','BOOL'
    ,'BEEN', 'BEING', 'HAVE', 'HAS', 'HAD', 'DO', 'DOES', 'DID', 'WILL', 'WOULD', 'SHALL', 'USED', 'WHICH', 'DISCUSSION','SPECIFIED','THROUGH','POSSIBLE','BASED','LOADED','NONE','OTHERWISE','IGNORE','FS','IMPORTED','DONE','CONFIGURATION','WITHOUT','WANT','TWO','IMPORT','EDIT','HELP','PLAY','WRITE','DECLARED','PRODUCE','DOWNLOAD','MAX','REAL',"CURRENTLY",
    'SHOULD', 'CAN', 'COULD', 'MAY', 'MIGHT', 'MUST', 'OUGHT', 'THIS', 'EACH', 'ABOVE', 'GIVEN', 'ASSUME', 'COMMAND','FOLLOWING','NEED','IGNORE','PRINT','SEE','OUT','YOUR','LET','TRUE','TS','VALUES','DISABLED', 'SEND','CALLED','AUTOMATICALLY','UPDATABLE','ONE',
    'IT', 'WE', 'ARE', 'SOME', 'ANY', 'ALL', 'US', 'OPEN','REPLACED','MESSAGE','COM','CURRENT', 'WIKI','TEST','INSERT', 'FOUND','FUNCTION','HOW','WHERE','ENABLE','SUCH', 'AS', 'USE', 'YOU', 'GPAC', 'INFORMATION', 'IF','NON', 'EXISTING', '&&', 'END', 'WHICH','THAN','THESE','NO','MULTIPLE','REGISTER','GET','PORT','CREATE','SUPORT','IGNORED','INDICATES','SUPPORT','NEGATIVE','KEEP','TELECOM','PARISTECH','FIRST','JAVASCRIPT',
  'CREATED', 'USUALLY', 'HOWEVER', 'WARNING', 'LANGUAGE','LEFT','DISPLAY', 'SWITCHING', 'MODIFIED','EVERY', 'IMPORTING','FONT', 'CONTENT','DATA','OBJECT','PER','CHANGE','EXTENSION','SETUP','DYNAMIC','LOW','ASSIGN', 'INJECT','UNLESS','STILL', 'PYTHON','HORIZONTAL','DIRECTLY','FORWARD','LIKELY',
  'WHENEVER','MAXIMUN','ENTRY','MAIN','MAXIMUM','LEVEL','SCRIPT','PERFORM','USUAL','ANOTHER','COMPONENT','CENTER','OUR','OWN','BOTTOM','DEFINED','CHECKED','VISUAL','SIZE','PART','DETAILS','APPLY',
  'RUNNING','BLOCKING',
  'STATE',
  'SECTION',
  'SIMPLY',
  'EXPLICITLY',
  'COMPATIBILITY',
  'CORRESPONDING',
  'EQUAL',
  'TRY',
  'MASTER',
  'FILTERSGENERAL',
  'OLD',
  'GIVE',
  'RESULTING',
  'RATHER',
  'INDICATED',
  'SEVERAL',
  'VIEW',
  'CLIENT',
  'FORMATTED',
  'SPLIT',
  'ERROR',
  'REQUIRE',
  'UTC',
  'WINDOW',
  'NEEDED',
  'REFERENCE',
  'SYNTAX',
  'ELEMENT',
  'STRING',
  'INDICATE',
  'START',
  'URL',
  'FORCE',
  'GENERATED',
  'TARGET',
  'FEATURE',
  'PASS',
  'ADDED',
  'THREE',
  'SPECIFYING',
  'EMPTY',
  'EXPLICIT',
  'ENABLED',
  'TOP',
  'CANVAS',
  'CONTEXT',
  'ASSOCIATED',
  'ORG',
  'LOCATION',
'LAST','INSTEAD','USING', 'ENCODING', 'PROCESSING', 'PRESENT', 'CREATING', 'STREAMING', 'LOADING', 'INDICATING', 'GENERATING', 'STARTING', 'RENDERING', 'TIMING', 'SIGNALING', 'DECODING', 'SETTING', 'APPLYING', 'ASSOCIATING', 'UPDATING', 'CREATING', 'DECLARING', 'DESCRIBING', 'CONTAINING', 'ENCRYPTING', 'INCLUDING', 'INITIATING', 'MAINTAINING', 'MODIFYING', 'PREPROCESSING', 'RECEIVING', 'REFRAMING', 'REMOVING', 'RESOLVING', 'STORING', 'TRANSITIONING', 'USING', 'VISUALIZING',
'RIGHT',
'NEXT',
'THEIR',
'THEY',
'THEM',
'THERE',
'MOST',
'NOW',
'EVEN',
'WHILE',
'FALSE',
'INT',
'SINCE',
'EXCEPT',
'BELOW',
        
]);



// load the definitions from the keywords file
function loadDefinitions() {
    try {
        const keywordsData = JSON.parse(fs.readFileSync(KEYWORDS_FILE, 'utf-8'));
        return keywordsData.definitions || [];
    }catch (error) {
        console.error('Error loading definitions:', error) ;
        return {};
    }
}


function manageGlossaryTerms(word) {
    let glossaryTerms;
    try {
        glossaryTerms = JSON.parse(fs.readFileSync(IS_IT_GLOSSARY_TERM_FILE, 'utf-8'));
    } catch (error) {
        glossaryTerms = {};
    }
    if (!glossaryTerms[word]) {
        glossaryTerms[word] = { count: 1, isReviewed: false };
    } else {
        glossaryTerms[word].count++;
    }
    fs.writeFileSync(IS_IT_GLOSSARY_TERM_FILE, JSON.stringify(glossaryTerms, null, 2));
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
    // Liste des dossiers à ignorer
    const ignoredDirectories = ['javascripts', 'stylesheets', 'images', 'Build', 'data'];
    
    // Liste des fichiers à ignorer
    const ignoredFiles = ['aspell_dict_gpac.txt', 'check_spell.sh'];

    const items = fs.readdirSync(directoryPath);

    for (const item of items) {
        const itemPath = path.join(directoryPath, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
            // Vérify if the directory should be ignored
            const relativePath = path.relative(path.join(__dirname, '../../docs'), itemPath);
            const topLevelDirectory = relativePath.split(path.sep)[0];
            
            if (!ignoredDirectories.includes(topLevelDirectory)) {
                exploreDirectory(itemPath, contents);
            }
        } else if (stat.isFile() && path.extname(item).toLowerCase() === '.md') {
            // Vérify if the file should be ignored
            if (!ignoredFiles.includes(item)) {
                const content = fs.readFileSync(itemPath, 'utf-8');
                contents.push({ path: itemPath, content: preprocessContent(content, itemPath) });
            }
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



 function isValidWord(word, definitions,singularForm) {
    
    const MIN_WORD_LENGTH = 3; 

    // VérifY if the word is a number or too short
    if (word.length <= MIN_WORD_LENGTH || /^\d+$/.test(word)) {
        return false;
    }
    const wordToCheck = singularForm || word;

    if (definitions.hasOwnProperty(wordToCheck) || 
    stopWords.has(wordToCheck))
  {
    return false;
}

return true;
}


function extractWords(text,definitions) {
    // Match words that contain at least one letter
    const words = text.match(/\b(?=[a-zA-Z])[\w']+\b/g) || [];
    return words
        .map(cleanWord)
        .filter(word => word.length > 1 && isValidWord(word,definitions));
}

// Analyze content and count word occurrences

function analyzeContent(content,definitions) {
    const wordCounts = {};
    extractWords(content,definitions).forEach(word => {
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



    function isLikelyTechnicalTerm(word, count, totalWords) {
        const frequency = count / totalWords;
        return word.length >= MIN_WORD_LENGTH && 
               count >= MIN_WORD_FREQUENCY && 
               frequency < 0.01 && // Not too common
               !stopWords.has(word) &&
               !technicalTerms.has(word);
    }
   
    function singularizePlurals(wordCounts, fileOccurrences) {
        const singularized = {};
        const wordsToRemove = new Set();
    
        // First pass: identify potential plural forms
        for (const word of Object.keys(wordCounts)) {
            if (word.endsWith('S')) {
                const singular = word.endsWith('IES') 
                    ? word.slice(0, -3) + 'Y'
                    : word.endsWith('ES') 
                        ? word.slice(0, -1)
                        : word.slice(0, -1);
                
                if (wordCounts.hasOwnProperty(singular)) {
                    // If both singular and plural forms exist, mark plural for removal
                    wordsToRemove.add(word);
                    singularized[singular] = {
                        count: wordCounts[singular] + wordCounts[word],
                        files: new Set([...fileOccurrences[singular], ...fileOccurrences[word]])
                    };
                } else {
                    // If only plural form exists, keep it as is
                    singularized[word] = {
                        count: wordCounts[word],
                        files: fileOccurrences[word]
                    };
                }
            } else {
                // Non-plural words are added as-is
                singularized[word] = {
                    count: wordCounts[word],
                    files: fileOccurrences[word]
                };
            }
        }
    
        // Second pass: remove marked plurals and update counts
        const finalWordCounts = {};
        const finalFileOccurrences = {};
        for (const [word, data] of Object.entries(singularized)) {
            if (!wordsToRemove.has(word)) {
                finalWordCounts[word] = data.count;
                finalFileOccurrences[word] = data.files;
            }
        }
    
        return { wordCounts: finalWordCounts, fileOccurrences: finalFileOccurrences };
    }
    function displayGlossaryTermsSummary() {
        let glossaryTerms;
        try {
            glossaryTerms = JSON.parse(fs.readFileSync(IS_IT_GLOSSARY_TERM_FILE, 'utf-8'));
        } catch (error) {
            console.error('Error reading glossary terms file:', error);
            return;
        }
    
        console.log('\nPotential new technical terms:');
        for (const [word, data] of Object.entries(glossaryTerms)) {
            if (!data.isReviewed) {
                console.log(`${word} (count: ${data.count})`);
            }
        }
        console.log(`\nTotal potential new terms: ${Object.keys(glossaryTerms).filter(word => !glossaryTerms[word].isReviewed).length}`);
    }
    async function main() {
        try {
            const definitions = loadDefinitions();
            technicalTerms = loadTechnicalTerms();
            stopWords = loadStopWords();
            if (isFirstRun) {
                console.log("First run detected. All words will be considered for classification.");
            } else {
                console.log("Subsequent run detected. Only new or newly frequent words will be considered.");
            }
    
            console.log(`Total number of existing technical terms: ${technicalTerms.size}`);
            console.log(`Total number of existing stop words: ${stopWords.size}`);
            const markdownContents = analyzeMarkdownFiles(INPUT_DIRECTORY);
            console.log(`Analyzed ${markdownContents.length} Markdown files`);
    
            let wordCounts = {};
            let fileOccurrences = {};
            let totalWords = 0;
    
            for (const { content, path } of markdownContents) {
                const contentCounts = analyzeContent(content,definitions);
                for (const [word, count] of Object.entries(contentCounts)) {
                    wordCounts[word] = (wordCounts[word] || 0) + count;
                    fileOccurrences[word] = (fileOccurrences[word] || new Set()).add(path);
                    totalWords += count;
                }
            }
           
            // Apply singularization after filtering
            const singularized = singularizePlurals(wordCounts, fileOccurrences);
            wordCounts = singularized.wordCounts;
            fileOccurrences = singularized.fileOccurrences;
    
            // Filter out words that appear in only one file
            wordCounts = Object.fromEntries(
                Object.entries(wordCounts).filter(([word]) => fileOccurrences[word].size > 1)
            );
            fileOccurrences = Object.fromEntries(
                Object.entries(fileOccurrences).filter(([word]) => fileOccurrences[word].size > 1)
            );
    
      
            const topWords = getTopWords(wordCounts, TOP_WORDS);
    
            // Automatically classify words
            for (const [word, count] of Object.entries(topWords)) {
                const singularForm = Object.keys(singularized.wordCounts).find(
                    key => singularized.wordCounts[key].count === count && 
                           (key === word || singularized.wordCounts[key].files.has(word))
                );
    
                if (isValidWord(word, definitions, singularForm)) {
                    manageGlossaryTerms(singularForm || word);
                }
            }
            console.log("Classifying technical terms and stop words...");
            console.log(`Identified ${technicalTerms.size} technical terms`);
            console.log(`Identified ${stopWords.size} stop words`);
    
            await saveStopWords();
    
            fs.writeFileSync(OUTPUT_FILE, JSON.stringify(topWords, null, 2));
            console.log(`Top ${TOP_WORDS} keywords have been saved to ${OUTPUT_FILE}`);
            console.log(`Updated technical terms have been saved to ${TECH_TERMS_FILE}`);
            console.log(`Updated stop words have been saved to ${STOP_WORDS_FILE}`);
            displayGlossaryTermsSummary();
        } catch (error) {
            console.error('Error:', error);
        }
        finally {
            // Ensure the process exits after completion
            process.exit(0);
        }
    }
    
    main().then(() => console.log('Processing complete.'));
