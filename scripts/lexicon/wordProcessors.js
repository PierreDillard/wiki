const config = require('./config');

function cleanWord(word) {
      // Remove all non-alphanumeric characters and convert to uppercase
    return word.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

function isValidWord(word, definitions, singularForm, stopWords, commonEnglishWords) {
      // Check if the word is longer than the minimum length and not just a number
    if (word.length <= config.MIN_WORD_LENGTH || /^\d+$/.test(word)) {
        return false;
    }
    
    const wordToCheck = singularForm || word;
    
    return !(definitions.hasOwnProperty(wordToCheck) || 
             stopWords.has(wordToCheck) || 
             commonEnglishWords.has(wordToCheck));
}

function extractWords(text, definitions, stopWords, commonEnglishWords, aliasMap) {
    // Match words that contain at least one letter
    
    const words = text.match(/\b(?=[a-zA-Z])[\w']+\b/g) || [];
    return words
        .map(cleanWord)
        .map(word => aliasMap.get(word) || word)
        .filter(word => word.length > 1 && isValidWord(word, definitions, null, stopWords, commonEnglishWords));
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
                wordsToRemove.add(word);
                singularized[singular] = {
                    count: wordCounts[singular] + wordCounts[word],
                    files: new Set([...fileOccurrences[singular], ...fileOccurrences[word]])
                };
            } else {
                singularized[word] = {
                    count: wordCounts[word],
                    files: fileOccurrences[word]
                };
            }
        } else {
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

module.exports = {
    cleanWord,
    isValidWord,
    extractWords,
    singularizePlurals
};