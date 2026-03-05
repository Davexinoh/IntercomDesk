const API="https://intercomdesk-v2.onrender.com/api"

const chat=document.getElementById("chatbox")

let step="category"

let data={}

function msg(t){
const d=document.createElement("div")
d.className="msg"
d.innerText=t
chat.appendChild(d)
chat.scrollTop=chat.scrollHeight
}

async function start(){

msg("Hello 👋 Welcome to IntercomDesk")

msg("Select category:")

const r=await fetch(API+"/categories")
const cats=await r.json()

cats.forEach(c=>msg(c.name))

}

async function send(){

const input=document.getElementById("userInput")

const text=input.value

if(!text)return

msg("You: "+text)

input.value=""

if(text.startsWith("check")){

const id=text.split(" ")[1]

const r=await fetch(API+"/complaints/"+id)

if(r.status!==200){
msg("Ticket not found")
return
}

const t=await r.json()

msg("Status: "+t.status)

if(t.reply) msg("Admin: "+t.reply)

return
}

if(step==="category"){

data.category=text

step="issue"

msg("Enter issue")

return

}

if(step==="issue"){

data.subIssue=text

step="description"

msg("Describe problem")

return

}

if(step==="description"){

data.description=text

const r=await fetch(API+"/complaints",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(data)

})

const res=await r.json()

msg("Ticket created")

msg("Reference: "+res.reference)

data={}
step="category"

}

}

function showAdmin(){

document.getElementById("chatPage").style.display="none"

document.getElementById("adminPage").style.display="block"

loadAdmin()

}

function showChat(){

document.getElementById("chatPage").style.display="block"

document.getElementById("adminPage").style.display="none"

}

async function loadAdmin(){

const panel=document.getElementById("adminPanel")

const search=document.getElementById("search").value

const r=await fetch(API+"/admin/complaints")

let data=await r.json()

panel.innerHTML=""

data.forEach(t=>{

if(search && !t.id.includes(search)) return

const d=document.createElement("div")

d.className="ticket"

d.innerHTML=`

<h3>${t.id}</h3>

<p>${t.category}</p>
<p>${t.subIssue}</p>
<p>${t.description}</p>

<p>Status: ${t.status}</p>

<select id="s-${t.id}">
<option>pending</option>
<option>investigating</option>
<option>resolved</option>
</select>

<input id="r-${t.id}" placeholder="reply"/>

<button onclick="update('${t.id}')">Update</button>

`

panel.appendChild(d)

})

}

async function update(id){

const status=document.getElementById("s-"+id).value

const reply=document.getElementById("r-"+id).value

await fetch(API+"/admin/update",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({id,status,reply})

})

loadAdmin()

}

start()

setInterval(loadAdmin,5000)
