function openModal(keyword, definition, displayedTerm) {
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const modalDefinition = document.getElementById("modal-definition");
    const modalLink = document.getElementById("modal-link");

    if (modalTitle && modalDefinition && modalLink) {
        let descriptionText, levelText, aliasesText;
        if (typeof definition === 'object') {
            descriptionText = definition.description || 'Definition not available';
            levelText = definition.level || 'N/A';
            aliasesText = definition.aliases && definition.aliases.length > 0 
                ? definition.aliases.filter(alias => alias !== displayedTerm).join(', ')
                : '';
        } else if (typeof definition === 'string') {
            descriptionText = definition;
            levelText = 'N/A';
            aliasesText = '';
        } else {
            descriptionText = 'Definition not available';
            levelText = 'N/A';
            aliasesText = '';
        }

        const glossaryPageUrl = `${window.location.origin}/glossary/${keyword.toLowerCase()}/`;
      
        if (window.innerWidth <= 1040) {
            window.location.href = glossaryPageUrl;
        } else {
            modalTitle.textContent = displayedTerm || keyword;
            if (displayedTerm && displayedTerm !== keyword) {
                modalTitle.textContent += ` (alias of ${keyword})`;
            }
            
            let modalContent = `
                <p><strong>Definition:</strong> ${descriptionText}</p>
                <p><strong>Level:</strong> ${levelText}</p>
            `;

            if (aliasesText) {
                modalContent += `<p><strong>Other aliases:</strong> ${aliasesText}</p>`;
            }

            modalDefinition.innerHTML = modalContent;

            modalLink.href = glossaryPageUrl;
            modal.classList.remove("hidden");
            modal.style.display = "block";
            modalLink.classList.remove("hidden");
        }
    } else {
        console.error('Modal elements not found');
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const closeModalButton = document.getElementById("close-modal");
    if (closeModalButton) {
        closeModalButton.addEventListener("click", function () {
            const modal = document.getElementById("modal");
            modal.classList.add("hidden");
            modal.style.display = "none";
        });
    }

    const modalElement = document.getElementById("modal");
    if (modalElement) {
        modalElement.addEventListener("click", function (event) {
            if (event.target === event.currentTarget) {
                modalElement.classList.add("hidden");
                modalElement.style.display = "none";
            }
        });
    }

    window.openModal = openModal;
});