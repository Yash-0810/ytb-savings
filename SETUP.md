# FinanceHub - Complete Setup Instructions

## Project Structure
```
Saving/
├── frontend/          # React + TypeScript + Vite app
├── backend/           # Node.js + Express API server
├── .github/           # GitHub configuration
└── README.md
```

## Prerequisites
Before you begin, you'll need to install:
1. **Node.js 18+** - Download from https://nodejs.org/
2. **Git** - Download from https://git-scm.com/

## Quick Start Guide

### Step 1: Install Node.js
1. Visit https://nodejs.org/
2. Download the LTS version
3. Run the installer
4. Verify installation: `node --version` and `npm --version`

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies
```bash
cd frontend
npm install
```

### Step 4: Setup Environment Variables
Create a `.env` file in the backend directory:
```
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```
PORT=5000
JWT_SECRET=your_secret_key_here_change_in_production
NODE_ENV=development
```

### Step 5: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on http://localhost:5173

### Step 6: Access the Application
Open your browser and go to http://localhost:5173

### Default Login Credentials
- Email: `user@example.com`
- Password: `password123`

## Available Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run compiled backend

### Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Features Implemented

### Authentication
- User Registration (Signup)
- User Login
- JWT Token-based Authorization
- Secure Password Hashing with bcryptjs

### Transaction Management
- Add manual debits and credits
- View all transactions
- Delete transactions
- Categorize transactions

### Report Generation
1. **Daily Reports** - Summary for selected date
   - Total debits and credits for the day
   - Daily balance
   
2. **Monthly Reports** - Detailed monthly analysis
   - Monthly totals and balance
   - All transactions in the month
   - Transaction list with details
   
3. **Annual Reports** - Yearly overview
   - Annual totals and balance
   - Monthly breakdown
   - Comparison across months

### UI/UX
- Modern, responsive design with Tailwind CSS
- Clean dashboard with summary cards
- Color-coded transaction types (green for credit, red for debit)
- Intuitive navigation
- Professional styling

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Transactions Table
```sql
CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,        -- 'debit' or 'credit'
  amount REAL NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  date TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
)
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Transactions
- `GET /api/transactions` - Get all user transactions
- `POST /api/transactions` - Add new transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Reports
- `GET /api/reports/daily?date=YYYY-MM-DD` - Get daily report
- `GET /api/reports/monthly?month=YYYY-MM` - Get monthly report
- `GET /api/reports/annual?year=YYYY` - Get annual report

## Technologies Used

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express
- SQLite3
- JWT (jsonwebtoken)
- bcryptjs
- TypeScript

## Troubleshooting

### Port Already in Use
If port 5000 or 5173 is in use:
- Backend: Change PORT in `.env`
- Frontend: Edit vite.config.ts and change port in server config

### Database Issues
- Delete `finance.db` file to reset database
- Tables will be recreated automatically on next server start

### Login Issues
- Clear browser localStorage: DevTools → Application → Local Storage
- Make sure backend is running on http://localhost:5000

## Next Steps
1. Create a demo account to test features
2. Add sample transactions
3. View daily, monthly, and annual reports
4. Customize categories and transaction types as needed

## Additional Features to Consider
- Transaction editing
- Budget tracking
- Recurring transactions
- Data export (CSV/PDF)
- Charts and visualizations
- Multi-currency support
- Transaction search and filters

---

For more help, check the README.md in the project root.
