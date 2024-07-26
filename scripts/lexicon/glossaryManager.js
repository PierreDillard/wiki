const { loadJsonFile, saveJsonFile } = require('./fileHandlers');
const config = require('./config');

function manageGlossaryTerms(word, definitions, count) {
    let glossaryTerms = loadJsonFile(config.IS_IT_GLOSSARY_TERM_FILE) || {};
    
    if (!definitions.hasOwnProperty(word) && count >= config.MIN_WORD_FREQUENCY) {
        if (!glossaryTerms[word]) {
            glossaryTerms[word] = { count: 1, isReviewed: false };
        } else {
            glossaryTerms[word].count = count;
        }
        saveJsonFile(config.IS_IT_GLOSSARY_TERM_FILE, glossaryTerms);
    }
}

function cleanGlossaryTerms(definitions, stopWords, commonEnglishWords) {
    let glossaryTerms = loadJsonFile(config.IS_IT_GLOSSARY_TERM_FILE) || {};
    
    console.log(`Initial number of terms in glossary: ${Object.keys(glossaryTerms).length}`);

    const termsToRemove = [];

    for (const word in glossaryTerms) {
        if (word.endsWith('S')) {
            const singularForm = word.slice(0, -1);
            if (definitions.hasOwnProperty(singularForm) || 
                commonEnglishWords.has(singularForm) || 
                stopWords.has(singularForm)) {
                termsToRemove.push(word);
                console.log(`Marking for removal: ${word} (singular form '${singularForm}' found in definitions, common words, or stop words)`);
            }
        }
    }

    termsToRemove.forEach(word => {
        delete glossaryTerms[word];
        console.log(`Removed: ${word}`);
    });

    saveJsonFile(config.IS_IT_GLOSSARY_TERM_FILE, glossaryTerms);
    console.log(`Removed ${termsToRemove.length} plural forms from is_it_glossary_term.json`);
    console.log(`Final number of terms in glossary: ${Object.keys(glossaryTerms).length}`);
}

async function reviewGlossaryTerms(definitions, stopWords, commonEnglishWords) {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let glossaryTerms = loadJsonFile(config.IS_IT_GLOSSARY_TERM_FILE) || {};

    for (const [word, data] of Object.entries(glossaryTerms)) {
        if (!data.isReviewed) {
            let answer = await new Promise(resolve => {
                rl.question(`Pour le mot "${word}" :\n1. Ajouter aux stop words\n2. Ajouter aux common English words\n3. Garder dans le glossaire\nVotre choix (1/2/3): `, resolve);
            });

            switch(answer) {
                case '1':
                    stopWords.add(word);
                    delete glossaryTerms[word];
                    console.log(`"${word}" ajouté aux stop words.`);
                    break;
                case '2':
                    commonEnglishWords.add(word);
                    delete glossaryTerms[word];
                    console.log(`"${word}" ajouté aux common English words.`);
                    break;
                case '3':
                    glossaryTerms[word].isReviewed = true;
                    console.log(`"${word}" gardé dans le glossaire.`);
                    break;
                default:
                    console.log(`Réponse non reconnue. "${word}" gardé dans le glossaire.`);
                    glossaryTerms[word].isReviewed = true;
            }
        }
    }

    rl.close();

    saveJsonFile(config.IS_IT_GLOSSARY_TERM_FILE, glossaryTerms);
    saveJsonFile(config.COMMON_WORDS_FILE, Array.from(commonEnglishWords));
    saveJsonFile(config.STOP_WORDS_FILE, Array.from(stopWords));

    console.log('Mise à jour terminée pour le glossaire, les stop words et les common English words.');
}

module.exports = {
    manageGlossaryTerms,
    cleanGlossaryTerms,
    reviewGlossaryTerms
};