//
const authorName = document.getElementById("authorName");
const biography = document.getElementById("authorBiography");
const nationality = document.getElementById("authorNationality");
const btnLoad = document.getElementById("buttonload");
const btnSubmit = document.getElementById("submitAuthor");
let editMode = true;
let authorId = null;
const btnPrev = document.getElementById("btn-prev");
const btnNext = document.getElementById("btn-next");
//

const modal = document.getElementById("createAuthorModal");
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
// Author Modal
document.getElementById("AddAuthor").addEventListener("click", () => {
  editMode = false;
  authorName.value = "";
  biography.value = "";
  nationality.value = "";
  openModal();
  document.getElementById("createAuthorTitle").innerHTML = "Add new author";
  btnSubmit.innerHTML = "Create Author";
});
document
  .getElementById("closeCreateAuthor")
  .addEventListener("click", () => closeModal());
document
  .getElementById("cancelCreateAuthor")
  .addEventListener("click", () => closeModal());
document
  .getElementById("authorModalOverlay")
  .addEventListener("click", () => closeModal());

async function fetchAuthors(page) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/authors?page=${page}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error : ", error);
  }
}
function renderAuthor(data) {
  let row = "";
  data.map((author) => {
    row += `
      <tr>
                <td>${author.id}</td>
                <td><strong>${author.name}</strong></td>
                <td class="truncate">${author.bio}</td>
                <td>${author.nationality}</td>

                <td>
                  <button class="action-btn btn-edit-author" aria-label="Edit author" data-id="${author.id}">
                    ✏️
                  </button>
                  <button
                    class="action-btn btn-delete-author"
                    aria-label="Delete author"
                    data-id="${author.id}"
                  >
                    🗑️
                  </button>
                </td>
    </tr>
    `;
  });
  document.getElementById("auhtorsTableBody").innerHTML = row;
}
async function handleEditAuthor(id) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/authors/${id}`);
    const data = await res.json();
    const author = data.data;
    authorName.value = author.name;
    biography.value = author.bio;
    nationality.value = author.nationality;
  } catch (error) {
    console.error("Error : ", error.message);
  }
}
async function handleSubmitAuthor(e) {
  e.preventDefault();
  let formData = new FormData();
  btnSubmit.style.display = "none";
  btnLoad.style.display = "block";
  formData.append("name", authorName.value);
  formData.append("bio", biography.value);
  formData.append("nationality", nationality.value);
  editMode ? formData.append("_method", "PUT") : null;

  try {
    let url = editMode
      ? `http://127.0.0.1:8000/api/authors/${authorId}`
      : `http://127.0.0.1:8000/api/authors`;
    const res = await fetch(url, {
      headers: {
        accept: "application/json",
      },
      body: formData,
      method: "POST",
    });
    if (!res.ok) {
      //get message from backend
      const errorData = await res.json().catch(() => ({}));
      const msg = errorData.message || "Author submit failed";

      throw new Error(msg);
    }
    const data = await res.json();
    btnSubmit.style.display = "block";
    btnLoad.style.display = "none";
    closeModal();
    Swal.fire({
      title: "Success",
      text: editMode
        ? "Edit author successfully"
        : "Create author successfully",
      icon: "success",
      confirmButtonText: "Ok",
    });
    loadPage();
    editMode = true;
  } catch (error) {
    closeModal();
    console.error(error);
    Swal.fire({
      title: "Error",
      text: error.message,
      icon: "error",
    });
  }
}
async function handleDeleteAuthor(id, row) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/authors/${id}`, {
      headers: {
        accept: "application/json",
      },
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("Delete author failed");
    }
    Swal.fire({
      title: "Success",
      text: "Delete author successfully",
      icon: "success",
      confirmButtonText: "ok",
    });
    row.remove();
  } catch (error) {
    console.error("Error : ", error);
  }
}

let currentPage = 1;
async function loadPage(page = 1) {
  const data = await fetchAuthors(page);
  !data.links.prev ? (btnPrev.disabled = true) : (btnPrev.disabled = false);
  !data.links.next ? (btnNext.disabled = true) : (btnNext.disabled = false);
  currentPage = data.meta.current_page;
  document.getElementById("current-page").innerHTML = currentPage;
  document.getElementById("total-pages").innerHTML = data.meta.last_page;
  renderAuthor(data.data);
}

// handle edit and delete
document.getElementById("auhtorsTableBody").addEventListener("click", (e) => {
  // console.log(e.target.classList.contains("btn-edit-author"));
  if (e.target.classList.contains("btn-edit-author")) {
    openModal();
    document.getElementById("createAuthorTitle").innerHTML = "Edit Author";
    btnSubmit.innerHTML = "Edit Author";
    authorId = e.target.dataset.id;
    handleEditAuthor(e.target.dataset.id);
  }
  if (e.target.classList.contains("btn-delete-author")) {
    let row = e.target.closest("tr");
    let id = e.target.dataset.id;
    Swal.fire({
      title: "Are you sure?",
      text: "This author will be delete",
      showCancelButton: true,
      icon: "question",
      confirmButtonText: "Yes, delete it",
      concelButtonText: "Cacel",
    }).then((e) => {
      if (e.isConfirmed) {
        handleDeleteAuthor(id, row);
      }
    });
  }
});

//submit author
document
  .getElementById("createAuthorForm")
  .addEventListener("submit", handleSubmitAuthor);
// Pagination
btnNext.addEventListener("click", () => loadPage(currentPage + 1));
btnPrev.addEventListener("click", () => loadPage(currentPage - 1));
// Initial load
loadPage();