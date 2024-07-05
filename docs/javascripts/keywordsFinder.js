function cleanMarkdownContent(content) {
    return content.replace(/\[[^\]]*\]\([^)]*\)/g, '');
}

function cleanWord(word) {
    return word.replace(/[.,!?(){}[\]`-]/g, '').toUpperCase();
}

function findKeywordsInContent(currentPageMdPath, lexique, callback) {
    fetchMarkdownContent(currentPageMdPath)
        .then(content => {
            const cleanContent = cleanMarkdownContent(content);
            const wordCounts = {};

            const words = cleanContent.split(/\s+/);

            words.forEach(word => {
                const cleanedWord = cleanWord(word);
                if (lexique.includes(cleanedWord)) {
                    wordCounts[cleanedWord] = (wordCounts[cleanedWord] || 0) + 1;
                }
            });

            const filteredKeywords = Object.keys(wordCounts).filter(word => wordCounts[word] >= 2);

            callback(filteredKeywords);
        })
        .catch(error => console.error('Error fetching markdown content:', error));
}

function findMostFrequentWords(currentPageMdPath, callback) {
    fetchMarkdownContent(currentPageMdPath)
        .then(content => {
            const cleanContent = cleanMarkdownContent(content);
            const words = cleanContent.split(/\s+/);
            
            const wordCounts = {};
            const stopWords = new Set([
                'THE', 'A', 'AN', 'AND', 'OR', 'BUT', 'IN', 'ON', 'AT', 'TO', 'FOR', 'OF', 'WITH','WHEN','NEW','THAT','NUMBER', 'PREVIOUS','SAME','ALSO','NOT',
                'BY', 'FROM', 'UP', 'ABOUT', 'INTO', 'OVER', 'AFTER', 'IS', 'WAS', 'WERE', 'BE','ONCE','ADD','LIKE','SEQ','SRC',
                'BEEN', 'BEING', 'HAVE', 'HAS', 'HAD', 'DO', 'DOES', 'DID', 'WILL', 'WOULD', 'SHALL','USED','WICH','DISCUSION',
                'SHOULD', 'CAN', 'COULD', 'MAY', 'MIGHT', 'MUST', 'OUGHT', 'THIS', 'EACH', 'ABOVE', 'GIVEN','ASSUME', 'COMMAND',
                'IT', 'WE', 'ARE', 'SOME', 'ANY', 'ALL', 'US','OPEN','FOUND','AS','USE','YOU','GPAC','INFORMATION','IF','EXISTING','&&','END','WICH',
            ]);

            words.forEach(word => {
                const cleanedWord = cleanWord(word);
                if (cleanedWord.length > 1 && !stopWords.has(cleanedWord) && isNaN(cleanedWord)) {
                    wordCounts[cleanedWord] = (wordCounts[cleanedWord] || 0) + 1;
                }
            });

            const sortedWords = Object.entries(wordCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 20)  
                .map(entry => entry[0]);

            callback(sortedWords);
        })
        .catch(error => console.error('Error processing content:', error));
}