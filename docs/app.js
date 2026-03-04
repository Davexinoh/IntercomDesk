const API="https://intercomdesk-v2.onrender.com"

window.onload=async()=>{

const res=await fetch(API+"/api/categories")
const categories=await res.json()

const categorySelect=document.getElementById("category")

categories.forEach(c=>{

const opt=document.createElement("option")
opt.value=c.id
opt.textContent=c.name

categorySelect.appendChild(opt)

})

loadSubIssues(categorySelect.value)

}

async function loadSubIssues(category){

const res=await fetch(API+"/api/categories/"+category)
const issues=await res.json()

const sub=document.getElementById("subIssue")

sub.innerHTML=""

issues.forEach(i=>{

const opt=document.createElement("option")
opt.value=i
opt.textContent=i

sub.appendChild(opt)

})

}

document.getElementById("category").addEventListener("change",(e)=>{

loadSubIssues(e.target.value)

})

async function submitComplaint(){

const btn=document.getElementById("submitBtn")

btn.innerText="Submitting..."

const category=document.getElementById("category").value
const subIssue=document.getElementById("subIssue").value
const description=document.getElementById("description").value

const res=await fetch(API+"/api/complaints",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
category,
subIssue,
description
})

})

const data=await res.json()

btn.innerText="Submit Complaint"

document.getElementById("result").innerHTML=
`

<div class="success">
Complaint submitted<br>
Reference ID: <b>${data.reference}</b>
</div>
`}

async function checkStatus(){

const id=document.getElementById("ticketId").value

const res=await fetch(API+"/api/complaints/"+id)

const data=await res.json()

if(data.error){

document.getElementById("statusResult").innerHTML="Ticket not found"

return

}

const time=new Date(data.createdAt).toLocaleString()

document.getElementById("statusResult").innerHTML=
`

<div class="statusCard">
<b>Status:</b> ${data.status}<br>
<b>Created:</b> ${time}<br>
<b>Category:</b> ${data.category}<br>
<b>Issue:</b> ${data.subIssue}
</div>
`}
