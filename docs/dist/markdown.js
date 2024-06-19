"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchMarkdownContent = fetchMarkdownContent;
// markdown.js
function fetchMarkdownContent(currentPageMdPath) {
  return fetch(currentPageMdPath).then(function (response) {
    return response.text();
  }).then(function (htmlContent) {
    var parser = new DOMParser(); // Create a new DOMParser instance
    var doc = parser.parseFromString(htmlContent, 'text/html'); // Parse the HTML content and create a document object
    var mdContent = doc.querySelector('.md-content[data-md-component="content"]');
    return mdContent ? mdContent.textContent : ''; // Return the text content of the Markdown element, or an empty string if not found
  })["catch"](function (error) {
    return console.error('Error fetching markdown content:', error);
  });
}