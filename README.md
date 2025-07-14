# 🇳🇬 EgbónAI

**EgbónAI** is an AI-powered web app for analyzing sentiment in Nigerian social media texts. Built with modern technologies like **Next.js**, **Google Gemini API**, and **SQLite**, it enables real-time sentiment classification and history tracking — all in a beautiful, theme-aware UI.

---

## 🚀 Features

- 🧠 Sentiment analysis using **Gemini AI**
- 🔐 Secure **email + password** authentication
- 🌗 Light / dark / system **theme toggle**
- 💾 Local storage of analysis history via **SQLite**
- ⚡ Built with **Next.js App Router**, **TypeScript**, and **TailwindCSS**
- 📱 Fully responsive and mobile-friendly

---

## 🛠️ Tech Stack

| Layer       | Technology                               |
| ----------- | ---------------------------------------- |
| Frontend    | Next.js (App Router) + TypeScript        |
| Styling     | TailwindCSS + CSS Variables              |
| AI/NLP      | Google Gemini API                        |
| Backend API | Next.js API Routes                       |
| Database    | SQLite (`better-sqlite3`)                |
| Auth        | Email & Password (bcrypt + localStorage) |

---

## 📁 Folder Structure

/src
/app → Pages (App Router + API routes)
/components → UI components (Navbar, ThemeToggle, etc.)
/lib → SQLite DB setup, Gemini integration
/types → Shared TS types
/data → sentiments.db SQLite file

---

## ⚙️ Setup Instructions

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/sentinaija.git
cd sentinaija

# 2. Install dependencies
npm install

# 3. Add your Gemini API key
echo "GEMINI_API_KEY=your-key-here" > .env.local

# 4. Run the dev server
npm run dev
```
