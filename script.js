
const password = "A1B2C3TA";
const groupId = 3529061;
const roleId = 24274463;
const maxUsers = 300;

function login() {
  const input = document.getElementById("password").value;
  if (input === password) {
    window.location.href = "main.html";
  } else {
    document.getElementById("error").innerText = "Şifre yanlış!";
  }
}

async function fetchUsers(cursor = "") {
  const url = `https://groups.roblox.com/v1/groups/${groupId}/roles/${roleId}/users?limit=100&cursor=${cursor}`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

async function loadUsers() {
  const container = document.getElementById("user-list");
  let allUsers = [];
  let cursor = "";
  do {
    const data = await fetchUsers(cursor);
    allUsers.push(...data.data);
    cursor = data.nextPageCursor;
  } while (cursor && allUsers.length < maxUsers);

  allUsers.slice(0, maxUsers).forEach(user => {
    const joinedAt = new Date(user.joinedAt);
    const now = new Date();
    const diff = Math.floor((now - joinedAt) / (1000 * 60 * 60 * 24));

    const card = document.createElement("div");
    card.className = "user-card";
    card.innerHTML = `
      <img src="https://www.roblox.com/headshot-thumbnail/image?userId=${user.userId}&width=150&height=150&format=png" alt="avatar">
      <h3>${user.username}</h3>
      <p>Nickname: ${user.displayName}</p>
      <p>${diff} gün önce Asteğmen oldu</p>
    `;
    container.appendChild(card);
  });
}

if (window.location.pathname.includes("main.html")) {
  loadUsers();
}
