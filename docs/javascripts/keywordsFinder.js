import { fetchMarkdownContent } from './markdown.js';
function cleanMarkdownContent(content) {
    return content
        .replace(/\[[^\]]*\]\([^)]*\)/g, '') // Remove links
       
 }

function cleanWord(word) {
    return word.replace(/[.,!?(){}[\]`-]/g, '').toUpperCase();
}

// CleanWord test
function testCleanWord() {
    const testWords = [
        "PID", "pid,", "pid!", "pid.", "PID)", "(PID", "PID-123", "123-PID"
    ];

    testWords.forEach(word => {
        const cleanedWord = cleanWord(word);
        console.log(`Original: ${word}, Cleaned: ${cleanedWord}`);
    });
}

testCleanWord();




export function findKeywordsInContent(currentPageMdPath, lexique, callback) {
    fetchMarkdownContent(currentPageMdPath)
        .then(content => {
            const cleanContent = cleanMarkdownContent(content);
            const wordCounts = {};

            // Regex pour délimiter les mots tout en prenant en compte les balises Markdown et le code
            const words = cleanContent.split(/\s+/);

            words.forEach(word => {
                const cleanedWord = cleanWord(word);
                if (lexique.includes(cleanedWord)) {
                    wordCounts[cleanedWord] = (wordCounts[cleanedWord] || 0) + 1;
                }
            });

            console.log("wordCounts: ", wordCounts);
            const filteredKeywords = Object.keys(wordCounts).filter(word => wordCounts[word] >= 2);
            callback(filteredKeywords);
        })
        .catch(error => console.error('Error fetching markdown content:', error));
}
