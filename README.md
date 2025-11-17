# Ease – Personal Loan & Debt Tracker

## 1. Project Title
**Ease – Personal Loan & Debt Tracker**

---

## 2. Problem Statement
Managing personal loans and debts among friends, family, or acquaintances often becomes confusing. People tend to forget repayment dates, outstanding balances, and amounts lent or borrowed, leading to financial miscommunication.

**Ease** solves this by providing a secure, organized, and user-friendly platform to track transactions, set reminders, and manage repayment schedules efficiently.

---

## 3. System Architecture

**Frontend → Backend (API) → Database**

**Example Stack**
- **Frontend:** React.js, React Router, Axios, TailwindCSS  
- **Backend:** Node.js + Express.js  
- **Database:** PostgreSQL  
- **Authentication:** JWT-based login/signup  
- **Hosting:**  
  - Frontend → Vercel {https://ease-kappa.vercel.app/}
  - Backend → Render {https://ease-27am.onrender.com}
  - Database → Neon  

---

## 4. Key Features

### **Authentication & Authorization**
- Secure JWT-based login/signup  
- Role-based access (user/admin)

### **CRUD Operations**
- Add, view, update, and delete loan/debt entries

### **Loan/Debt Tracking**
- Track money lent or borrowed with clear status indicators

### **Due Dates & Notifications**
- Set repayment due dates  
- Receive reminders and alerts

### **Balance Summary**
- Auto-calculate total lent − total borrowed

### **Reports & Analytics**
- Generate monthly or custom-period reports  
- Visual charts and analytics

### **Search Functionality**
- Search by person, amount, date, or status

### **Sorting Options**
- Sort by date, amount, or due date (asc/desc)

### **Filtering Tools**
- Filter by type (lent/borrowed)  
- Filter by paid/unpaid status  
- Filter by custom time periods

### **Pagination**
- Paginated transaction lists for better performance

### **Data Export**
- Export data as CSV or PDF

---

## 5. Tech Stack

| Layer        | Technologies                                           |
|--------------|---------------------------------------------------------|
| Frontend     | React.js, React Router, Axios, TailwindCSS             |
| Backend      | Node.js, Express.js                                    |
| Database     | PostgreSQL                                             |
| Authentication | JWT (JSON Web Token)                                 |
| Hosting      | Vercel (Frontend), Render (Backend), Neon (DB) |

---

## 6. API Overview

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/auth/signup` | POST | Register a new user | Public |
| `/api/auth/login` | POST | Authenticate a user | Public |
| `/api/transactions` | GET | Get all loans/debts (search, sort, filter, pagination) | Authenticated |
| `/api/transactions` | POST | Add new loan/debt transaction | Authenticated |
| `/api/transactions/:id` | PUT | Update a transaction | Authenticated |
| `/api/transactions/:id` | DELETE | Delete a transaction | Authenticated |
| `/api/reports/summary` | GET | Summary of lent vs borrowed | Authenticated |
| `/api/notifications` | GET | Upcoming repayment reminders | Authenticated |

---

## Index
1. Project Title  
2. Problem Statement  
3. System Architecture  
4. Key Features  
5. Tech Stack  
6. API Overview
