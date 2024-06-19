"use strict";

var _cache = require("./cache.js");
var _fetch = require("./fetch.js");
document.addEventListener('DOMContentLoaded', function () {
  var cachedKeywords = (0, _cache.getCache)('keywordsCache');
  var cachedDefinitions = (0, _cache.getCache)('definitionsCache');
  var currentPagePath = window.location.pathname;
  if (currentPagePath.endsWith('/')) {
    currentPagePath = currentPagePath.slice(0, -1);
  }
  var currentPageMdPath = currentPagePath.replace('.html', '.md');
  console.log('Current page Markdown path:', currentPageMdPath);
  (0, _fetch.fetchKeywords)(currentPageMdPath, cachedKeywords, cachedDefinitions);
});