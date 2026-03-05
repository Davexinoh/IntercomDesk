const API="https://intercomdesk-v2.onrender.com/api"

let step="category"
let ticketData={}

const chatbox=document.getElementById("chatbox")

function bot(msg){
const div=document.createElement("div")
div.className="message"
div.innerText="Bot: "+msg
chatbox.appendChild(div)
chatbox.scrollTop=chatbox.scrollHeight
}

function user(msg){
const div=document.createElement("div")
div.className="message"
div.innerText="You: "+msg
chatbox.appendChild(div)
}

async function sendMessage(){

const input=document.getElementById("userInput")
const text=input.value

if(!text)return

user(text)

input.value=""

if(step==="category"){

const res=await fetch(API+"/categories")
const cats=await res.json()

const found=cats.find(c=>c.name.toLowerCase()===text.toLowerCase())

if(!found){
bot("Categories: "+cats.map(c=>c.name).join(", "))
return
}

ticketData.category=found.id
step="issue"

const res2=await fetch(API+"/categories/"+found.id)
const issues=await res2.json()

bot("Issues: "+issues.join(", "))

return
}

if(step==="issue"){

ticketData.subIssue=text
step="description"

bot("Describe your problem")

return
}

if(step==="description"){

ticketData.description=text

const res=await fetch(API+"/complaints",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(ticketData)

})

const data=await res.json()

bot("Ticket created. Reference: "+data.reference)

step="category"
ticketData={}

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

panel.innerHTML="Loading..."

const res=await fetch(API+"/admin/complaints")

const data=await res.json()

panel.innerHTML=""

data.forEach(ticket=>{

const div=document.createElement("div")

div.className="admin-ticket"

div.innerHTML=`

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

<input id="reply-${ticket.id}" placeholder="Reply"/>

<button onclick="updateTicket('${ticket.id}')">Update</button>

`

panel.appendChild(div)

})

}

async function updateTicket(id){

const status=document.getElementById("status-"+id).value
const reply=document.getElementById("reply-"+id).value

await fetch(API+"/admin/update",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({id,status,reply})

})

loadAdmin()

}

bot("Hello. Type a category to begin.")
