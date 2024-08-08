function cleanMarkdownContent(content) {
    return content.replace(/\[[^\]]*\]\([^)]*\)/g, '');
}

function cleanWord(word) {
    return word.replace(/[.,!?(){}[\]`-]/g, '').toUpperCase();
}

function findKeywordsInContent(currentPageMdPath, lexique, aliasMap, callback) {
    fetchMarkdownContent(currentPageMdPath)
        .then(content => {
            const cleanContent = cleanMarkdownContent(content);
            const wordCounts = {};

            const words = cleanContent.split(/\s+/);

            words.forEach(word => {
                const cleanedWord = cleanWord(word);
                const mainTerm = aliasMap.get(cleanedWord) || cleanedWord;

                if (lexique.includes(mainTerm)) {
                    if (!wordCounts[mainTerm]) {
                        wordCounts[mainTerm] = { main: 0, aliases: {} };
                    }
                    if (cleanedWord === mainTerm) {
                        wordCounts[mainTerm].main++;
                    } else {
                        wordCounts[mainTerm].aliases[cleanedWord] = (wordCounts[mainTerm].aliases[cleanedWord] || 0) + 1;
                    }
                }
            });

            const filteredKeywords = Object.entries(wordCounts).map(([term, counts]) => {
                const aliasEntries = Object.entries(counts.aliases);
                const mostFrequentAlias = aliasEntries.reduce((max, current) => 
                    current[1] > max[1] ? current : max, ['', 0]);
                
                return {
                    term,
                    count: counts.main,
                    mostFrequentAlias: mostFrequentAlias[0],
                    aliasCount: mostFrequentAlias[1],
                    isAlias: mostFrequentAlias[1] > counts.main
                };
            }).filter(entry => entry.count >= 2 || entry.aliasCount >= 2);

            callback(filteredKeywords);
        })
        .catch(error => console.error('Error fetching markdown content:', error));
}