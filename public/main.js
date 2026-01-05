const usersEl = document.getElementById('users');
const rawEl = document.getElementById('raw');

async function fetchUsers(role) {
  const q = role ? `?role=${encodeURIComponent(role)}` : '';
  const res = await fetch(`/users${q}`);
  const data = await res.json();
  rawEl.textContent = JSON.stringify(data, null, 2);
  renderUsers(Array.isArray(data) ? data : [data]);
}

function renderUsers(list){
  usersEl.innerHTML = '';
  if (!list.length) { usersEl.innerHTML = '<i>No users</i>'; return }
  list.forEach(u => {
    const d = document.createElement('div');
    d.className = 'card';
    d.innerHTML = `<b>${u.name} (${u.role})</b><div>id: ${u.id}</div><div>email: ${u.email || '-'} </div>`;
    usersEl.appendChild(d);
  });
}

document.getElementById('btnAll').addEventListener('click', () => fetchUsers());

document.getElementById('btnFilter').addEventListener('click', () => {
  const role = document.getElementById('roleFilter').value;
  fetchUsers(role);
});

document.getElementById('btnGetById').addEventListener('click', async () => {
  const id = document.getElementById('userId').value.trim();
  if (!id) return alert('enter id');
  const res = await fetch(`/users/${id}`);
  if (res.status === 404) {
    rawEl.textContent = 'User not found';
    usersEl.innerHTML = '';
    return;
  }
  const data = await res.json();
  rawEl.textContent = JSON.stringify(data, null, 2);
  renderUsers([data]);
});

// Add user
document.getElementById('addForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const role = document.getElementById('role').value;
  if (!name) return alert('enter name');
  const res = await fetch('/users', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ name, role })
  });
  const data = await res.json();
  document.getElementById('addResult').textContent = 'Added id: ' + (data.id || '-');
  fetchUsers();
  e.target.reset();
});

// load initial
fetchUsers();