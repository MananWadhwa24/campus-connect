# 🎓 Campus Connect – A Full-Stack College Student Portal

> **Your Campus, Your Community.**  
> A production-style college student portal built on the modern MERN stack with real-time Socket.IO communication, in-app PDF resource management, and a custom dark-led editorial design system.

---

## 🚀 Key Features & Modules

### 1. 🔐 User Authentication & Profiles
- Secure user registration and login with **bcryptjs** (10 salt rounds) password hashing.
- Stateless **JSON Web Token (JWT)** session management with a 30-day lifecycle.
- Protected client-side and server-side routes via `authMiddleware.js`.
- Current profile endpoint (`GET /api/auth/me`) displaying authenticated user identity across the platform.

### 2. 📚 Academic Notes & PDF Resource Library
- Full CRUD operations with MongoDB Atlas persistence.
- **Native PDF File Upload:** Upload course documents up to 15MB powered by Multer with MIME verification.
- **In-App PDF Viewer:** Embedded viewer modal with 50%–200% zoom controls, fullscreen mode, and direct downloads.
- **Client-Side PDF Export:** Instant printable summary generation powered by `jspdf`.
- Dynamic search and filtering by semester and branch.

### 3. 💬 Real-Time Campus Community Lounge (Socket.IO)
- Persistent, full-duplex WebSocket messaging with sub-50ms latency.
- Full message history stored in MongoDB Atlas and loaded on reconnect.
- Real-time typing indicators ("*Student is typing...*").
- **Unique Online Student Tracking:** Deduplicates multi-tab browser sessions using an in-memory `Map<userId, Set<socketId>>`.
- **Live Diagnostics Panel:** Collapsible HUD in the bottom-right corner displaying active sockets, transport protocols, and reconnection stats.

### 4. 🛒 Student Marketplace
- Peer-to-peer campus commerce for textbooks, calculators, drafters, and gadgets.
- Listing creation with pricing in ₹, pickup location, and seller contact info.
- Search and category filters with seller-only deletion permissions.

### 5. 📢 Campus Notices & Bulletins
- Official circulars, examination schedules, and event announcements.
- Category filtering (`Exam`, `Placement`, `Event`, `Important`, `General`).
- Formatted timestamps and verified bulletin badges.

### 6. 💼 Placement Drives & Internships
- Recruitment drives with stipend/package tags, skill requirements, eligibility, and direct application workflow.

### 7. 🔍 Lost & Found Registry
- Report lost belongings or found items across campus locations.
- Status toggle workflow (`Open` $\leftrightarrow$ `Resolved / Claimed`).

---

## 🎨 Visual Design System (Ninefold Inspired)

- **Palette:** Dark-led charcoal surfaces (`#131417`, `#1C1E22`, `#26292E`), bone typography (`#ECE8E1`), signal green accents (`#79C043`), and thin structural lines.
- **Typography:** **Archivo 900** for display headings, **Inter** for body text, and **IBM Plex Mono** for metadata and badges.
- **Icons:** Minimalist **Lucide React** icon system (no generic emojis).
- **Animations:** Restrained **GSAP** reveals respecting `prefers-reduced-motion`.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite 8, Tailwind CSS v4, React Router v7, Axios, Lucide React, GSAP, jsPDF |
| **Backend** | Node.js, Express.js 5, Socket.IO, Multer, bcryptjs, jsonwebtoken, cors, dotenv |
| **Database** | MongoDB Atlas Cloud Cluster via Mongoose 9 ODM |

---

## 🔌 Complete REST API Reference

### Auth Endpoints (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Public | Register new user with hashed password & return JWT |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT + profile |
| `GET` | `/api/auth/me` | Protected | Fetch current profile via Bearer token |

### Notes Endpoints (`/api/notes`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/notes` | Public | Fetch all notes (supports `?search=...`, `?branch=...`) |
| `POST` | `/api/notes` | Protected | Multipart upload supporting PDF attachment + metadata |
| `DELETE` | `/api/notes/:id` | Protected | Delete note and physical PDF (owner/admin only) |

### Marketplace Endpoints (`/api/marketplace`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/marketplace` | Public | Fetch listings (supports search and category filters) |
| `POST` | `/api/marketplace` | Protected | Publish a new item for sale |
| `DELETE` | `/api/marketplace/:id`| Protected | Delete listing (seller/admin only) |

### Notices Endpoints (`/api/notices`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/notices` | Public | Fetch circulars (supports `?category=...`) |
| `POST` | `/api/notices` | Protected | Publish verified notice |
| `DELETE` | `/api/notices/:id` | Protected | Delete notice (author/admin only) |

### Lost & Found Endpoints (`/api/lost-found`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/lost-found` | Public | Fetch reports (supports `?type=` and `?status=`) |
| `POST` | `/api/lost-found` | Protected | Report a lost or found item |
| `PATCH` | `/api/lost-found/:id/status`| Protected | Toggle status (`Open` $\leftrightarrow$ `Resolved`) |
| `DELETE` | `/api/lost-found/:id`| Protected | Delete report (reporter/admin only) |

### Chat & Live Stats (`/api/chat`, `/api/stats`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/stats/online` | Public | Get unique online student count |
| `GET` | `/api/chat/messages` | Protected | Fetch last 50 chat messages from MongoDB |
| `POST` | `/api/chat/messages` | Protected | REST fallback to post community message |

---

## ⚡ Getting Started Locally

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster URI

### 2. Backend Setup
```bash
cd server
npm install
```

Configure `server/.env` (see `server/.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.your_cluster.mongodb.net/campus_connect?retryWrites=true&w=majority
JWT_SECRET=your_secure_jwt_secret_key_here
```

Start the backend:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd ../client
npm install
npm run dev
```

Open `http://localhost:5173` or `http://192.168.1.8:5173` on your browser or mobile phone.

---

## 📜 License
Developed as a Major College Engineering Project. All rights reserved.
