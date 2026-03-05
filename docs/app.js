const API = "https://intercomdesk-v2.onrender.com/api";

let step = "category";
let ticketData = {};

const chatbox = document.getElementById("chatbox");

function addMessage(sender, text) {
  const div = document.createElement("div");
  div.className = "message";
  div.innerHTML = `<b>${sender}:</b> ${text}`;
  chatbox.appendChild(div);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function bot(text) {
  addMessage("Bot", text);
}

function user(text) {
  addMessage("You", text);
}

function showCategories(categories) {
  const div = document.createElement("div");

  categories.forEach(c => {
    const btn = document.createElement("button");
    btn.innerText = c.name;
    btn.onclick = () => selectCategory(c);
    btn.style.margin = "5px";
    div.appendChild(btn);
  });

  chatbox.appendChild(div);
}

async function startConversation() {

  bot("Hello 👋 Welcome to IntercomDesk.");

  bot("Please select a category:");

  const res = await fetch(API + "/categories");
  const cats = await res.json();

  showCategories(cats);
}

async function selectCategory(cat) {

  user(cat.name);

  ticketData.category = cat.id;

  step = "issue";

  const res = await fetch(API + "/categories/" + cat.id);
  const issues = await res.json();

  bot("Select issue: " + issues.join(", "));
}

async function sendMessage() {

  const input = document.getElementById("userInput");

  const text = input.value;

  if (!text) return;

  user(text);

  input.value = "";

  if (text.startsWith("check")) {

    const id = text.split(" ")[1];

    const res = await fetch(API + "/complaints/" + id);

    if (res.status !== 200) {
      bot("Ticket not found.");
      return;
    }

    const data = await res.json();

    bot("Status: " + data.status);

    if (data.reply) {
      bot("Admin Reply: " + data.reply);
    }

    return;
  }

  if (step === "issue") {

    ticketData.subIssue = text;

    step = "description";

    bot("Describe your problem");

    return;
  }

  if (step === "description") {

    ticketData.description = text;

    const res = await fetch(API + "/complaints", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(ticketData)
    });

    const data = await res.json();

    bot("✅ Ticket created.");

    bot("Reference ID: " + data.reference);

    bot("You can check status using:");
    bot("check " + data.reference);

    ticketData = {};
    step = "category";

    startConversation();
  }
}

function showAdmin() {
  document.getElementById("chatPage").style.display = "none";
  document.getElementById("adminPage").style.display = "block";
  loadAdmin();
}

function showChat() {
  document.getElementById("chatPage").style.display = "block";
  document.getElementById("adminPage").style.display = "none";
}

async function loadAdmin() {

  const panel = document.getElementById("adminPanel");

  panel.innerHTML = "Loading...";

  const res = await fetch(API + "/admin/complaints");

  const data = await res.json();

  panel.innerHTML = "";

  data.forEach(ticket => {

    const div = document.createElement("div");

    div.className = "admin-ticket";

    div.innerHTML = `
      <h3>${ticket.id}</h3>

      <p>Category: ${ticket.category}</p>
      <p>Issue: ${ticket.subIssue}</p>
      <p>Description: ${ticket.description}</p>

      <p>Status: ${ticket.status}</p>

      <select id="status-${ticket.id}">
        <option value="pending">Pending</option>
        <option value="investigating">Investigating</option>
        <option value="resolved">Resolved</option>
      </select>

      <input id="reply-${ticket.id}" placeholder="Admin reply"/>

      <button onclick="updateTicket('${ticket.id}')">
        Update
      </button>
    `;

    panel.appendChild(div);

  });
}

async function updateTicket(id) {

  const status = document.getElementById("status-" + id).value;

  const reply = document.getElementById("reply-" + id).value;

  await fetch(API + "/admin/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id,
      status,
      reply
    })
  });

  loadAdmin();
}

startConversation();

