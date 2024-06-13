document.addEventListener('DOMContentLoaded', function () {
    var keywordsData = document.getElementById('keywords-data').textContent;
    var keywords = JSON.parse(keywordsData);

    var cloudContainer = document.getElementById('dynamic-words-cloud');
    var sizes = ['size-1', 'size-2', 'size-3', 'size-4', 'size-5'];
    var colors = ['color-1', 'color-2', 'color-3', 'color-4'];

    keywords.forEach(function (keyword, index) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = "#";
        a.textContent = keyword;
        a.className = sizes[index % sizes.length] + ' ' + colors[index % colors.length];
        li.appendChild(a);
        cloudContainer.appendChild(li);
    });
});