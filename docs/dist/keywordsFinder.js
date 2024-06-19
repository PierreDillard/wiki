"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findKeywordsInContent = findKeywordsInContent;
var _markdown = require("./markdown.js");
function cleanMarkdownContent(content) {
  return content.replace(/\[[^\]]*\]\([^)]*\)/g, ''); // Remove links
}
function cleanWord(word) {
  return word.replace(/[.,!?(){}[\]`-]/g, '').toUpperCase();
}

// CleanWord test
function testCleanWord() {
  var testWords = ["PID", "pid,", "pid!", "pid.", "PID)", "(PID", "PID-123", "123-PID"];
  testWords.forEach(function (word) {
    var cleanedWord = cleanWord(word);
    console.log("Original: ".concat(word, ", Cleaned: ").concat(cleanedWord));
  });
}
testCleanWord();
function findKeywordsInContent(currentPageMdPath, lexique, callback) {
  (0, _markdown.fetchMarkdownContent)(currentPageMdPath).then(function (content) {
    var cleanContent = cleanMarkdownContent(content);
    var wordCounts = {};

    // Regex pour délimiter les mots tout en prenant en compte les balises Markdown et le code
    var words = cleanContent.split(/\s+/);
    words.forEach(function (word) {
      var cleanedWord = cleanWord(word);
      if (lexique.includes(cleanedWord)) {
        wordCounts[cleanedWord] = (wordCounts[cleanedWord] || 0) + 1;
      }
    });
    console.log("wordCounts: ", wordCounts);
    var filteredKeywords = Object.keys(wordCounts).filter(function (word) {
      return wordCounts[word] >= 2;
    });
    callback(filteredKeywords);
  })["catch"](function (error) {
    return console.error('Error fetching markdown content:', error);
  });
}