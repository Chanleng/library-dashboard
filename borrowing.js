let modal = document.getElementById("borrowingModal");

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
// Borrowing Modal
document.getElementById("newBtn").addEventListener("click", () => openModal());
// document
// .getElementById("quickManageBorrow")
// .addEventListener("click", () => openModal());
document
  .getElementById("closeBorrowing")
  .addEventListener("click", () => closeModal());
document
  .getElementById("cancelBorrowing")
  .addEventListener("click", () => closeModal());
document
  .getElementById("borrowingModalOverlay")
  .addEventListener("click", () => closeModal());
