const studentForm = document.getElementById('studentForm');
const studentList = document.getElementById('studentList');

const API_URL = 'http://localhost:3000/students';

async function fetchStudents() {
  const res = await fetch(API_URL);
  const students = await res.json();
  renderStudents(students);
}

function renderStudents(students) {
  studentList.innerHTML = '';
  if (students.length === 0) {
    studentList.innerHTML = '<tr><td colspan="4" style="text-align:center;">No students added.</td></tr>';
    return;
  }
  students.forEach((student) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${student.name}</td>
      <td>${student.email}</td>
      <td>${student.age}</td>
      <td><button class="delete-btn" data-id="${student.id}">Delete</button></td>
    `;
    studentList.appendChild(tr);
  });
}

studentForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const age = parseInt(document.getElementById('age').value);

  if (!name || !email || !age || age < 1) {
    alert('Please enter valid details.');
    return;
  }

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, age })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'Failed to add student');
      return;
    }

    studentForm.reset();
    fetchStudents();
  } catch (err) {
    alert('Error: ' + err.message);
  }
});

studentList.addEventListener('click', async (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const id = e.target.getAttribute('data-id');
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchStudents();
  }
});

fetchStudents();
