IntercomDesk

A structured support ticket system with chat and admin management.

IntercomDesk replaces unstructured customer complaints with a guided workflow that creates tickets, tracks their status, and allows administrators to manage and resolve issues efficiently.

---

Live Demo

Frontend
https://davexinoh.github.io/IntercomDesk/

Backend API
https://intercomdesk-v2.onrender.com

---

Features

User Features

- Submit structured complaints
- Category-based issue reporting
- Priority levels (low, normal, high, urgent)
- Automatic ticket reference ID generation
- Ticket status tracking
- Timeline of ticket updates
- Ticket chat thread with admin
- Optional proof attachments

Admin Features

- Admin login via secret key
- Ticket dashboard with search and filters
- Ticket status updates
- Public admin replies
- Internal admin notes
- Ticket assignment
- Ticket tagging
- Export tickets as JSON
- Category manager

---

How It Works

1. User selects a category and submits a complaint.
2. The system generates a unique ticket reference ID.
3. The ticket is stored in the backend database.
4. Admins can view and manage tickets through the admin console.
5. Status updates and messages appear in the ticket timeline.

---

Project Structure

IntercomDesk
│
├── api
│   ├── server.js
│   ├── db.js
│   └── package.json
│
├── docs
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   ├── PROOF.md
│   └── proof
│
└── README.md

---

Running Locally

Backend

cd api
npm install
npm start

Server runs at

http://localhost:10000

---

Frontend

Open:

docs/index.html

or run a local static server.

---

Environment Variables

Backend supports:

ADMIN_KEY

Example:

ADMIN_KEY=dave-admin-secret

If not set, the default key is:

intercomdesk-admin

---

API Endpoints

Public

GET /api/categories
GET /api/categories/:id
POST /api/complaints
GET /api/complaints/:id
POST /api/complaints/:id/message

Admin

GET /api/admin/tickets
GET /api/admin/tickets/:id
POST /api/admin/tickets/update
POST /api/admin/tickets/message
GET /api/admin/export
GET /api/admin/categories
POST /api/admin/categories/save

---

Proof of Functionality

See:

docs/PROOF.md

Screenshots show:

- complaint submission
- ticket creation
- status lookup
- admin dashboard

---

License

MIT
Trac address trac1e822qqhy2x0jsl03y57zaflucewszpdg0k4cv2tu0s3p4sj87z7qg4h5h2
