"use strict";

var _require = require("./keywordsFinder"),
  cleanMarkdownContent = _require.cleanMarkdownContent;
function testCleanMarkdownContent() {
  var testContent = "This is a [link](https://example.com) and some **bold** text.";
  var cleanedContent = cleanMarkdownContent(testContent);
  console.log("Original: ".concat(testContent));
  console.log("Cleaned: ".concat(cleanedContent));
}
testCleanMarkdownContent();