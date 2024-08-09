function cleanMarkdownContent(content) {
    return content.replace(/\[[^\]]*\]\([^)]*\)/g, '');
}

function cleanWord(word) {
    return word.replace(/[.,!?(){}[\]`-]/g, '').toUpperCase();
}

function findKeywordsInContent(currentPageMdPath, lexique, aliasMap, callback) {
    const lexiqueSet = new Set(lexique);
    
    fetchMarkdownContent(currentPageMdPath)
        .then(content => {
            const cleanContent = cleanMarkdownContent(content);
            const wordCounts = new Map();
            const words = cleanContent.match(/\S+/g) || [];

            words.forEach(word => {
                const cleanedWord = cleanWord(word);
                const mainTerm = aliasMap.get(cleanedWord) || cleanedWord;

                if (lexiqueSet.has(mainTerm)) {
                    if (!wordCounts.has(mainTerm)) {
                        wordCounts.set(mainTerm, { main: 0, aliases: new Map() });
                    }
                    const counts = wordCounts.get(mainTerm);
                    if (cleanedWord === mainTerm) {
                        counts.main++;
                    } else {
                        counts.aliases.set(cleanedWord, (counts.aliases.get(cleanedWord) || 0) + 1);
                    }
                }
            });

            const filteredKeywords = Array.from(wordCounts.entries())
                .map(([term, counts]) => {
                    const [mostFrequentAlias, aliasCount] = Array.from(counts.aliases.entries())
                        .reduce((max, current) => current[1] > max[1] ? current : max, ['', 0]);
                    
                    return {
                        term,
                        count: counts.main,
                        mostFrequentAlias,
                        aliasCount
                    };
                })
                .filter(entry => entry.count >= 2 || entry.aliasCount >= 2);

            callback(filteredKeywords);
        })
        .catch(error => console.error('Error fetching markdown content:', error));
}