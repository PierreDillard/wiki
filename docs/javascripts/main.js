

import { getCache } from './cache.js';
import { displayKeywords } from './display.js';
import { fetchKeywords } from './fetch.js';

document.addEventListener('DOMContentLoaded', function () {
    let cachedKeywords = getCache('keywordsCache');
    let cachedDefinitions = getCache('definitionsCache');

    let currentPagePath = window.location.pathname;

    if (currentPagePath.endsWith('/')) {
        currentPagePath = currentPagePath.slice(0, -1);
    }

    const currentPageMdPath = currentPagePath.replace('.html', '.md');
    console.log('Current page Markdown path:', currentPageMdPath);

    if (cachedKeywords[currentPageMdPath]) {
        const keywords = cachedKeywords[currentPageMdPath];
        displayKeywords(keywords, cachedDefinitions);
    } else {
        fetchKeywords(currentPageMdPath, cachedKeywords, cachedDefinitions);
    }
});
