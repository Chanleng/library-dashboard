let params = new URLSearchParams(window.location.search);
console.log(params)
let book_id = params.get("id");
try {
  fetch(`http://127.0.0.1:8000/api/books/${book_id}`)
    .then((res) => res.json())
    .then((data) => {
      let book = data.data;
      document.getElementById("book-detail").innerHTML = 
      ` 
       <div class="book-detail-card">
          <div class="book-cover">
            <img
              src="${book.cover_image}"
              alt=""
            />
          </div>

          <div class="book-info">
            <h1 class="book-title">${book.title}</h1>
            <p><strong>Author:</strong>${book.author.name}</p>
            <p><strong>Genre:</strong> ${book.genre}</p>
            <p><strong>ISBN:</strong>${book.isbn}</p>
            <p><strong>Published:</strong> ${book.published_at}</p>

            <div class="book-description">
              <h2>Description</h2>
              <p class="truncate-multi">
               ${book.description}
              </p>
            </div>

            <div class="book-actions">
              <button class="btn primary" id="btn_edit">Edit Book</button>
              <button class="btn secondary">Back to List</button>
            </div>
          </div>
        </div>
     
     
     
     `;
    });
} catch (err) {
  console.error("Error: ", err.message);
}
