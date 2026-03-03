const express = require("express")
const path = require("path")

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.static(__dirname))

// API endpoint
app.get("/api/categories", (req, res) => {
  res.json([
    "Billing Issue",
    "Technical Support",
    "Account Access",
    "Bug Report"
  ])
})

// serve UI
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})

app.listen(PORT, () => {
  console.log("IntercomDesk running on port " + PORT)
})
