const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

let complaints = []

function generateID(){
return "ICD-" + Math.random().toString(36).substring(2,7).toUpperCase()
}

const categories = [
{ id:"payment", name:"Payment Issues", issues:["failed_payment","refund_request","double_charge"] },
{ id:"login", name:"Login Problems", issues:["reset_password","cannot_login"] },
{ id:"bug", name:"Bug Report", issues:["ui_bug","system_error"] },
{ id:"other", name:"Other", issues:["general"] }
]

app.get("/api/categories",(req,res)=>{
res.json(categories.map(c=>({id:c.id,name:c.name})))
})

app.get("/api/categories/:id",(req,res)=>{
const cat = categories.find(c=>c.id===req.params.id)
if(!cat) return res.json([])
res.json(cat.issues)
})

app.post("/api/complaints",(req,res)=>{

const {category,subIssue,description} = req.body

const id = generateID()

const ticket = {
id,
category,
subIssue,
description,
status:"pending",
reply:"",
created:Date.now()
}

complaints.push(ticket)

res.json({
success:true,
reference:id
})

})

app.get("/api/complaints/:id",(req,res)=>{
const ticket = complaints.find(c=>c.id===req.params.id)
if(!ticket) return res.status(404).json({error:"not found"})
res.json(ticket)
})

app.get("/api/admin/complaints",(req,res)=>{
res.json(complaints)
})

app.post("/api/admin/update",(req,res)=>{

const {id,status,reply} = req.body

const ticket = complaints.find(c=>c.id===id)

if(!ticket){
return res.status(404).json({error:"not found"})
}

if(status) ticket.status=status
if(reply) ticket.reply=reply

res.json({success:true,ticket})

})

const PORT = process.env.PORT || 10000

app.listen(PORT,()=>{
console.log("API running on",PORT)
})
