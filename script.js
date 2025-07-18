document.addEventListener("DOMContentLoaded", () => {
  const studentForm = document.getElementById("studentForm");
  const studentList = document.getElementById("studentList");

  studentForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const ageInput = document.getElementById("age");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const age = ageInput.value.trim();

    if (name === "" || email === "" || age === "") {
      alert("Please fill in all fields.");
      return;
    }

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${name}</td>
      <td>${email}</td>
      <td>${age}</td>
      <td><button class="delete-btn">Delete</button></td>
    `;

    studentList.appendChild(row);

    // Clear inputs
    nameInput.value = "";
    emailInput.value = "";
    ageInput.value = "";

    nameInput.focus();
  });

  // Handle delete
  studentList.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-btn")) {
      const row = e.target.closest("tr");
      if (confirm("Are you sure you want to delete this student?")) {
        row.remove();
      }
    }
  });
});
