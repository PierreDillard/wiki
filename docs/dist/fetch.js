"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchDefinitions = fetchDefinitions;
exports.fetchKeywords = fetchKeywords;
var _cache = require("./cache.js");
var _display = require("./display.js");
var _keywordsFinder = require("./keywordsFinder.js");
// fetch.js

function fetchKeywords(currentPageMdPath, cachedKeywords, cachedDefinitions) {
  fetch('/data/keywords.json').then(function (response) {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  }).then(function (data) {
    var lexique = Object.keys(data.definitions); // Extraire les mots clés du lexique
    (0, _keywordsFinder.findKeywordsInContent)(currentPageMdPath, lexique, function (filteredKeywords) {
      cachedKeywords[currentPageMdPath] = filteredKeywords;
      (0, _cache.setCache)('keywordsCache', cachedKeywords);
      (0, _display.displayKeywords)(filteredKeywords, cachedDefinitions);
    });
  })["catch"](function (error) {
    return console.error('Error fetching keywords:', error);
  });
}
function fetchDefinitions(keyword, cachedDefinitions) {
  fetch('/data/keywords.json').then(function (response) {
    return response.json();
  }).then(function (data) {
    var definition = data.definitions[keyword];
    if (definition) {
      cachedDefinitions[keyword] = definition;
      (0, _cache.setCache)('definitionsCache', cachedDefinitions);
      openModal(keyword, definition);
    } else {
      console.error('Definition not found for keyword:', keyword);
    }
  })["catch"](function (error) {
    return console.error('Error fetching definition:', error);
  });
}