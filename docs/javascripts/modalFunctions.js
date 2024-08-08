function openModal(keyword, definition, displayedTerm) {
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const modalDefinition = document.getElementById("modal-definition");
  const modalLink = document.getElementById("modal-link");

  if (modalTitle && modalDefinition && modalLink) {
    
    let descriptionText, aliasesText;
    if (typeof definition === "object") {
      descriptionText = definition.description || "Definition not available";
      levelText = definition.level || "N/A";
      aliasesText =
        definition.aliases && definition.aliases.length > 0
          ? definition.aliases
              .filter((alias) => alias !== displayedTerm)
              .join(", ")
          : "";

      console.log("aliasesText", aliasesText);
    } else if (typeof definition === "string") {
      descriptionText = definition;

      aliasesText = "";
    } else {
      descriptionText = "Definition not available";

      aliasesText = "";
    }

    const glossaryPageUrl = `${
      window.location.origin
    }/glossary/${keyword.toLowerCase()}/`;

    if (window.innerWidth <= 1040) {
      window.location.href = glossaryPageUrl;
       } else {
        modalTitle.textContent = displayedTerm || keyword;
        if (displayedTerm && displayedTerm !== keyword) {
            modalTitle.textContent += ` (alias of ${keyword})`;
        }

      let modalContent = `
                <p><strong>Definition:</strong> ${descriptionText}</p>
            `;

      if (aliasesText) {
        modalContent += `<p><strong>Other aliases:</strong> <span class="alias-text">${aliasesText}</span></p>`;

      }
     ;
     
     if (definition.category) {
        console.log(definition.category);
        const categoryClass = `category-${definition.category
          .toLowerCase()
          .replace(/\s+/g, "-")}`;
       let categoryIcon ='';

       switch(definition.category) {
        case 'GPAC Core Concepts':
          categoryIcon = '<i class="fas fa-cogs"></i>';
          break;
        case 'Streaming':
          categoryIcon = '<i class="fas fa-stream"></i>';
          break;
        case 'Video Editing':
          categoryIcon = '<i class="fas fa-film"></i>';
          break;
        case 'Audio Processing':
          categoryIcon = '<i class="fas fa-volume-up"></i>';
          break;
        case 'Content Creation':
          categoryIcon = '<i class="fas fa-paint-brush"></i>';
          break;
        case 'Interoperability':
          categoryIcon = '<i class="fas fa-exchange-alt"></i>';
          break;
        case 'Security':
          categoryIcon = '<i class="fas fa-shield-alt"></i>';
          break;
        case '3D Graphics':
          categoryIcon = '<i class="fas fa-cube"></i>';
          break;
        default:
          categoryIcon = '<i class="fas fa-tag"></i>';
      }
  
      modalTitle.innerHTML = `${categoryIcon} ${keyword}`;
      modalContent += `<div class="category-container"><span class="category-tag ${categoryClass}">${definition.category}</span></div>`;
    }

      modalDefinition.innerHTML = modalContent;

      modalLink.href = glossaryPageUrl;
      modal.classList.remove("hidden");
      modal.style.display = "block";
      modalLink.classList.remove("hidden");
    }
  } else {
    console.error("Modal elements not found");
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
