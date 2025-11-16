# 1. Project Title
Ease – Personal Loan & Debt Tracker

# 2. Problem Statement
Keeping track of money lent to or borrowed from friends, family, or acquaintances is often
messy. People forget amounts, due dates, or repayments, leading to misunderstandings.
Ease helps users efficiently track money lent or borrowed, view outstanding balances, and
get reminders for repayments.

# 3. System Architecture
Frontend → Backend (API) → Database

Example stack:
●
Frontend: React.js with React Router
●
Backend: Node.js + Express
●
Database: PostgreSQL
●
Authentication: JWT-based login/signup
●
Hosting:
○
Frontend → Vercel
○
○
Backend → Render
Database → ElephantSQL
# 5. Key Features
Authentication &
Authorization
Category Features
User registration, login, logout, role-based access
(user/admin)
CRUD Operations Add, view, update, delete loan/debt entries
Loan/Debt Tracking Due Date & Notifications Balance Summary Reports & Analytics Track money lent to others and borrowed from others
Set repayment due dates and get reminders
See net balance (total lent – total borrowed)
Monthly or custom period summaries of outstanding
loans/debts
# 6. Tech Stack
Layer Technologies
Frontend React.js, React Router, Axios, TailwindCSS
Backend Node.js, Express.js
Database PostgreSQL
Authentication JWT
Hosting Vercel (Frontend), Render (Backend), ElephantSQL
(Database)
# 7. API Overview
Endpoint Method Description Access
/api/auth/signup POST Register new user Public
/api/auth/login POST Authenticate user Public
/api/transactions GET Get all loans/debts for user Authenticated
/api/transactions POST Add new loan/debt Authenticated
/api/transactions/:id PUT Update transaction Authenticated
/api/transactions/:id DELETE Delete transaction Authenticated
/api/reports/summary GET Get summary of lent vs borrowed Authenticated
/api/notifications GET Get upcoming repayment
reminders
Authenticated