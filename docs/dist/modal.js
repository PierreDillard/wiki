"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openModal = openModal;
function openModal(keyword, definition) {
  var modal = document.getElementById("modal");
  var modalTitle = document.getElementById("modal-title");
  var modalDefinition = document.getElementById("modal-definition");
  if (modalTitle && modalDefinition) {
    modalTitle.textContent = keyword;
    modalDefinition.textContent = definition;
    modal.classList.remove("hidden");
    modal.style.display = "block";
  } else {
    console.error('Modal elements not found');
  }
}
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("close-modal").addEventListener("click", function () {
    var modal = document.getElementById("modal");
    modal.classList.add("hidden");
    modal.style.display = "none";
  });
  document.getElementById("modal").addEventListener("click", function (event) {
    if (event.target === event.currentTarget) {
      var modal = document.getElementById("modal");
      modal.classList.add("hidden");
      modal.style.display = "none";
    }
  });
  window.openModal = openModal;
});