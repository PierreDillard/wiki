//A After the fisrt script, to process glossary terms by adding them to common English words, stop words, or keeping them in the glossary.
const readline = require ('readline');
const { loadJsonFile, saveJsonFile } = require ('./fileHandlers');
const config= require ('./config');



async function processGlossaryTerms() {


    const glossaryTerms = loadJsonFile(config.IS_IT_GLOSSARY_TERM_FILE)|| {};
    const common_english_words = loadJsonFile(config.COMMON_WORDS_FILE) || [];
    const stopWords = loadJsonFile(config.STOP_WORDS_FILE) || [];

    console.log('Loaded glossary terms:', Object.keys(glossaryTerms).length);
    console.log('Loaded common English words:', common_english_words.length);
    console.log('Loaded stop words:', stopWords.length);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    for(const[term] of Object.entries(glossaryTerms)){
        const answer = await new Promise((resolve) => {
            rl.question(`For the term "${term}" :\n1. Add to common English words\n2. Add to stop words\n3.  Keep in glossary\nYour choice (1/2/3): `, resolve);
        });

        switch(answer){
            case '1':
                common_english_words.push(term);
                delete glossaryTerms[term];
                console.log(`"${term}" added to common English words.`);
                break;
                break;
            case '2':
                stopWords.push(term);
                delete glossaryTerms[term];
                console.log(`"${term}" added to stop words.`);
                break;
            case '3':
                console.log(`"${term}" kept in glossary.`);
                break;
            default:
                console.log(`Unrecognized response. "${term}" kept in glossary.`);
        }
    }
    rl.close();

    saveJsonFile(config.IS_IT_GLOSSARY_TERM_FILE, glossaryTerms);
    saveJsonFile(config.COMMON_WORDS_FILE, common_english_words);
    saveJsonFile(config.STOP_WORDS_FILE, stopWords);

    console.log('Glossary terms processed.');
}

processGlossaryTerms()
    .then(() => {
        console.log('Script finished.');
        process.exit(0);
    })
    .catch(error => {
        console.error('Error:', error);
        process.exit(1);
    });