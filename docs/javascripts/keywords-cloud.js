document.addEventListener('DOMContentLoaded', function () {

    // Cache keywords and definitions from local storage
    let cachedKeywords = localStorage.getItem('keywordsCache');
    if (cachedKeywords) {
        cachedKeywords = JSON.parse(cachedKeywords);
    } else {
        cachedKeywords = {};
    }

    let cachedDefinitions = localStorage.getItem('definitionsCache');
    if (cachedDefinitions) {
        cachedDefinitions = JSON.parse(cachedDefinitions);
    } else {
        cachedDefinitions = {};
    }



    const displayKeywords = (keywords) => {
        const wordCloudElement = document.querySelector('.words-cloud');
        const wordCloudList = document.getElementById('dynamic-words-cloud');
        wordCloudList.innerHTML = ''; // Clear the existing keywords

        var sizes = ['size-1', 'size-2', 'size-3', 'size-4', 'size-5'];
        var colors = ['color-1', 'color-2', 'color-3', 'color-4'];

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
                    fetch('/data/keywords.json')
                        .then(response => response.json())
                        .then(data => {
                            const definition = data.definitions[keyword];
                            if (definition) {
                                cachedDefinitions[keyword] = definition;
                                localStorage.setItem('definitionsCache', JSON.stringify(cachedDefinitions));
                                openModal(keyword, definition);
                            } else {
                                console.error('Definition not found for keyword:', keyword);
                            }
                        })
                        .catch(error => console.error('Error fetching definition:', error));
                }
            });
            document.addEventListener('DOMContentLoaded', function () {
                // Verify if keywords are already cached
                let cachedKeywords = localStorage.getItem('keywordsCache');
                if (cachedKeywords) {
                    cachedKeywords = JSON.parse(cachedKeywords);
                } else {
                    cachedKeywords = {};
                }
            
                const displayKeywords = (keywords) => {
                    const wordCloudElement = document.querySelector('.words-cloud');
                    const wordCloudList = document.getElementById('dynamic-words-cloud');
                    // Clear the existing keywords
                    wordCloudList.innerHTML = ''; 
            
                    var sizes = ['size-1', 'size-2', 'size-3', 'size-4', 'size-5'];
                    var colors = ['color-1', 'color-2', 'color-3', 'color-4'];
            
                    keywords.forEach((keyword, index) => {
                        const li = document.createElement('li');
                        const a = document.createElement('a');
                        a.href = "#";
                        a.textContent = keyword;
                        a.className = sizes[index % sizes.length] + ' ' + colors[index % colors.length];
                      
                        a.addEventListener('click', function (event) {
                            event.preventDefault();
                            if (typeof openModal === 'function') {
                                openModal(); 
                            } else {
                                console.error('openModal function is not defined');
                            }
                        });
            
                        li.appendChild(a);
                        wordCloudList.appendChild(li);
                    });
            
                    if (keywords.length > 0) {
                        wordCloudElement.classList.remove('hidden');
                    } else {
                        wordCloudElement.classList.add('hidden');
                    }
                };
            
                let currentPagePath = window.location.pathname;
            
                // delete '/' at the end of the path
                if (currentPagePath.endsWith('/')) {
                    currentPagePath = currentPagePath.slice(0, -1);
                }
            
                const currentPageMdPath = currentPagePath.replace('.html', '.md');
                console.log('Current page Markdown path:', currentPageMdPath);
            
                if (cachedKeywords[currentPageMdPath]) {
                    // If keywords are already cached, display them
                    const keywords = cachedKeywords[currentPageMdPath];
                    displayKeywords(keywords);
                } else {
                    // Fetch keywords from keywords.json
                    fetch('/data/keywords.json')
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data => {
                            // Obtain the keywords for the current page
                            const keywords = data[currentPageMdPath] || [];
                            displayKeywords(keywords);
                        })
                        .catch(error => console.error('Error fetching keywords:', error));
                }
            });
            
            li.appendChild(a);
            wordCloudList.appendChild(li);
        });

        if (keywords.length > 0) {
            wordCloudElement.classList.remove('hidden');
        } else {
            wordCloudElement.classList.add('hidden');
        }
    };

    let currentPagePath = window.location.pathname;

    // Remove '/' at the end of the path
    if (currentPagePath.endsWith('/')) {
        currentPagePath = currentPagePath.slice(0, -1);
    }

    const currentPageMdPath = currentPagePath.replace('.html', '.md');
    console.log('Current page Markdown path:', currentPageMdPath);

    if (cachedKeywords[currentPageMdPath]) {
        // If keywords are already cached, display them
        const keywords = cachedKeywords[currentPageMdPath];
        displayKeywords(keywords);
    } else {
        // Fetch keywords from keywords.json
        fetch('/data/keywords.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Obtain the keywords for the current page
                const keywords = data.pages[currentPageMdPath] || [];
                cachedKeywords[currentPageMdPath] = keywords;
                localStorage.setItem('keywordsCache', JSON.stringify(cachedKeywords));
                displayKeywords(keywords);
            })
            .catch(error => console.error('Error fetching keywords:', error));
    }
});
