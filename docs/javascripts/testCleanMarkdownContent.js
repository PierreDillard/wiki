const { cleanMarkdownContent } = require("./keywordsFinder");

function testCleanMarkdownContent() {
    const testContent = "This is a [link](https://example.com) and some **bold** text.";
    const cleanedContent = cleanMarkdownContent(testContent);
    console.log(`Original: ${testContent}`);
    console.log(`Cleaned: ${cleanedContent}`);
}

testCleanMarkdownContent();