document.addEventListener("DOMContentLoaded", function () {
    const openModal = (keyword, definition) => {
        const modal = document.getElementById("modal");
        const modalTitle = document.getElementById("modal-title");
        const modalDefinition = document.getElementById("modal-definition");

        if (modalTitle && modalDefinition) {
            // Update the modal title and definition
            modalTitle.textContent = keyword;
            modalDefinition.textContent = definition;

            modal.classList.remove("hidden");
            modal.style.display = "block";
        } else {
            console.error('Modal elements not found');
        }
    };

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
});
