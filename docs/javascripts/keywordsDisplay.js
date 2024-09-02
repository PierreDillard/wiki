function displayKeywords(keywords, cachedDefinitions, allDefinitions, selectedLevel) {
    const wordCloudElement = document.querySelector('.words-cloud');
    const wordCloudList = document.getElementById('dynamic-words-cloud');
    const fragment = document.createDocumentFragment();

    const sizes = ['size-1', 'size-2', 'size-3', 'size-4', 'size-5'];
    const colors = ['color-1', 'color-2', 'color-3', 'color-4'];

    let displayedKeywordsCount = 0;

    keywords.forEach((keywordInfo, index) => {
        const definition = allDefinitions[keywordInfo.term];
        if (definition && (definition.level === selectedLevel || definition.level === 'all')) {
            displayedKeywordsCount++;

            const displayTerm = keywordInfo.mostFrequentAlias && keywordInfo.aliasCount > keywordInfo.count
                ? keywordInfo.mostFrequentAlias
                : keywordInfo.term;

            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = "#";
            a.textContent = displayTerm;
            a.className = `${sizes[index % sizes.length]} ${colors[index % colors.length]}`;
            if (displayTerm !== keywordInfo.term) {
                a.classList.add('alias-term');
            }

            a.addEventListener('click', (event) => {
                event.preventDefault();
                console.log("Display term", displayTerm);   
                if (cachedDefinitions[keywordInfo.term]) {
                    openModal(keywordInfo.term, cachedDefinitions[keywordInfo.term], displayTerm);
                } else {
                    fetchDefinitions(keywordInfo.term, cachedDefinitions, displayTerm);
                }
            });

            li.appendChild(a);
            fragment.appendChild(li);
        }
    });

    wordCloudList.innerHTML = '';
    wordCloudList.appendChild(fragment);
    wordCloudElement.classList.toggle('hidden', displayedKeywordsCount === 0);
}