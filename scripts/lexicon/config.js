const path = require('path');

const rootDir = path.join(__dirname, '../..');
const docsDir = path.join(rootDir, 'docs');
const dataDir = path.join(docsDir, 'data');

module.exports = {
    INPUT_DIRECTORY: docsDir,
    OUTPUT_FILE: path.join(__dirname, 'keyword_counts.json'),
    TECH_TERMS_FILE: path.join(__dirname, 'technical_terms.json'),
    STOP_WORDS_FILE: path.join(__dirname, 'stop_words.json'),
    KEYWORDS_FILE: path.join(dataDir, 'keywords.json'),
    IS_IT_GLOSSARY_TERM_FILE: path.join(__dirname, 'is_it_glossary_term.json'),
    COMMON_WORDS_FILE: path.join(__dirname, 'common_english_words.json'),
    TOP_WORDS: 500,
    MIN_WORD_FREQUENCY: 5,
    MIN_WORD_LENGTH: 3
};