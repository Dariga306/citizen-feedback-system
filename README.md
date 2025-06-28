# 📬 Citizen Digital Feedback Monitoring System

A full-stack web application designed for the Ministry of Digital Development of Kazakhstan to collect, monitor, and analyze citizen complaints and suggestions related to digital public services (eGov, eLicense, Kaspi, etc.). The system features a public submission form and an admin dashboard with filtering, analytics, and AI-based feedback classification.


## Project Goal

To build a single-page application (SPA) that enables:

- Citizens to submit complaints and suggestions regarding digital services.
- Government employees to review, filter, and analyze this feedback in real-time.
- Integration with AI to classify messages by sentiment and intent.
- Dashboard and visual reports to monitor systemic issues across regions and categories.



## 👥 User Roles

### 🧍 Citizen Interface (`/submit`)

- Submit feedback through a simple form without registration.
- Required fields: name, region, category, description.
- Optional: file attachment, phone number.
- After submission: shows a confirmation and assigns a ticket ID.

### 🧑‍💼 Moderator Panel (`/dashboard`, `/requests`)

- View all submissions in a searchable/filterable table.
- Filter by category, region, status, date.
- Update status of each request: "New", "In Progress", "Resolved", "Rejected".
- Access AI-generated sentiment/intent results.
- Export to Excel.



## ⚙️ Tech Stack

### Frontend
- **React.js** – SPA architecture
- **React Router DOM** – Page routing
- **Tailwind CSS + Ant Design** – UI design
- **Recharts** – Analytics and graphs
- **React Icons** – Visual enhancement

### Backend
- **Node.js + Express** – REST API
- **MongoDB + Mongoose** – Document-based data storage
- **OpenAI API** – Text classification via GPT
- **dotenv** – Environment variable handling



## 📁 Project Structure

```

citizen-feedback-system/
├── backend/                 # Express backend
│   ├── routes/              # API routes (ai.js, request.js)
│   ├── models/              # MongoDB schemas
│   └── index.js             # Entry point
│
├── src/                     # React frontend
│   ├── pages/               # SubmitForm, Dashboard, RequestsTable, Login
│   ├── components/          # Navbar, Footer, InfoCard, etc.
│   └── main.jsx             # Application entry

````

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Dariga306/citizen-feedback-system.git
cd citizen-feedback-system
````

### 2. Frontend Setup

```bash
npm install
npm run dev
```

Runs on: [http://localhost:5173](http://localhost:5173)

### 3. Backend Setup

```bash
cd backend
npm install
node index.js
```

Runs on: [http://localhost:4000](http://localhost:4000)

---

## 🔐 .env Configuration (Backend)

Create a `.env` file inside `backend/`:

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/citizen_feedback
OPENAI_API_KEY=your_openai_key_here
```

---

## 🤖 AI Integration

Each message is analyzed by OpenAI's GPT model to determine:

* **Sentiment**: `positive`, `negative`, or `neutral`
* **Intent**: `complaint`, `question`, `suggestion`, `gratitude`, etc.

Results are stored with each request and shown in the moderator dashboard.

---

## 📈 Dashboard Features

* Total requests, by region and category
* Pie chart by request status
* Bar chart by region or service type
* Export filtered table to Excel
* Role-based access (planned)

---

## 🔮 Future Improvements

* ✅ JWT-based moderator login
* 🔄 AI feedback retraining with labeled data
* 📍 Map view: regional heatmap of complaints
* 📤 PDF/Excel reporting per month/quarter
* 📡 Integration with eGov/SmartBridge APIs
* 📱 Telegram bot for citizen alerts

---

## 🏛️ Developed for

**Ministry of Digital Development, Innovations and Aerospace Industry of the Republic of Kazakhstan**
Intern Project by [@Dariga306](https://github.com/Dariga306)