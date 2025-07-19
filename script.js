let students = JSON.parse(localStorage.getItem("students")) || [];
const studentForm = document.getElementById("studentForm");
const studentTableBody = document.querySelector("#studentTable tbody");
const searchInput = document.getElementById("search");
const editIndexInput = document.getElementById("editIndex");
function renderTable(filter = "") {
  studentTableBody.innerHTML = "";
  students.forEach((student, index) => {
    const searchable = (student.name + student.email + student.course + student.regNumber + student.mobile).toLowerCase();
    if (searchable.includes(filter.toLowerCase())) {
      const row = `<tr>
        <td>${index + 1}</td>
        <td>${student.name}</td>
        <td>${student.email}</td>
        <td>${student.age}</td>
        <td>${student.course}</td>
        <td>${student.regNumber}</td>
        <td>${student.mobile}</td>
        <td>
          <button class="small-btn edit-btn" onclick="editStudent(${index})">Edit</button>
          <button class="small-btn delete-btn" onclick="deleteStudent(${index})">Delete</button>
        </td>
      </tr>`;
      studentTableBody.innerHTML += row;
    }
  });
}
studentForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const age = document.getElementById("age").value.trim();
  const course = document.getElementById("course").value.trim();
  const regNumber = document.getElementById("regNumber").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const editIndex = editIndexInput.value;
  const studentData = { name, email, age, course, regNumber, mobile };
  if (editIndex !== "") {
    students[editIndex] = studentData;
    editIndexInput.value = "";
  } else {
    students.push(studentData);
  }
  localStorage.setItem("students", JSON.stringify(students));
  studentForm.reset();
  renderTable(searchInput.value);
});
function editStudent(index) {
  const student = students[index];
  document.getElementById("name").value = student.name;
  document.getElementById("email").value = student.email;
  document.getElementById("age").value = student.age;
  document.getElementById("course").value = student.course;
  document.getElementById("regNumber").value = student.regNumber;
  document.getElementById("mobile").value = student.mobile;
  editIndexInput.value = index;
}
function deleteStudent(index) {
  if (confirm("Are you sure you want to delete this student?")) {
    students.splice(index, 1);
    localStorage.setItem("students", JSON.stringify(students));
    renderTable(searchInput.value);
  }
}
searchInput.addEventListener("input", () => {
  renderTable(searchInput.value);
});
document.getElementById("clearAllBtn").addEventListener("click", function () {
  if (confirm("Are you sure you want to clear all students?")) {
    students = [];
    localStorage.removeItem("students");
    renderTable();
  }
});
document.getElementById("exportCSVBtn").addEventListener("click", function () {
  if (students.length === 0) return alert("No data to export!");

  const headers = ["Name", "Email", "Age", "Course", "Reg No", "Mobile"];
  const rows = students.map(s => [
    s.name,
    s.email,
    s.age,
    s.course,
    s.regNumber,
    `="${s.mobile}"` 
  ]);

  const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "students.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

document.getElementById("exportPDFBtn").addEventListener("click", function () {
  if (students.length === 0) return alert("No data to export!");

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const tableData = students.map((s, i) => [
    i + 1,
    s.name,
    s.email,
    s.age,
    s.course,
    s.regNumber,
    s.mobile
  ]);

  doc.text("Student Report", 14, 10);
  doc.autoTable({
    head: [["#", "Name", "Email", "Age", "Course", "Reg No", "Mobile"]],
    body: tableData,
    startY: 20,
  });

  doc.save("students.pdf");
});

// Initial render
renderTable();
