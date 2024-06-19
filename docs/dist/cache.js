"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCache = getCache;
exports.setCache = setCache;
function getCache(key) {
  var cache = localStorage.getItem(key);
  return cache ? JSON.parse(cache) : {};
}
function setCache(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}