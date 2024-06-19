"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.displayKeywords = displayKeywords;
var _fetch = require("./fetch.js");
var _modal = require("./modal.js");
function displayKeywords(keywords, cachedDefinitions) {
  var wordCloudElement = document.querySelector('.words-cloud');
  var wordCloudList = document.getElementById('dynamic-words-cloud');
  wordCloudList.innerHTML = '';
  var sizes = ['size-1', 'size-2', 'size-3', 'size-4', 'size-5'];
  var colors = ['color-1', 'color-2', 'color-3', 'color-4'];
  keywords.forEach(function (keyword, index) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = "#";
    a.textContent = keyword;
    a.className = sizes[index % sizes.length] + ' ' + colors[index % colors.length];
    a.addEventListener('click', function (event) {
      event.preventDefault();
      if (cachedDefinitions[keyword]) {
        (0, _modal.openModal)(keyword, cachedDefinitions[keyword]);
      } else {
        (0, _fetch.fetchDefinitions)(keyword, cachedDefinitions);
      }
    });
    li.appendChild(a);
    wordCloudList.appendChild(li);
  });
  if (keywords.length > 0) {
    wordCloudElement.classList.remove('hidden');
  } else {
    wordCloudElement.classList.add('hidden');
  }
}