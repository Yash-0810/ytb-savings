# FinanceHub Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        BROWSER (Client)                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              React Application (Vite)                    │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐ │  │
│  │  │   Login     │  │    Signup    │  │   Dashboard    │ │  │
│  │  └─────────────┘  └──────────────┘  └─────────────────┘ │  │
│  │                                                           │  │
│  │  ┌──────────────┐  ┌────────────┐  ┌────────────────┐  │  │
│  │  │ Daily Report │  │Monthly Rpt │  │ Annual Report  │  │  │
│  │  └──────────────┘  └────────────┘  └────────────────┘  │  │
│  │                                                           │  │
│  │          React Context API (Auth State)                 │  │
│  │          Axios (API Client)                             │  │
│  │          React Router (Navigation)                      │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────┬─────────────────────────────────────────┘
                         │ HTTP(S) Requests
                         │
┌────────────────────────┴─────────────────────────────────────────┐
│              Backend Server (Node.js + Express)                 │
│                  http://localhost:5000                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    API Routes                            │  │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐ │  │
│  │  │ Auth Routes  │ │ Transaction  │ │  Report Routes  │ │  │
│  │  │ /auth/*      │ │  Routes      │ │  /reports/*     │ │  │
│  │  │              │ │  /txn/*      │ │                 │ │  │
│  │  └──────────────┘ └──────────────┘ └──────────────────┘ │  │
│  │                                                           │  │
│  │  ┌───────────────────────────────────────────────────┐  │  │
│  │  │        Middleware Layer                          │  │  │
│  │  │  ├─ CORS Handler                               │  │  │
│  │  │  ├─ JSON Parser                                │  │  │
│  │  │  └─ JWT Authentication                         │  │  │
│  │  └───────────────────────────────────────────────────┘  │  │
│  │                                                           │  │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐ │  │
│  │  │ Auth Utils   │ │  Controllers │ │   Validators    │ │  │
│  │  │ - Hash Pwd   │ │  - Business  │ │  - Input Check  │ │  │
│  │  │ - JWT Token  │ │    Logic     │ │                 │ │  │
│  │  └──────────────┘ └──────────────┘ └──────────────────┘ │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────┬─────────────────────────────────────────┘
                         │ Database Queries
                         │
┌────────────────────────┴─────────────────────────────────────────┐
│                    Database Layer (SQLite)                       │
│                   finance.db File                               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │          Users Table                                     │   │
│  │  ┌──────┬───────────┬──────┬──────────────────────────┐  │   │
│  │  │ id   │ email     │ name │ password (hashed)      │  │   │
│  │  └──────┴───────────┴──────┴──────────────────────────┘  │   │
│  │                                                           │   │
│  │          Transactions Table                              │   │
│  │  ┌──────┬─────────┬──────┬────────┬────────┬──────┐   │   │
│  │  │ id   │ user_id │ type │ amount │ desc   │ date │   │   │
│  │  └──────┴─────────┴──────┴────────┴────────┴──────┘   │   │
│  │                                                           │   │
│  │  Foreign Key Relationships                               │   │
│  │  - Transactions.user_id -> Users.id                      │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

## Data Flow

### User Registration
```
User Input (Signup Form)
    ↓
Frontend Validation
    ↓
POST /api/auth/signup
    ↓
Backend: Hash Password (bcryptjs)
    ↓
Database: Insert User
    ↓
Backend: Generate JWT Token
    ↓
Return Token + User Data
    ↓
Frontend: Store Token & User in localStorage
    ↓
Redirect to Dashboard
```

### Adding Transaction
```
User Input (Transaction Form)
    ↓
Frontend Validation
    ↓
POST /api/transactions
    ├─ Authorization Header (JWT Token)
    ├─ Body: { type, amount, date, description, category }
    ↓
Backend: Verify JWT Token
    ↓
Backend: Validate Input
    ↓
Database: Insert Transaction
    ↓
Return Transaction Data
    ↓
Frontend: Update Transaction List
```

### Generating Reports
```
User Selects Date/Month/Year
    ↓
GET /api/reports/[daily|monthly|annual]?date/month/year
    ├─ Authorization Header (JWT Token)
    ↓
Backend: Query Transactions for Period
    ↓
Backend: Calculate Totals
    ├─ Sum Debits
    ├─ Sum Credits
    └─ Calculate Balance
    ↓
Return Report Data
    ↓
Frontend: Display Report with Cards & Tables
```

## Authentication Flow

```
1. User Signup/Login
   └─> Password hashed with bcryptjs (salt rounds: 10)
       └─> User stored in database
           └─> JWT token generated
               └─> Token sent to frontend

2. Subsequent Requests
   └─> Frontend includes Authorization header
       └─> Backend validates JWT token
           └─> Extract userId from token
               └─> Process request with user context
                   └─> Return response

3. Token Refresh
   └─> Token stored in localStorage (browser)
       └─> Persists across browser sessions
           └─> Auto-applied to all API requests via axios interceptor
```

## Component Structure

```
App
├─ AuthProvider
│  └─ AuthContext (Global Auth State)
│
├─ Router
│  ├─ PrivateRoute Wrapper
│  │
│  ├─ /login → Login
│  │           ├─ useAuth Hook
│  │           └─ useNavigate Hook
│  │
│  ├─ /signup → Signup
│  │            ├─ Form Validation
│  │            ├─ useAuth Hook
│  │            └─ useNavigate Hook
│  │
│  ├─ /dashboard → Dashboard
│  │               ├─ Navbar (user info, logout)
│  │               ├─ Summary Cards
│  │               ├─ Tabs: Transactions | Reports
│  │               │
│  │               ├─ Tab 1: Transactions
│  │               │   ├─ TransactionForm
│  │               │   └─ TransactionList
│  │               │
│  │               └─ Tab 2: Reports
│  │                   ├─ Daily Report Link
│  │                   ├─ Monthly Report Link
│  │                   └─ Annual Report Link
│  │
│  ├─ /reports/daily → DailyReportPage
│  │                   ├─ Navbar
│  │                   ├─ Date Picker
│  │                   └─ Report Display
│  │
│  ├─ /reports/monthly → MonthlyReportPage
│  │                     ├─ Navbar
│  │                     ├─ Month Picker
│  │                     ├─ Report Cards
│  │                     └─ Transaction Table
│  │
│  └─ /reports/annual → AnnualReportPage
│                       ├─ Navbar
│                       ├─ Year Selector
│                       ├─ Annual Cards
│                       └─ Monthly Breakdown
```

## State Management

```
AuthContext
├─ user: User | null
├─ token: string | null
└─ Methods:
   ├─ login(email, password)
   ├─ signup(email, name, password)
   └─ logout()

Component Local State
├─ Dashboard: transactions[], activeTab
├─ DailyReportPage: report, selectedDate, loading
├─ MonthlyReportPage: report, selectedMonth, loading
├─ AnnualReportPage: report, selectedYear, loading
├─ TransactionForm: type, amount, date, category, description
└─ Login/Signup: email, password, error, loading
```

## API Response Formats

### Success Response
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Error Response
```json
{
  "message": "Error description"
}
```

### Transaction Response
```json
{
  "id": "uuid",
  "type": "debit",
  "amount": 100.50,
  "description": "Grocery shopping",
  "category": "Food",
  "date": "2024-01-28"
}
```

### Report Response (Monthly)
```json
{
  "month": "2024-01",
  "totalDebits": 2500.00,
  "totalCredits": 5000.00,
  "balance": 2500.00,
  "transactions": [...]
}
```

## Technology Stack Overview

```
Frontend Layer
├─ Framework: React 18
├─ Language: TypeScript
├─ Build Tool: Vite
├─ Styling: Tailwind CSS
├─ State Management: React Context API
├─ Navigation: React Router v6
├─ HTTP Client: Axios
└─ UI Dependencies: react-router-dom, axios

Backend Layer
├─ Runtime: Node.js
├─ Framework: Express.js
├─ Language: TypeScript
├─ Database: SQLite3
├─ Authentication: JWT (jsonwebtoken)
├─ Security: bcryptjs
├─ CORS: cors package
└─ Environment: dotenv

Development Tools
├─ Package Manager: npm
├─ Version Control: Git
├─ Editor: Visual Studio Code
├─ Build Scripts: npm scripts
└─ Task Runner: VS Code Tasks
```

---

This architecture provides a secure, scalable, and maintainable structure for the FinanceHub application.
