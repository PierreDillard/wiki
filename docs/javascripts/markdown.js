// markdown.js
export function fetchMarkdownContent(currentPageMdPath) {
    return fetch(currentPageMdPath)
        .then(response => response.text()) 
        .then(htmlContent => {
            const parser = new DOMParser(); // Create a new DOMParser instance
            const doc = parser.parseFromString(htmlContent, 'text/html'); // Parse the HTML content and create a document object
            const mdContent = doc.querySelector('.md-content[data-md-component="content"]'); 
            return mdContent ? mdContent.textContent : ''; // Return the text content of the Markdown element, or an empty string if not found
        })
        .catch(error => console.error('Error fetching markdown content:', error)); 
}