

document.addEventListener('DOMContentLoaded', function () {
    

    fetch('/data/keywords.json')
        .then(response => {
            if (!response.ok) {
                
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Obtenir le chemin complet de la page actuelle
            console.log('Data:', data);
            let currentPagePath = window.location.pathname;
            console.log('Current page path:', currentPagePath);

            if (currentPagePath.endsWith('/')) {
                currentPagePath = currentPagePath.slice(0, -1);
            }

            // Remplacer .html par .md dans le chemin
            const currentPageMdPath = currentPagePath.replace('.html', '.md');
            console.log('Current page Markdown path:', currentPageMdPath);

            // Obtenir les mots-clés pour la page actuelle
            const keywords = data[currentPageMdPath] || [];
            console.log('Keywords for this page:', keywords);

            const wordCloudList = document.getElementById('dynamic-words-cloud');

            // Définir les classes pour différentes tailles et couleurs
            var sizes = ['size-1', 'size-2', 'size-3', 'size-4', 'size-5'];
            var colors = ['color-1', 'color-2', 'color-3', 'color-4'];

            // Créer des éléments de liste avec des liens pour chaque mot-clé
            keywords.forEach((keyword, index) => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = "#";
                a.textContent = keyword;
                a.className = sizes[index % sizes.length] + ' ' + colors[index % colors.length];
                li.appendChild(a);
                wordCloudList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching keywords:', error));
});
