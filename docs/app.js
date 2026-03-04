const API = "https://intercomdesk-v2.onrender.com"

let stage = "start"
let selectedCategory = null
let selectedIssue = null

const chat = document.getElementById("chat")

function addBubble(text, type) {

const msg = document.createElement("div")
msg.className = "bubble " + type
msg.innerText = text

chat.appendChild(msg)
chat.scrollTop = chat.scrollHeight

}

function bot(text) {
addBubble(text, "bot")
}

function user(text) {
addBubble(text, "user")
}

function typing() {

const t = document.createElement("div")
t.className = "typing"
t.innerText = "Bot is typing..."

chat.appendChild(t)
chat.scrollTop = chat.scrollHeight

setTimeout(() => t.remove(), 800)

}

window.onload = async () => {

typing()

setTimeout(async () => {

bot("Hello 👋")
bot("Welcome to IntercomDesk")

bot("What issue are you having?")

const res = await fetch(API + "/api/categories")
window.categories = await res.json()

categories.forEach(c => {
bot("• " + c.name)
})

bot("You can also type: check <ticketID>")

stage = "category"

}, 900)

}

async function send() {

const input = document.getElementById("input")

const text = input.value.trim()

if (!text) return

user(text)

input.value = ""

if (text.startsWith("check ")) {

const id = text.split(" ")[1]

typing()

setTimeout(async () => {

const res = await fetch(API + "/api/complaints/" + id)

const data = await res.json()

if (data.error) {

bot("Ticket not found")
return

}

const time = new Date(data.createdAt).toLocaleString()

bot("Status: " + data.status)
bot("Created: " + time)
bot("Category: " + data.category)
bot("Issue: " + data.subIssue)

}, 900)

return

}

if (stage === "category") {

const match = categories.find(c =>
c.name.toLowerCase().includes(text.toLowerCase())
)

if (!match) {

bot("Please type one of the categories listed.")
return

}

selectedCategory = match.id

typing()

setTimeout(async () => {

bot("Fetching issue types...")

const res = await fetch(API + "/api/categories/" + selectedCategory)

window.issues = await res.json()

issues.forEach(i => {
bot("• " + i)
})

bot("Select issue type")

stage = "issue"

}, 800)

return

}

if (stage === "issue") {

selectedIssue = text

bot("Please describe the problem")

stage = "description"

return

}

if (stage === "description") {

typing()

setTimeout(async () => {

bot("Submitting complaint...")

const res = await fetch(API + "/api/complaints", {

method: "POST",

headers: {
"Content-Type": "application/json"
},

body: JSON.stringify({
category: selectedCategory,
subIssue: selectedIssue,
description: text
})

})

const data = await res.json()

bot("✅ Ticket created")
bot("Reference ID: " + data.reference)

bot("You can track it using:")
bot("check " + data.reference)

stage = "done"

}, 900)

}

}

function showAdmin() {

document.getElementById("chat").style.display = "none"
document.getElementById("inputArea").style.display = "none"

const admin = document.getElementById("admin")

admin.style.display = "flex"

loadTickets()

}

function showChat() {

document.getElementById("chat").style.display = "flex"
document.getElementById("inputArea").style.display = "flex"

document.getElementById("admin").style.display = "none"

}

async function loadTickets() {

const admin = document.getElementById("admin")

admin.innerHTML = "Loading tickets..."

try {

const res = await fetch(API + "/api/admin")

const tickets = await res.json()

admin.innerHTML = ""

tickets.forEach(t => {

const el = document.createElement("div")

el.className = "ticket"

el.innerHTML =
"<b>" + t.id + "</b><br>" +
t.category + " / " + t.subIssue + "<br>" +
"Status: " + t.status

admin.appendChild(el)

})

}

catch {

admin.innerHTML = "Admin API not available"

}

  }
