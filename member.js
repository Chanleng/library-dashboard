// Variable declaration
const API_BASE = "http://127.0.0.1:8000/api/members";
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const memberName = document.getElementById("memberUserName");
const memberEmail = document.getElementById("memberEmail");
const memberAddress = document.getElementById("address");
const memberJoinDate = document.getElementById("memberJoinDate");
const active = document.getElementById("active");
const inactive = document.getElementById("inactive");
const btnSubmitmember = document.getElementById("btnSubmitmember");
let editMode = true;
const createMemberForm = document.getElementById("createMemberForm");
const modal = document.getElementById("createMemberModal");
const createMemberTitle = document.getElementById("createMemberTitle");
const buttonload = document.getElementById("buttonload");
let memberId = null;
//
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
document.getElementById("AddMember").addEventListener("click", () => {
  editMode = false;
  memberName.value = "";
  memberEmail.value = "";
  memberAddress.value = "";
  memberJoinDate.value = "";
  active.checked = false;
  inactive.checked = false;
  createMemberTitle.innerHTML = "Add New Member";
  btnSubmitmember.innerHTML = "Create Member";
  openModal();
});
document
  .getElementById("closeCreateMember")
  .addEventListener("click", () => closeModal());
document
  .getElementById("cancelCreateMember")
  .addEventListener("click", () => closeModal());
document
  .getElementById("memberModalOverlay")
  .addEventListener("click", () => closeModal());
//
async function fetchMmebers(page) {
  try {
    const res = await fetch(`${API_BASE}?page=${page}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error : ", error);
  }
}
function renderMember(members) {
  let row = "";
  members.forEach((member) => {
    row += `
        <tr>
                <td>${member.id}</td>
                <td><strong>${member.name}</strong></td>
                <td>${member.email}</td>

                <td class="truncate">${member.address}</td>
                <td><span class="status-chip available">${member.membership_date}</span></td>
                <td>${member.status}</td>
                <td>
                  <button class="action-btn btn-edit-member" aria-label="Edit book" data-id="${member.id}">
                    ✏️
                  </button>
                  <button
                    class="action-btn btn-delete-member"
                    aria-label="Delete book"
                    data-id="${member.id}"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
    `;
  });
  document.getElementById("tableMemberBody").innerHTML = row;
}
async function handlesubmitMember(e) {
  e.preventDefault();
  buttonload.style.display = "block";
  btnSubmitmember.style.display = "none";
  const formData = new FormData();
  formData.append("name", memberName.value);
  formData.append("email", memberEmail.value);
  formData.append("address", memberAddress.value);
  formData.append("membership_date", memberJoinDate.value);
  formData.append("status", inactive.checked ? "inactive" : "active");
  if (editMode) formData.append("_method", "PUT");

  try {
    let url = editMode ? `${API_BASE}/${memberId}` : `${API_BASE}`;
    const res = await fetch(url, {
      headers: {
        accept: "application/json",
      },
      body: formData,
      method: "POST",
    });
    if (!res.ok) {
      throw new Error("Submit member failed");
    }
    const data = await res.json();
    buttonload.style.display = "none";
    btnSubmitmember.style.display = "block";
    closeModal();
    Swal.fire({
      title: "Success",
      text: editMode
        ? "Member edit successfully"
        : "Member create successfully",
      icon: "success",
      confirmButtonText: "ok",
    });
    editMode ? loadPage(currentPage) : loadPage();
    editMode = true;
  } catch (error) {
    closeModal();
    console.error("Error : ", error);
    Swal.fire({
      title: "Error!",
      text: error.message,
      icon: "error",
      confirmButtonText: "ok",
    });
  }
}
async function handleEditMember(id) {
  try {
    memberId = id;
    const res = await fetch(`${API_BASE}/${id}`);
    const data = await res.json();
    const member = data.data;
    memberAddress.value = member.address;
    memberEmail.value = member.email;
    memberName.value = member.name;
    memberJoinDate.value = member.membership_date;
    member.status == "active"
      ? (active.checked = true)
      : (inactive.checked = true);
  } catch (error) {
    console.error("Error : ", error);
  }
}
async function handleDeleteMember(id, row) {
  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      headers: {
        accept: "application/json",
      },
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("Delete member failed");
    }
    row.remove();
    Swal.fire({
      title: "Success",
      text: "Delete member successfully",
      icon: "success",
      confirmButtonText: "Ok",
    });
  } catch (error) {
    console.error("Error : ", error);
  }
}
let currentPage = 1;
async function loadPage(page = 1) {
  const data = await fetchMmebers(page);
  renderMember(data.data);
  currentPage = data.meta.current_page;
  document.getElementById("currentPage").innerHTML = data.meta.current_page;
  document.getElementById("totalPages").innerHTML = data.meta.last_page;
  !data.links.prev ? (btnPrev.disabled = true) : (btnPrev.disabled = false);
  !data.links.next ? (btnNext.disabled = true) : (btnNext.disabled = false);
}
//handle Edit and Delete
document.getElementById("tableMemberBody").addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-edit-member")) {
    handleEditMember(e.target.dataset.id);
    openModal();
  }
  if (e.target.classList.contains("btn-delete-member")) {
    let row = e.target.closest("tr");
    let id = e.target.dataset.id;
    Swal.fire({
      title: "Are you sure?",
      text: "This member will be delete",
      showCancelButton: true,
      icon: "question",
      confirmButtonText: "Ok",
    }).then((e) => {
      if (e.isConfirmed) {
        handleDeleteMember(id, row);
      }
    });
  }
});

//submit member
createMemberForm.addEventListener("submit", handlesubmitMember);

btnNext.addEventListener("click", () => loadPage(currentPage + 1));
btnPrev.addEventListener("click", () => loadPage(currentPage - 1));
loadPage();
