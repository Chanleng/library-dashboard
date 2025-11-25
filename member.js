const modal = document.getElementById("createMemberModal");

function openModal() {
  if (modal) {
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    // Focus on first input
    const firstInput = modal.querySelector("input, select, textarea");
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }
}

function closeModal() {
  
  if (modal) {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  }
}

// Member Modal
document
  .getElementById("AddMember")
  .addEventListener("click", () => openModal());
document
  .getElementById("closeCreateMember")
  .addEventListener("click", () => closeModal());
document
  .getElementById("cancelCreateMember")
  .addEventListener("click", () => closeModal());
document
  .getElementById("memberModalOverlay")
  .addEventListener("click", () => closeModal());
