
function fetchKeywords(currentPageMdPath, cachedKeywords, cachedDefinitions) {
    fetch('/data/keywords.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const allDefinitions = data.definitions;
            const lexique = Object.keys(allDefinitions);
            
            // Créer aliasMap
            const aliasMap = new Map();
            for (const [term, definition] of Object.entries(allDefinitions)) {
                if (definition.aliases) {
                    definition.aliases.forEach(alias => {
                        aliasMap.set(alias.toUpperCase(), term.toUpperCase());
                    });
                }
            }

            findKeywordsInContent(currentPageMdPath, lexique, aliasMap, (filteredKeywords) => {
                cachedKeywords[currentPageMdPath] = filteredKeywords;
                setCache('keywordsCache', cachedKeywords);
                const selectedLevel = localStorage.getItem('userLevel') || 'expert';
                displayKeywords(filteredKeywords, cachedDefinitions, allDefinitions, selectedLevel);
            });
        })
        .catch(error => console.error('Error fetching keywords:', error));
}

function fetchDefinitions(keyword, cachedDefinitions) {
    fetch('/data/keywords.json')
        .then(response => response.json())
        .then(data => {
            const definition = data.definitions[keyword];
            if (definition) {
                cachedDefinitions[keyword] = definition;
                setCache('definitionsCache', cachedDefinitions);
                openModal(keyword, definition);
            } else {
                console.error('Definition not found for keyword:', keyword);
            }
        })
        .catch(error => console.error('Error fetching definition:', error));
}

//Get the Markdown content
function fetchMarkdownContent(currentPageMdPath) {
    return fetch(currentPageMdPath)
        .then(response => {
            return response.text();
        })
        .then(htmlContent => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');
            const mdContent = doc.querySelector('.md-content[data-md-component="content"]');
            if (mdContent) {
                return mdContent.textContent;
            } else {
                console.warn(`Content element not found in the parsed HTML`);
                return '';
            }
        })
        .catch(error => {
            console.error('Error fetching markdown content:', error);
            throw error; 
        });
}