

const path = require('path');
const config = require('./config');
const { 
    loadDefinitions, 
    loadCommonEnglishWords, 
    loadStopWords, 
    exploreDirectory, 
    saveJsonFile 
} = require('./fileHandlers');
const { singularizePlurals } = require('./wordProcessors');
const { 
    preprocessContent, 
    analyzeContent, 
    getTopWords 
} = require('./contentAnalyzers');
const { 
    manageGlossaryTerms, 
    cleanGlossaryTerms, 
    reviewGlossaryTerms 
} = require('./glossaryManager');

async function main() {
    try {
        const definitions = loadDefinitions();
        let stopWords = loadStopWords();
        const commonEnglishWords = loadCommonEnglishWords();

        console.log(`Total number of existing stop words: ${stopWords.size}`);

        const markdownContents = exploreDirectory(config.INPUT_DIRECTORY, ['javascripts', 'stylesheets', 'images', 'Build', 'data'], ['aspell_dict_gpac.txt', 'check_spell.sh']);
        console.log(`Analyzed ${markdownContents.length} Markdown files`);

        let wordCounts = {};
        let fileOccurrences = {};
        let totalWords = 0;

        for (const { content, path } of markdownContents) {
            const preprocessedContent = preprocessContent(content, path);
            const contentCounts = analyzeContent(preprocessedContent, definitions, stopWords, commonEnglishWords);
            for (const [word, count] of Object.entries(contentCounts)) {
                wordCounts[word] = (wordCounts[word] || 0) + count;
                fileOccurrences[word] = (fileOccurrences[word] || new Set()).add(path);
                totalWords += count;
            }
        }

        const singularized = singularizePlurals(wordCounts, fileOccurrences);
        wordCounts = singularized.wordCounts;
        fileOccurrences = singularized.fileOccurrences;

        wordCounts = Object.fromEntries(
            Object.entries(wordCounts).filter(([word, count]) => 
                fileOccurrences[word].size > 1 && count >= config.MIN_WORD_FREQUENCY
            )
        );
        fileOccurrences = Object.fromEntries(
            Object.entries(fileOccurrences).filter(([word]) => fileOccurrences[word].size > 1)
        );

        const topWords = getTopWords(wordCounts, config.TOP_WORDS, config.MIN_WORD_FREQUENCY);

        for (const [word, count] of Object.entries(topWords)) {
            manageGlossaryTerms(word, definitions, count);
        }

        console.log("Classifying technical terms and stop words...");
        console.log(`Identified ${stopWords.size} stop words`);

        saveJsonFile(config.STOP_WORDS_FILE, Array.from(stopWords));
        saveJsonFile(config.OUTPUT_FILE, topWords);

        cleanGlossaryTerms(definitions, stopWords, commonEnglishWords);
        
        console.log(`Top ${config.TOP_WORDS} keywords have been saved to ${config.OUTPUT_FILE}`);
        console.log(`Updated stop words have been saved to ${config.STOP_WORDS_FILE}`);

        await reviewGlossaryTerms(definitions, stopWords, commonEnglishWords);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit(0);
    }
}

main().then(() => console.log('Processing complete.'));