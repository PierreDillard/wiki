
document.addEventListener('DOMContentLoaded', function () {
    
    

    // Vérify if keywords are already cached
    let cachedKeywords = localStorage.getItem('keywordsCache');
    if (cachedKeywords) {
        cachedKeywords = JSON.parse(cachedKeywords);
    } else {
        cachedKeywords = {};
    }

    const displayKeywords = (keywords) => {
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
            li.appendChild(a);
            wordCloudList.appendChild(li);
        });
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
  
        displayKeywords(cachedKeywords[currentPageMdPath]);
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
                // cache the keywords
                Object.assign(cachedKeywords, data);
                localStorage.setItem('keywordsCache', JSON.stringify(cachedKeywords));

                // Obtain the keywords for the current page
                const keywords = cachedKeywords[currentPageMdPath] || [];
             

                displayKeywords(keywords);
            })
            .catch(error => console.error('Error fetching keywords:', error));
    }
});
