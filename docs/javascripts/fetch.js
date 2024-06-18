

import { setCache } from './cache.js';
import { displayKeywords } from './display.js';
import { openModal } from './modal.js';

export function fetchKeywords(currentPageMdPath, cachedKeywords, cachedDefinitions) {
    fetch('/data/keywords.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const keywords = data.pages[currentPageMdPath] || [];
            cachedKeywords[currentPageMdPath] = keywords;
            setCache('keywordsCache', cachedKeywords);
            displayKeywords(keywords, cachedDefinitions);
        })
        .catch(error => console.error('Error fetching keywords:', error));
}

export function fetchDefinitions(keyword, cachedDefinitions) {
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
