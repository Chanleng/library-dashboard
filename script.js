// ========================================
// KEYBOARD NAVIGATION
// ========================================

document.addEventListener("keydown", (e) => {
  // Close modals with Escape
  if (e.key === "Escape") {
    Object.values(modals).forEach((modal) => {
      if (modal.classList.contains("active")) {
        const modalType = Object.keys(modals).find(
          (key) => modals[key] === modal
        );
        closeModal(modalType);
      }
    });
  }
});

//chart
const genreCtx = document.getElementById("genreChart");
// create random colors
axios.get("http://127.0.0.1:8000/api/genre-statistics").then((res) => {
  const data = res.data.data;
  console.log(data);
  let labels = data.map((item) => {
    console.log(item.genre);
    return item.genre;
  });
  let datasets = data.map((item) => item.total);
  console.log(datasets);
  const colors = datasets.map(() => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, 10)`; // 0.7 = transparency
  });
  new Chart(genreCtx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Books per Genre",
          data: datasets,
          backgroundColor: colors,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
      },
    },
  });
});
async function getStatistics() {
  try {
    const res = await axios.get(
      "http://127.0.0.1:8000/api/statistic-dashboard"
    );
    const data = res.data;
    document.getElementById("total_books").innerHTML =
      data.total_books.toLocaleString();
    document.getElementById("total_members").innerHTML =
      data.total_members.toLocaleString();
    document.getElementById("total_borrowed").innerHTML =
      data.borrowed_books.toLocaleString();
    document.getElementById("total_overdue").innerHTML =
      data.overdue_books.toLocaleString();
  } catch (error) {}
}
getStatistics();
