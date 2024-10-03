let closeModalTimer;

function keepModalOpen() {
  clearTimeout(closeModalTimer);
}

function startCloseModalTimer() {
  closeModalTimer = setTimeout(closeModal, 300);
}

function openModal(keyword, definition, event = null) {
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const modalDefinition = document.getElementById("modal-definition");
  const modalLink = document.getElementById("modal-link");

  if (!modalTitle || !modalDefinition || !modalLink) {
    console.error("Modal elements not found");
    return;
  }

  setModalContent(modalTitle, modalDefinition, modalLink, keyword, definition);
  showModal(modal, modalLink);

  modal.addEventListener("mouseenter", keepModalOpen);
  modal.addEventListener("mouseleave", startCloseModalTimer);
}

function setModalContent(modalTitle, modalDefinition, modalLink, keyword, definition) {
  let descriptionText = "Definition not available";
  if (typeof definition === "string") {
    descriptionText = definition;
  } else if (definition && typeof definition === "object" && definition.description) {
    descriptionText = definition.description;
  }

  const glossaryPageUrl = `${window.location.origin}/glossary/${keyword.toLowerCase()}/`;
  const tagsPageUrl = `/tags/#${keyword.toLowerCase()}`;

  modalTitle.textContent = keyword;
  modalTitle.onclick = function () {
    window.location.href = tagsPageUrl;
  };

  // Clear previous content
  modalDefinition.innerHTML = '';

  // Add description
  const descriptionElement = document.createElement('p');
  descriptionElement.textContent = descriptionText;
  modalDefinition.appendChild(descriptionElement);

  // Add aliases section
  if (definition.aliases && definition.aliases.length > 0) {
    const aliasesSection = createAliasesSection(definition.aliases);
    modalDefinition.appendChild(aliasesSection);
  }

  modalLink.href = glossaryPageUrl;
}

function createAliasesSection(aliases) {
  const aliasesSection = document.createElement("div");
  aliasesSection.classList.add("modal-aliases");

  const aliasesTitle = document.createElement("h3");
  aliasesTitle.textContent = "See also:";
  aliasesSection.appendChild(aliasesTitle);

  const aliasesList = document.createElement("ul");
  aliases.forEach((alias) => {
    const aliasItem = document.createElement("li");
    const aliasLink = createAliasLink(alias);
    aliasItem.appendChild(aliasLink);
    aliasesList.appendChild(aliasItem);
  });

  aliasesSection.appendChild(aliasesList);
  return aliasesSection;
}

function showModal(modal, modalLink) {
  modal.style.display = "block";
  modal.classList.remove("hidden");
  modalLink.classList.remove("hidden");

  setTimeout(() => {
    modal.classList.add("visible");
  }, 10);
}

function createAliasLink(alias) {
  const link = document.createElement("a");
  link.textContent = alias;
  link.href = `/tags/#${alias.toLowerCase()}`;
  link.className = "alias-link";
  return link;
}

function closeModal() {
  const modal = document.getElementById("modal");
  if (modal) {
    modal.classList.remove("visible");

    setTimeout(() => {
      modal.style.display = "none";
    }, 300);
  }
}
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("close-modal").addEventListener("click", function () {
    const modal = document.getElementById("modal");
    modal.classList.add("hidden");
    modal.style.display = "none";
  });


  document.getElementById("modal").addEventListener("click", function (event) {
    if (event.target === event.currentTarget) {
      const modal = document.getElementById("modal");
      modal.classList.add("hidden");
      modal.style.display = "none";
    }
  });

  window.openModal = openModal;
  window.closeModal = closeModal;
});

window.addEventListener('resize', function() {
  const modal = document.getElementById("modal");
  if (modal.style.display === "block") {
    // Recalculate position
    const wordCloudElement = document.querySelector('.words-cloud');
    const wordCloudRect = wordCloudElement.getBoundingClientRect();
    const modalRect = modal.getBoundingClientRect();

    modal.style.left = `${wordCloudRect.left + (wordCloudRect.width - modalRect.width) / 2}px`;
    modal.style.top = `${wordCloudRect.bottom + window.scrollY + 10}px`;
  }
});