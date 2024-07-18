

const path = require('path');

function preprocessContent(content, filePath) {
    // Supprimez les blocs de code
    content = content.replace(/```[\s\S]*?```/g, '');
    
    // Supprimez les mots entre backticks
    content = content.replace(/`[^`]+`/g, '');

    // Traitement spécial pour les fichiers dans le dossier "Filters"
    if (filePath.includes(path.join('docs', 'Filters'))) {
        // Supprimez le texte entre '[' et ']' suivi de '(URL)'
        content = content.replace(/\[.*?\]\(URL\)/g, '');
        
        // Supprimez le texte entre '_' et '_'
        content = content.replace(/_.*?_/g, '');
        
        // Supprimez les termes formatés comme "- mot :"
       content = content.replace(/^-\s+\w+\s*:\s*/gm, '')

        
        // Trouvez l'index de "# Options"
        const optionsIndex = content.indexOf('# Options');
        
        if (optionsIndex !== -1) {
            // Divisez le contenu en avant et après "# Options"
            const beforeOptions = content.slice(0, optionsIndex);
            let afterOptions = content.slice(optionsIndex);
            
            // Supprimez toutes les balises <a> et leur contenu seulement dans la partie après "# Options"
            afterOptions = afterOptions.replace(/<a[\s\S]*?<\/a>/g, '');
            
            // Combinez le contenu
            content = beforeOptions + afterOptions;
        }
    }

    return content;
}

module.exports = {
    preprocessContent
};
