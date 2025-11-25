//
const authorName = document.getElementById("authorName");
const biography = document.getElementById("authorBiography");
const nationality = document.getElementById("authorNationality");
let editMode;
let authorId = null;
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
  document.getElementById("btnCreateAuthor").innerHTML = "Create Author";
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
authorName.addEventListener("input", () => {
  console.log(authorName.value);
});

let btnPrev = document.getElementById("btn-prev");
let btnNext = document.getElementById("btn-next");
let currentPage = 1;
async function loadPage(page = 1) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/authors?page=${page}`);
    const data = await res.json();
    const authors = data.data;
    console.log(data);
    document.getElementById("auhtorsTableBody").innerHTML = "";
    authors.map((author) => {
      document.getElementById("auhtorsTableBody").innerHTML += `
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
                    class="action-btn delete-btn"
                    aria-label="Delete author"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
       `;
    });
    //
    if (!data.links.prev) {
      btnPrev.disabled = true;
      btnNext.disabled = false;
    }
    if (!data.links.next) {
      btnNext.disabled = true;
      btnPrev.disabled = false;
    }
    currentPage = data.meta.current_page;
    document.getElementById("current-page").innerHTML = currentPage;
    document.getElementById("total-pages").innerHTML = data.meta.last_page;
    //
    document.querySelectorAll(".btn-edit-author").forEach((btn) => {
      btn.addEventListener("click", async () => {
        editMode = true;
        authorId = btn.dataset.id;
        openModal();
        const res = await fetch(
          `http://127.0.0.1:8000/api/authors/${authorId}`
        );
        const data = await res.json();
        const author = data.data;
        authorName.value = author.name;
        biography.value = author.bio;
        nationality.value = author.nationality;
        document.getElementById("createAuthorTitle").innerHTML = "Edit Author";
        document.getElementById("btnCreateAuthor").innerHTML = "Edit Author";
      });
    });
    //
    document
      .getElementById("createAuthorForm")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", authorName.value);
        formData.append("bio", biography.value);
        formData.append("nationality", nationality.value);
        editMode ? formData.append("_method", "PUT") : null;
        let url = editMode
          ? `http://127.0.0.1:8000/api/authors/${authorId}`
          : `http://127.0.0.1:8000/api/authors`;
        try {
          const res = await fetch(url, {
            headers: {
              Acept: "application/json",
            },
            body: formData,
            method: "POST",
          });
          const data = await res.json();
          console.log(data);
        } catch (error) {
          console.error("Error: ", error);
        }
      });

    //
  } catch (error) {
    console.error("Error :", error);
  }
}
loadPage();
btnPrev.addEventListener("click", () => loadPage(currentPage - 1));
btnNext.addEventListener("click", () => loadPage(currentPage + 1));
