// variable declare
let title = document.getElementById("bookTitle");
let genre = document.getElementById("bookGenre");
let bookISBN = document.getElementById("bookISBN");
let bookPublished = document.getElementById("bookPublished");
let total_copy = document.getElementById("total_copy");
let available_copy = document.getElementById("available_copy");
let price = document.getElementById("price");
let bookDescription = document.getElementById("bookDescription");
let active = document.getElementById("active");
let inactive = document.getElementById("inactive");
let bookCover = document.getElementById("bookCover");
let authorName = document.getElementById("authorName");
let authorId = document.getElementById("author_id");
let btnLoad = document.getElementById("buttonload");
let bookId = { id: null };
let editMode = false;
//
//modal
const modal = document.getElementById("createBookModal");
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
// Book Modal
document.getElementById("createBookBtn").addEventListener("click", () => {
  openModal();
  document.getElementById("createBookTitle").innerHTML = "Add New Book";
  document.getElementById("create_book_submit").innerHTML = "Create Book";
  // btnLoad.innerHTML = `<i class="fa fa-spinner fa-spin" style="margin-right: 5px;"></i>Create Book`;
  console.log(btnLoad);
  editMode = false;
  title.value = "";
  genre.value = "";
  bookISBN.value = "";
  bookPublished.value = "";
  total_copy.value = "";
  available_copy.value = "";
  price.value = "";
  bookDescription.value = "";
  active.checked = false;
  inactive.checked = false;
  authorName.value = "";
  authorId.value = "";
});

document
  .getElementById("closeCreateBook")
  .addEventListener("click", () => closeModal());
document
  .getElementById("cancelCreateBook")
  .addEventListener("click", () => closeModal());
document
  .getElementById("bookModalOverlay")
  .addEventListener("click", () => closeModal());

let timer;
// handle typing in author input
let selectedAuthor = { id: null, name: "" };
document.getElementById("authorName").addEventListener("input", (e) => {
  clearTimeout(timer);
  const keyword = e.target.value.trim();

  if (keyword.length < 2) {
    document.getElementById("authorList").innerHTML = "";
    return;
  }

  timer = setTimeout(() => {
    fetch(
      `http://127.0.0.1:8000/api/authors?search=${encodeURIComponent(keyword)}`
    )
      .then((res) => res.json())
      .then((data) => {
        const list = document.getElementById("authorList");
        list.innerHTML = "";
        let author = data.data;
        author.forEach((e) => {
          const li = document.createElement("li");
          li.textContent = e.name;

          li.onclick = () => {
            document.getElementById("authorName").value = e.name;
            document.getElementById("author_id").value = e.id;
            list.innerHTML = "";
            selectedAuthor.id = e.id;
            selectedAuthor.name = e.name;
          };
          list.appendChild(li);
        });
      })
      .catch((err) => console.error(err));
  }, 300); // waits 300ms after typing
});

//get data book display table
let currentPage = 1;
let prevPage = document.getElementById("btn_prev");
let nextPage = document.getElementById("btn_next");
let pageInfor = document.getElementById("current_page");
let totalPages = document.getElementById("totalPages");
function loadPage(page = 1) {
  try {
    fetch(`http://127.0.0.1:8000/api/books?page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        let books = data.data;
        console.log(data);
        document.getElementById("booksTableBody").innerHTML = "";
        books.map((book) => {
          document.getElementById("booksTableBody").innerHTML += `
           <tr id="booksTable">
                <td>
                  <a href='/book_infor.html?id=${book.id}'>
                    <img
                      src="${book.cover_image}"
                      alt="Book cover"
                      class="book-cover"
                    />
                  </a>
                </td>
                <td class="truncate"><strong>${book.title}</strong></td>
                <td>${book.author.name}</td>
                <td>${book.genre}</td>
                <td class="truncate">
                ${book.description}
                </td>
                <td class="truncate">${book.isbn}</td>
                <td>${book.total_copies}</td>
                <td>${book.available_copies}</td>
                <td><span class="status-chip available">${book.status}</span></td>
                <td>${book.published_at}</td>
                <td>
                  <button class="action-btn edit-btn" data-id=${book.id} id="btn_edit" aria-label="Edit book">
                    ✏️
                  </button>
                  <button
                    class="action-btn delete-btn"  aria-label="Delete book" data-id=${book.id} id="btn_delete"
                  >
                    🗑️
                  </button>
                </td>
              </tr>   
        `;
        });
        prevPage.disabled = !data.links.prev;
        currentPage = data.meta.current_page;
        nextPage.disabled = !data.links.next;
        pageInfor.innerHTML = currentPage;
        totalPages.innerHTML = data.meta.last_page;
        //get specific book id when click button edit
        let btnEdits = document.querySelectorAll("#btn_edit");
        btnEdits.forEach((btn) => {
          btn.addEventListener("click", (e) => {
            book_id = e.target.dataset.id;
            bookId.id = book_id;
            //Open modal for edit book
            openModal();
            document.getElementById("createBookTitle").innerHTML = "Edit book";
            document.getElementById("create_book_submit").innerHTML =
              "Edit Book Save";
            //   btnLoad.innerHTML = `<i class="fa fa-spinner fa-spin" style="margin-right: 5px;"></i>Edit Book`;
            // ("Edit Book Save");
            editMode = true;
            try {
              fetch(`http://127.0.0.1:8000/api/books/${book_id}`)
                .then((res) => res.json())
                .then((data) => {
                  let book = data.data;
                  title.value = book.title;
                  authorId.value = book.author.id;
                  authorName.value = book.author.name;
                  genre.value = book.genre;
                  console.log(book.genre);
                  bookISBN.value = book.isbn;
                  bookPublished.value = book.published_at;
                  total_copy.value = book.total_copies;
                  available_copy.value = book.available_copies;
                  price.value = book.price;
                  bookDescription.value = book.description;
                  book.status == "active"
                    ? (active.checked = true)
                    : (inactive.checked = true);
                });
            } catch (Error) {
              console.error(Error);
              console.error(Error.message);
            }
          });
        });
        //
        //get specific book id when click button delete
        let btnDeletes = document.querySelectorAll("#btn_delete");
        btnDeletes.forEach((btn) => {
          console.log(btn);
          btn.addEventListener("click", () => {
            let book_id = btn.dataset.id;
            Swal.fire({
              title: "Are you sure",
              text: "This book will be delete",
              icon: "question",
              showCancelButton: true,
              confirmButtonText: "ok",
            }).then((e) => {
              if (e.isConfirmed) {
                try {
                  fetch(`http://127.0.0.1:8000/api/books/${book_id}`, {
                    method: "DELETE",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      Swal.fire({
                        title: "Success",
                        text: data.message,
                        icon: "success",
                        confirmButtonText: "ok",
                      }).then((e) => {
                        if (e.isConfirmed) {
                          location.reload();
                        }
                      });
                    });
                } catch (error) {
                  console.error("Error :", error.response);
                }
              }
            });
          });
        });

        //
      });
  } catch (err) {
    console.error(err.message);
  }
}
prevPage.addEventListener("click", () => loadPage(currentPage - 1));
nextPage.addEventListener("click", () => loadPage(currentPage + 1));
document
  .getElementById("book_link")
  .addEventListener("click", () => location.reload());
loadPage();
//
// for create book and edit book submit
document
  .getElementById("createBookForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(); // create FormData from form
    editMode
      ? formData.append("author_id", authorId.value)
      : formData.append("author_id", selectedAuthor.id); // ensure author_id is included
    formData.append("title", title.value);
    formData.append("isbn", bookISBN.value);
    formData.append("genre", genre.value);
    formData.append("description", bookDescription.value);
    formData.append("published_at", bookPublished.value);
    formData.append("description", bookDescription.value);
    formData.append("total_copies", total_copy.value);
    formData.append("available_copies", available_copy.value);
    formData.append("price", price.value);
    formData.append("status", inactive.checked ? inactive.value : active.value);
    if (bookCover.files.length > 0) {
      formData.append("cover_image", bookCover.files[0]);
    }
    if (editMode) {
      formData.append("_method", "PUT");
    }
    try {
      editMode
        ? (url = `http://127.0.0.1:8000/api/books/${bookId.id}`)
        : (url = `http://127.0.0.1:8000/api/books/`);

      document.getElementById("create_book_submit").style.display = "none";
      btnLoad.disabled = true;
      console.log(btnLoad);
      btnLoad.style.display = "block";
      btnLoad.innerHTML = `<i class="fa fa-spinner fa-spin" style="margin-right: 5px;"></i>Loading`;
      const res = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Acept: "application/json", // <-- tells server we want JSON response
        },
      });
      closeModal();
      document.getElementById("create_book_submit").style.display = "block";
      btnLoad.style.display = "none";
      btnLoad.innerHTML = `<i class="fa fa-spinner fa-spin" style="margin-right: 5px;"></i>Create Book`;
      btnLoad.disabled = false;
      document.getElementById("createBookForm").reset();
      Swal.fire({
        title: "Success!",
        text: editMode ? "Book Update Successful" : "Book Create Successful",
        icon: "success",
        confirmButtonText: "ok",
      }).then((e) => {
        if (e.isConfirmed) {
          location.reload();
        }
      });
    } catch (err) {
      console.error("Error: ", err.response);
      document.getElementById("create_book_submit").style.display = "block";
      btnLoad.style.display = "none";
      alert("Error adding book");
    }
  });
//
