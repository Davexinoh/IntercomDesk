const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

let complaints = []

function id(){
return "ICD-"+Math.random().toString(36).substring(2,7).toUpperCase()
}

const categories = [
{ id:"login",name:"Login Issues",issues:["reset_password","cannot_login"]},
{ id:"payment",name:"Payment Issues",issues:["failed_payment","refund_request"]},
{ id:"bug",name:"Bug Report",issues:["ui_bug","system_error"]},
{ id:"other",name:"Other",issues:["general"]}
]

app.get("/api/categories",(req,res)=>{
res.json(categories)
})

app.get("/api/categories/:id",(req,res)=>{
const cat = categories.find(c=>c.id===req.params.id)
res.json(cat?cat.issues:[])
})

app.post("/api/complaints",(req,res)=>{

const {category,subIssue,description,priority} = req.body

const ticket = {
id:id(),
category,
subIssue,
description,
priority:priority||"normal",
status:"pending",
reply:"",
timeline:[
{event:"created",time:Date.now()}
]
}

complaints.push(ticket)

res.json({
success:true,
reference:ticket.id
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

if(!ticket) return res.status(404).json({error:"not found"})

if(status){
ticket.status=status
ticket.timeline.push({event:status,time:Date.now()})
}

if(reply) ticket.reply=reply

res.json({success:true})

})

const PORT = process.env.PORT||10000

app.listen(PORT,()=>console.log("API running"))
