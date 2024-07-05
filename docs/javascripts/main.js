
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
            const allDefinitions = data.definitions;
            const lexique = Object.keys(allDefinitions);
            findKeywordsInContent(currentPageMdPath, lexique, (filteredKeywords) => {
                cachedKeywords[currentPageMdPath] = filteredKeywords;
                setCache('keywordsCache', cachedKeywords);
                const selectedLevel = localStorage.getItem('userLevel') || 'beginner';
                displayKeywords(filteredKeywords, cachedDefinitions, allDefinitions,selectedLevel);
                
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
// Displays keywords according to page and level selected
function displayKeywords(keywords, cachedDefinitions, allDefinitions, selectedLevel) {
    
    const wordCloudElement = document.querySelector('.words-cloud');
    const wordCloudList = document.getElementById('dynamic-words-cloud');
    wordCloudList.innerHTML = ''; 

    // styling the keywords
    const sizes = ['size-1', 'size-2', 'size-3', 'size-4', 'size-5'];
    const colors = ['color-1', 'color-2', 'color-3', 'color-4'];

  
    let displayedKeywordsCount = 0;

    // Calculate the total number of relevant keywords for the selected level
    const totalRelevantKeywords = keywords.filter(keyword => {
        const definition = allDefinitions[keyword];
        return definition && (definition.level === selectedLevel || definition.level === 'all');
    }).length;

   
    keywords.forEach((keyword, index) => {
        const definition = allDefinitions[keyword];
     
        if (definition && (definition.level === selectedLevel || definition.level === 'all')) {
            displayedKeywordsCount++;

        
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

        
            li.appendChild(a);
            wordCloudList.appendChild(li);
        }
    });

   
    if (displayedKeywordsCount > 0) {
        wordCloudElement.classList.remove('hidden');
    } else {
        wordCloudElement.classList.add('hidden');
    }

    // Log a warning if some relevant keywords couldn't be displayed
    if (displayedKeywordsCount < totalRelevantKeywords) {
        console.warn(`Some relevant keywords (${totalRelevantKeywords - displayedKeywordsCount}) could not be displayed.`);
    }
}

// Modal functions
function openModal(keyword, definition) {
    console.log('Opening modal for:', keyword);
    console.log('Definition:', definition);

    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const modalDefinition = document.getElementById("modal-definition");
    const modalLink = document.getElementById("modal-link");

    if (modalTitle && modalDefinition && modalLink) {
        

        let descriptionText;
        if (typeof definition === 'string') {
            
            descriptionText = definition;
        } else if (definition && typeof definition === 'object' && definition.description) {
         
            descriptionText = definition.description;
        } else {
         
            descriptionText = 'Definition not available';
        }
        const glossaryPageUrl = `${window.location.origin}/glossary/${keyword.toLowerCase()}/`;
      
        if (window.innerWidth <= 1040) {
            // Redirect to the glossary page if the screen width is less than or equal to 1040px
            window.location.href = glossaryPageUrl;
        } else {
        modalTitle.textContent = keyword;
        modalDefinition.textContent = descriptionText;
        modalLink.href = `${window.location.origin}/glossary/${keyword.toLowerCase()}/`;
        modal.classList.remove("hidden");
        modal.style.display = "block";
        modalLink.classList.remove("hidden");
        }
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


// Find the 20 most frequent words
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





// Main script
document.addEventListener('DOMContentLoaded', function () {
    let cachedKeywords = getCache('keywordsCache');
    let cachedDefinitions = getCache('definitionsCache');

    let currentPagePath = window.location.pathname;

    if (currentPagePath.endsWith('/')) {
        currentPagePath = currentPagePath.slice(0, -1);
    }

    const currentPageMdPath = currentPagePath.replace('.html', '.md');
   

    fetchKeywords(currentPageMdPath, cachedKeywords, cachedDefinitions);
    findMostFrequentWords(currentPageMdPath, (frequentWords) => {
        console.log('Most frequent words:', frequentWords);
        
    });
});

//Nav-Toc-Button-toogle
document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("toggle-button");
    const tocContent = document.getElementById("toc-content");
    const navContent = document.getElementById("nav-content");
    let isNavIsVisible = true;



    toggleButton.addEventListener("click", function () {
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


document.addEventListener("DOMContentLoaded", function () {
    const articleInner = document.querySelector('.md-content__inner');
    const h1Element = articleInner.querySelector('h1');
    const feedbackForm = articleInner.querySelector('.md-feedback');

    function handleAllSection(section, h2) {
        if (section.classList.contains('active')) {
            section.setAttribute('data-was-active', 'true');
        } else {
            section.removeAttribute('data-was-active');
        }
        
    }

    // to display the feedback form at the end of the article
    if (h1Element && feedbackForm) {
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

        articleContentDiv.appendChild(fragment);
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

            let collapseSection = document.createElement('div');
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

            h2.addEventListener('click', function () {
                collapseSection.classList.toggle('active');
                if (h2.dataset.level === 'all') {
                    handleAllSection(collapseSection, h2);
                }
            });
        });
    }
});

// Function to initialize "all" sections
function initializeAllSections() {
    const allSections = document.querySelectorAll('.collapse-section');
    allSections.forEach(section => {
        const h2Element = section.querySelector('h2');
        if (h2Element && h2Element.dataset.level === 'all') {
            section.classList.add('active');
            section.setAttribute('data-was-active', 'true');
            
        }
    });
}

// Call initializeAllSections after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initializeAllSections);
document.addEventListener('DOMContentLoaded', function() {
    initializeLevelManagement();
    
    // Le reste de votre code d'initialisation...
    let cachedKeywords = getCache('keywordsCache');
    let cachedDefinitions = getCache('definitionsCache');

    fetchKeywords(currentPageMdPath, cachedKeywords, cachedDefinitions);
});