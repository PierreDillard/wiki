// Wrap everything in an IIFE to avoid polluting the global scope
// (function() {
//     var visitedUrls = new Set();
//     var maxPages = 50; // Limite le nombre de pages à analyser pour éviter une boucle infinie

//     // Function to clean a word
//     function cleanWord(word) {
//         return word.replace(/[.,!?(){}[\]`-]/g, '').toUpperCase();
//     }

//     // Function to get all internal links from a page
//     function getInternalLinks(doc, baseUrl) {
//         var links = doc.getElementsByTagName('a');
//         var internalLinks = [];
//         for (var i = 0; i < links.length; i++) {
//             var href = links[i].getAttribute('href');
//             if (href && href.startsWith('/') && !href.startsWith('//')) {
//                 internalLinks.push(new URL(href, baseUrl).href);
//             } else if (href && href.startsWith(baseUrl)) {
//                 internalLinks.push(href);
//             }
//         }
//         return internalLinks;
//     }

//     // Function to analyze a single page
//     function analyzePageContent(url) {
//         return new Promise((resolve, reject) => {
//             if (visitedUrls.has(url)) {
//                 resolve({ keywords: [], links: [] });
//                 return;
//             }
//             visitedUrls.add(url);

//             var xhr = new XMLHttpRequest();
//             xhr.open('GET', url, true);
//             xhr.onload = function() {
//                 if (xhr.status === 200) {
//                     var parser = new DOMParser();
//                     var doc = parser.parseFromString(xhr.responseText, 'text/html');
//                     var content = doc.querySelector('.md-content');
//                     if (!content) {
//                         resolve({ keywords: [], links: [] });
//                         return;
//                     }

//                     var text = content.textContent;
//                     var words = text.split(/\s+/).map(word => cleanWord(word));
//                     var wordCounts = {};
//                     var stopWords = new Set([  'THE', 'A', 'AN', 'AND', 'OR', 'BUT', 'IN', 'ON', 'AT', 'TO', 'FOR', 'OF', 'WITH','WHEN','NEW','THAT','NUMBER', 'PREVIOUS','SAME','ALSO','NOT',
//                         'BY', 'FROM', 'UP', 'ABOUT', 'INTO', 'OVER', 'AFTER', 'IS', 'WAS', 'WERE', 'BE','ONCE','ADD','LIKE','SEQ','SRC','OUR',
//                         'BEEN', 'BEING', 'HAVE', 'HAS', 'HAD', 'DO', 'DOES', 'DID', 'WILL', 'WOULD', 'SHALL','USED',
//                         'SHOULD', 'CAN', 'COULD', 'MAY', 'MIGHT', 'MUST', 'OUGHT', 'THIS', 'EACH', 'ABOVE', 'GIVEN',
//                         'IT', 'WE', 'ARE', 'SOME', 'ANY', 'ALL', 'US','OPEN','FOUND','AS','USE','YOU','GPAC','INFORMATION','IF','EXISTING','&&','END',]);

//                     words.forEach(function(word) {
//                         if (word.length > 1 && !stopWords.has(word) && isNaN(word)) {
//                             wordCounts[word] = (wordCounts[word] || 0) + 1;
//                         }
//                     });

//                     var sortedWords = Object.keys(wordCounts).sort(function(a, b) {
//                         return wordCounts[b] - wordCounts[a];
//                     }).slice(0, 20);

//                     var links = getInternalLinks(doc, url);
//                     resolve({ keywords: sortedWords, links: links });
//                 } else {
//                     reject('Failed to load page: ' + url);
//                 }
//             };
//             xhr.onerror = function() {
//                 reject('Error fetching page: ' + url);
//             };
//             xhr.send();
//         });
//     }

//     // Main function to analyze site content
//     function analyzeSiteContent(startUrl) {
//         var allKeywords = {};
//         var urlsToVisit = [startUrl];

//         function processNextUrl() {
//             if (urlsToVisit.length === 0 || visitedUrls.size >= maxPages) {
//                 var sortedKeywords = Object.keys(allKeywords).sort(function(a, b) {
//                     return allKeywords[b] - allKeywords[a];
//                 }).slice(0, 100);

//                 localStorage.setItem('siteWideKeywords', JSON.stringify(sortedKeywords));
//                 localStorage.setItem('lastAnalysisTime', Date.now().toString());
//                 console.log('Site-wide keywords:', sortedKeywords);
//                 return sortedKeywords;
//             }

//             var currentUrl = urlsToVisit.shift();
//             return analyzePageContent(currentUrl).then(function(result) {
//                 result.keywords.forEach(function(keyword) {
//                     allKeywords[keyword] = (allKeywords[keyword] || 0) + 1;
//                 });
//                 urlsToVisit = urlsToVisit.concat(result.links.filter(url => !visitedUrls.has(url)));
//                 return processNextUrl();
//             }).catch(function(error) {
//                 console.error(error);
//                 return processNextUrl();
//             });
//         }

//         return processNextUrl();
//     }

//     function shouldRunAnalysis() {
//         var lastAnalysisTime = localStorage.getItem('lastAnalysisTime');
//         if (!lastAnalysisTime) {
//             console.log('No previous analysis found. Running analysis.');
//             return true;
//         }

//         var currentTime = Date.now();
//         var oneWeek = 7 * 24 * 60 * 60 * 1000; // One week in milliseconds
//         var timeSinceLastAnalysis = currentTime - parseInt(lastAnalysisTime);
//         var shouldRun = timeSinceLastAnalysis > oneWeek;

//         console.log('Time since last analysis:', Math.round(timeSinceLastAnalysis / (1000 * 60 * 60)), 'hours');
//         console.log('Analysis needed:', shouldRun);

//         return shouldRun;
//     }

//     // Function to run the analysis if needed
//     function runAnalysisIfNeeded(forceRun = true) {
//         if (forceRun || shouldRunAnalysis()) {
//             console.log('Starting site-wide keyword analysis...');
//             return analyzeSiteContent(window.location.origin).then(function(keywords) {
//                 console.log('Site-wide keyword analysis complete.');
//                 return keywords;
//             }).catch(function(error) {
//                 console.error('Error during site analysis:', error);
//             });
//         } else {
//             console.log('Site-wide keyword analysis skipped. Using cached results.');
//             return Promise.resolve(JSON.parse(localStorage.getItem('siteWideKeywords') || '[]'));
//         }
//     }

//     // Function to clear analysis cache
//     function clearAnalysisCache() {
//         localStorage.removeItem('lastAnalysisTime');
//         localStorage.removeItem('siteWideKeywords');
//         console.log('Analysis cache cleared');
//     }

//     // Expose functions globally
//     window.runSiteAnalysis = runAnalysisIfNeeded;
//     window.clearSiteAnalysisCache = clearAnalysisCache;

//     // Add event listener for DOMContentLoaded
//     document.addEventListener('DOMContentLoaded', function() {
//         console.log('DOM fully loaded and parsed');
//         runAnalysisIfNeeded().then(function(keywords) {
//             console.log('Analysis complete or cached results retrieved');
//             console.log('Keywords:', keywords);
//         });
//     });
// })();

// document.addEventListener('DOMContentLoaded', function() {
//     var analyzeButton = document.getElementById('analyze-site-btn');
//     if (analyzeButton) {
//         analyzeButton.addEventListener('click', function() {
//             console.log('Starting site analysis...');
//             analyzeSiteContent().then(function(keywords) {
//                 console.log('Analysis complete. Top keywords:', keywords);
//                 // Here you can add code to update your UI with the results
//             }).catch(function(error) {
//                 console.error('Error during site analysis:', error);
//             });
//         });
//     }
// });