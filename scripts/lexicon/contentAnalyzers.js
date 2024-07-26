const { extractWords } = require('./wordProcessors');
function preprocessContent(content, filePath) {
    if (typeof content !== 'string' || typeof filePath !== 'string') {
        throw new TypeError('Both content and filePath must be strings.');
    }

    // Function to remove patterns from content
    const removePattern = (pattern) => content.replace(pattern, '');

    // Remove code blocks
    content = removePattern(/```[\s\S]*?```/g);
    
    // Remove words between backticks 
    content = removePattern(/`[^`]+`/g);

    // Special treatment for files in the "Filters" folder
    if (filePath.includes('docs/Filters')) {
        // Remove text between '[' and ']' followed by '(URL)'
        content = removePattern(/\[.*?\]\(URL\)/g);
        
        // Remove text between '_' and '_'
        content = removePattern(/_.*?_/g);
        
        // Remove terms formatted as "- word :"
        content = removePattern(/^-\s+\w+\s*:/gm);
        
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



function analyzeContent(content, definitions, stopWords, commonEnglishWords) {
    const wordCounts = {};
    extractWords(content, definitions, stopWords, commonEnglishWords).forEach(word => {
        const normalizedWorld= word.toUpperCase();
        wordCounts[normalizedWorld] = (wordCounts[normalizedWorld] || 0) + 1;
    });
    return wordCounts;
}

function getTopWords(wordCounts, topN, minFrequency) {
    return Object.entries(wordCounts)
        .filter(([_, count]) => count >= minFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, topN)
        .reduce((acc, [word, count]) => {
            acc[word] = count;
            return acc;
        }, {});
}

module.exports = {
    preprocessContent,
    analyzeContent,
    getTopWords
};