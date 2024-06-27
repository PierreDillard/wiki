// Cache functions
function getCache(key) {
    let cache = localStorage.getItem(key);
    return cache ? JSON.parse(cache) : {};
}

function setCache(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Fetch functions
function fetchKeywords(currentPageMdPath, cachedKeywords, cachedDefinitions) {
    fetch('/data/keywords.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const lexique = Object.keys(data.definitions); 
            findKeywordsInContent(currentPageMdPath, lexique, (filteredKeywords) => {
                cachedKeywords[currentPageMdPath] = filteredKeywords;
                setCache('keywordsCache', cachedKeywords);
                displayKeywords(filteredKeywords, cachedDefinitions);
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

// Display functions
function displayKeywords(keywords, cachedDefinitions) {
    const wordCloudElement = document.querySelector('.words-cloud');
    const wordCloudList = document.getElementById('dynamic-words-cloud');
    wordCloudList.innerHTML = '';

    const sizes = ['size-1', 'size-2', 'size-3', 'size-4', 'size-5'];
    const colors = ['color-1', 'color-2', 'color-3', 'color-4'];

    keywords.forEach((keyword, index) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = "#";
        a.textContent = keyword;
        a.className = sizes[index % sizes.length] + ' ' + colors[index % colors.length];

        a.addEventListener('click', function (event) {
            event.preventDefault();
            if (cachedDefinitions[keyword]) {
                openModal(keyword, cachedDefinitions[keyword]);
            } else {
                fetchDefinitions(keyword, cachedDefinitions);
            }
        });
        const sidebarScrollwrap = document.querySelector(".md-sidebar__scrollwrap");
        li.appendChild(a);
        wordCloudList.appendChild(li);
    });

    if (keywords.length > 0) {
        wordCloudElement.classList.remove('hidden');
    } else {
        wordCloudElement.classList.add('hidden');
    }
}

// Modal functions
function openModal(keyword, definition ) {
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const modalDefinition = document.getElementById("modal-definition");
    const modalLink = document.getElementById("modal-link");
  

    if (modalTitle && modalDefinition && modalLink) {
        modalTitle.textContent = keyword;
        modalDefinition.textContent = definition;
        modalLink.href = `${window.location.origin}/glossary/${keyword.toLowerCase()}/`;
        modal.classList.remove("hidden");
        modal.style.display = "block";
        modalLink.classList.remove("hidden");

     
    } else {
        console.error('Modal elements not found');
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("close-modal").addEventListener("click", function () {
        const modal = document.getElementById("modal");
        modal.classList.add("hidden");
        modal.style.display = "none";

      
    });

    document.getElementById("modal").addEventListener("click", function (event) {
        if (event.target === event.currentTarget) {
            const modal = document.getElementById("modal");
            modal.classList.add("hidden");
            modal.style.display = "none";
        }
    });

    window.openModal = openModal;
});

// Keywords Finder functions
function fetchMarkdownContent(currentPageMdPath) {
    return fetch(currentPageMdPath)
        .then(response => response.text()) 
        .then(htmlContent => {
            const parser = new DOMParser(); 
            const doc = parser.parseFromString(htmlContent, 'text/html'); 
            const mdContent = doc.querySelector('.md-content[data-md-component="content"]'); 
            return mdContent ? mdContent.textContent : ''; 
        })
        .catch(error => console.error('Error fetching markdown content:', error)); 
}


function cleanMarkdownContent(content) {
    // Remove markdown links, which are of the format [text](url)
    return content.replace(/\[[^\]]*\]\([^)]*\)/g, '');
}


function cleanWord(word) {
    // Remove punctuation characters and convert the word to uppercase
    return word.replace(/[.,!?(){}[\]`-]/g, '').toUpperCase();
}



function findKeywordsInContent(currentPageMdPath, lexique, callback) {
    // Fetch the markdown content from the given file path
    fetchMarkdownContent(currentPageMdPath)
        .then(content => {
        
            const cleanContent = cleanMarkdownContent(content);
            const wordCounts = {};

            // Split the cleaned content into individual words using whitespace as the delimiter
            const words = cleanContent.split(/\s+/);

            words.forEach(word => {
                // Clean each word to ensure uniformity (e.g., lowercasing, removing punctuation)
                const cleanedWord = cleanWord(word);
                // Check if the cleaned word is in the lexicon
                if (lexique.includes(cleanedWord)) {
                    
                    wordCounts[cleanedWord] = (wordCounts[cleanedWord] || 0) + 1;
                }
            });

           
            const filteredKeywords = Object.keys(wordCounts).filter(word => wordCounts[word] >= 2);
           
            callback(filteredKeywords);
        })
        .catch(error => console.error('Error fetching markdown content:', error));
}








// Main script
document.addEventListener('DOMContentLoaded', function () {
    let cachedKeywords = getCache('keywordsCache');
    let cachedDefinitions = getCache('definitionsCache');

    let currentPagePath = window.location.pathname;

    if (currentPagePath.endsWith('/')) {
        currentPagePath = currentPagePath.slice(0, -1);
    }

    const currentPageMdPath = currentPagePath.replace('.html', '.md');
    console.log('Current page Markdown path:', currentPageMdPath);

    fetchKeywords(currentPageMdPath, cachedKeywords, cachedDefinitions);
});

//Nav-Toc-Button-toogle
document.addEventListener("DOMContentLoaded", function() {
    const toggleButton = document.getElementById("toggle-button");
    const tocContent = document.getElementById("toc-content");
    const navContent = document.getElementById("nav-content");
    let isNavIsVisible = true;

   

    toggleButton.addEventListener("click", function() {
        console.log("Button clicked");
        if (isNavIsVisible) {
            navContent.style.display = "none";
            tocContent.style.display = "block";
          
            
        } else {
            navContent.style.display = "block";
            tocContent.style.display = "none";
            
        }
        isNavIsVisible = !isNavIsVisible;
    });

    tocContent.style.display = "none";
    navContent.style.display = "block";
});
//Add spécific style to glossary pages
document.addEventListener("DOMContentLoaded", function () {

    if (window.location.pathname.includes("/glossary/")) {
      
        document.body.classList.add("glossary-page");
    }
});

//collapse-section


document.addEventListener("DOMContentLoaded", function() {
    const articleInner = document.querySelector('.md-content__inner');
    const h1Element = articleInner.querySelector('h1');
    const feedbackForm = articleInner.querySelector('.md-feedback');

    if (h1Element && feedbackForm) {
        // Create a new div with the class 'article-content'
        const articleContentDiv = document.createElement('div');
        articleContentDiv.classList.add('article-content');

        // Create a document fragment to hold the elements temporarily
        const fragment = document.createDocumentFragment();

        // Move all elements between h1Element and feedbackForm into the fragment
        let sibling = h1Element.nextElementSibling;
        while (sibling && sibling !== feedbackForm) {
            const nextSibling = sibling.nextElementSibling;
            fragment.appendChild(sibling);
            sibling = nextSibling;
        }

        // Append the fragment to the new div
        articleContentDiv.appendChild(fragment);

        // Insert the new div after the h1Element
        h1Element.insertAdjacentElement('afterend', articleContentDiv);
    }

    const articleContent = document.querySelector('.article-content');
    if (articleContent) {
        const h2Elements = articleContent.querySelectorAll('h2');
        
        h2Elements.forEach(h2 => {
            const content = [];
            let sibling = h2.nextElementSibling;
            
            while (sibling && sibling.tagName !== 'H2') {
                content.push(sibling);
                sibling = sibling.nextElementSibling;
            }

            const collapseSection = document.createElement('div');
            collapseSection.classList.add('collapse-section');

            const collapseContent = document.createElement('div');
            collapseContent.classList.add('collapse-content');
            content.forEach(element => collapseContent.appendChild(element));

            h2.parentNode.insertBefore(collapseSection, h2);
            collapseSection.appendChild(h2);
            collapseSection.appendChild(collapseContent);

            if (!h2.querySelector('.collapse-icon')) {
                const collapseIcon = document.createElement('span');
                collapseIcon.classList.add('collapse-icon');
                collapseIcon.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>';
                h2.appendChild(collapseIcon);
            }

            h2.addEventListener('click', function() {
                collapseSection.classList.toggle('active');
            });
        });
        
    }
});