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
function openModal(keyword, definition) {
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const modalDefinition = document.getElementById("modal-definition");
  

    if (modalTitle && modalDefinition) {
        modalTitle.textContent = keyword;
        modalDefinition.textContent = definition;
        modal.classList.remove("hidden");
        modal.style.display = "block";

     
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

    // Initial state
    tocContent.style.display = "none";
    navContent.style.display = "block";
});