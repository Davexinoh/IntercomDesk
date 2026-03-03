const express = require("express")
const path = require("path")

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.static(__dirname))

// API routes
app.get("/api/categories", (req,res)=>{
  res.json([
    { id:"payment", name:"Payment Issues"},
    { id:"login", name:"Login Problems"},
    { id:"bug", name:"Bug Report"},
    { id:"other", name:"Other"}
  ])
})

app.get("/api/categories/:id",(req,res)=>{
  const issues = {
    payment:["failed_transaction","double_charge","refund"],
    login:["cannot_login","reset_password","account_locked"],
    bug:["ui_bug","feature_not_working","crash"],
    other:["general_question"]
  }

  res.json(issues[req.params.id] || [])
})

// Serve frontend
app.get("/",(req,res)=>{
  res.sendFile(path.join(__dirname,"index.html"))
})

app.listen(PORT,()=>{
  console.log("Server running on",PORT)
})
