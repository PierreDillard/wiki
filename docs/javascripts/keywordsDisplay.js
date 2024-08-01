function displayKeywords(keywords, cachedDefinitions, allDefinitions, selectedLevel) {
    const wordCloudElement = document.querySelector('.words-cloud');
    const wordCloudList = document.getElementById('dynamic-words-cloud');
    wordCloudList.innerHTML = ''; 

    const sizes = ['size-1', 'size-2', 'size-3', 'size-4', 'size-5'];
    const colors = ['color-1', 'color-2', 'color-3', 'color-4'];

    let displayedKeywordsCount = 0;

    keywords.forEach((keywordInfo, index) => {
        const definition = allDefinitions[keywordInfo.term];
        if (definition && (definition.level === selectedLevel || definition.level === 'all')) {
            displayedKeywordsCount++;

            let displayTerm = keywordInfo.mostFrequentAlias && keywordInfo.aliasCount > keywordInfo.count
                ? keywordInfo.mostFrequentAlias
                : keywordInfo.term;

            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = "#";
            a.textContent = displayTerm;
            a.className = sizes[index % sizes.length] + ' ' + colors[index % colors.length];

            a.addEventListener('click', function (event) {
                event.preventDefault();
                if (cachedDefinitions[keywordInfo.term]) {
                    openModal(keywordInfo.term, cachedDefinitions[keywordInfo.term], displayTerm);
                } else {
                    fetchDefinitions(keywordInfo.term, cachedDefinitions, displayTerm);
                }
            });

            li.appendChild(a);
            wordCloudList.appendChild(li);
        }
    });

    if (displayedKeywordsCount > 0) {
        wordCloudElement.classList.remove('hidden');
    } else {
        wordCloudElement.classList.add('hidden');
    }
}

function findKeywordsInContent(currentPageMdPath, lexique, aliasMap, callback) {
    fetchMarkdownContent(currentPageMdPath)
        .then(content => {
            const cleanContent = cleanMarkdownContent(content);
            const wordCounts = {};

            const words = cleanContent.split(/\s+/);

            words.forEach(word => {
                const cleanedWord = cleanWord(word);
                // Vérifier si aliasMap est un objet ou une Map
                const mainTerm = (aliasMap instanceof Map) 
                    ? (aliasMap.get(cleanedWord) || cleanedWord)
                    : (aliasMap[cleanedWord] || cleanedWord);

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
                    aliasCount: mostFrequentAlias[1]
                };
            }).filter(entry => entry.count >= 2 || entry.aliasCount >= 2);

            callback(filteredKeywords);
        })
        .catch(error => console.error('Error fetching markdown content:', error));
}