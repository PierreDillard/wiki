function openModal(keyword, definition, displayedTerm) {
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const modalDefinition = document.getElementById("modal-definition");
  const modalLink = document.getElementById("modal-link");
  const categoryTagElement = document.getElementById("category-tag");

  if (modalTitle && modalDefinition && modalLink) {
    let descriptionText, aliasesText, categoryInfo;
    if (typeof definition === "object") {
      descriptionText = definition.description || "Definition not available";
      levelText = definition.level || "N/A";
      categoryInfo = definition.category;
      aliasesText =
        definition.aliases && definition.aliases.length > 0
          ? definition.aliases
              .filter((alias) => alias !== displayedTerm && alias !== keyword)
              .join(", ")
          : "";

      console.log("categoryInfo", categoryInfo);
   /*  } else if (typeof definition === "string") {
      descriptionText = definition;
      aliasesText = "";
    } */ } else {
      descriptionText = "Definition not available";
      aliasesText = "";
    }

    const glossaryPageUrl = `${
      window.location.origin
    }/glossary/${keyword.toLowerCase()}/`;

    if (window.innerWidth <= 1040) {
      window.location.href = glossaryPageUrl;
    } else {
      let titleText = displayedTerm || keyword;
      let categoryIcon = '';
      let categoryTag = '';

      if (categoryInfo) {
        console.log("Generating category tag for:", categoryInfo);
        const categoryClass = `category-tag category-${categoryInfo
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/^-+|-+$/g, '')}`;
          console.log("Category class:", categoryClass);
        categoryTagElement.innerHTML = `<span class="${categoryClass}">${categoryInfo}</span>`;
        categoryTagElement.classList.remove("hidden");
        categoryTagElement.classList.add("visible");

        switch(definition.category) {
          case 'GPAC Core':
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

      
        categoryTag = `<div class="category-container"><span class="${categoryClass}">${categoryInfo}</span></div>`;
      } else {
        categoryTagElement.innerHTML = "";
        categoryTagElement.classList.remove("visible");
        categoryTagElement.classList.add("hidden");
      }

      modalTitle.innerHTML = `${categoryIcon} ${titleText}`;
      if (displayedTerm.toUpperCase() !== keyword.toUpperCase()) {
        modalTitle.innerHTML += ` <span class="alias-indicator">(alias of ${keyword})</span>`;
      }

      let modalContent = `
        <p><strong>Definition:</strong> ${descriptionText}</p>
      `;

      if (aliasesText) {
        modalContent += `<p><strong>Other aliases:</strong> <span class="alias-text">${aliasesText}</span></p>`;
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
