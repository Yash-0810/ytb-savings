# Financial Management Website - FinanceHub

## Project Overview
A full-stack financial management application with:
- React + TypeScript frontend with Vite
- Node.js + Express backend with TypeScript
- SQLite database
- JWT authentication with bcryptjs
- Complete financial tracking and report generation

## Completed Features

### Frontend (React + TypeScript + Vite)
- ✅ Login page with form validation
- ✅ Signup page with password confirmation
- ✅ Dashboard with transaction management
- ✅ Daily report page with date picker
- ✅ Monthly report page with transaction list
- ✅ Annual report page with monthly breakdown
- ✅ Responsive design with Tailwind CSS
- ✅ Authentication context for state management
- ✅ API client with axios and JWT token handling
- ✅ Protected routes with authentication checks

### Backend (Node.js + Express)
- ✅ User authentication (login/signup)
- ✅ JWT token generation and verification
- ✅ Password hashing with bcryptjs
- ✅ Transaction API (create, read, delete)
- ✅ Daily report API
- ✅ Monthly report API
- ✅ Annual report API
- ✅ SQLite database with proper schema
- ✅ CORS enabled for cross-origin requests
- ✅ Middleware for token authentication

### Database (SQLite)
- ✅ Users table with encrypted passwords
- ✅ Transactions table with user relationships
- ✅ Foreign key constraints
- ✅ Auto-generated timestamps

### UI/UX
- ✅ Modern gradient backgrounds
- ✅ Color-coded transaction types
- ✅ Summary cards for quick overview
- ✅ Responsive grid layouts
- ✅ Clean navigation
- ✅ Professional styling

## Setup Instructions

### 1. Install Node.js
Download from https://nodejs.org/ (LTS version recommended)

### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4. Access Application
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Default Test Credentials
- Email: `user@example.com`
- Password: `password123`

## File Structure

```
Saving/
├── frontend/
│   ├── src/
│   │   ├── pages/         # Login, Signup, Dashboard, Reports
│   │   ├── components/    # Navbar, TransactionForm, TransactionList
│   │   ├── api/           # API client configuration
│   │   ├── context/       # AuthContext for state management
│   │   ├── types/         # TypeScript interfaces
│   │   ├── App.tsx        # Main app with routing
│   │   └── main.tsx
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── routes/        # auth, transactions, reports
│   │   ├── middleware/    # authentication middleware
│   │   ├── utils/         # auth helpers
│   │   ├── db/            # database setup
│   │   └── index.ts       # server entry point
│   ├── .env               # environment variables
│   ├── tsconfig.json
│   └── package.json
│
├── .vscode/
│   ├── tasks.json
│   └── settings.json
│
├── README.md
├── SETUP.md
└── .github/copilot-instructions.md
```

## API Endpoints Summary

### Auth
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Add transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Reports
- `GET /api/reports/daily?date=YYYY-MM-DD` - Daily report
- `GET /api/reports/monthly?month=YYYY-MM` - Monthly report
- `GET /api/reports/annual?year=YYYY` - Annual report

## Technologies Used

| Category | Technologies |
|----------|---------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, React Router, Axios |
| Backend | Node.js, Express, TypeScript, SQLite, JWT, bcryptjs |
| Database | SQLite3 |
| Tools | VS Code, Git |

## Development Guidelines

1. **TypeScript**: All code uses strict TypeScript for type safety
2. **Styling**: Tailwind CSS for responsive design
3. **API Calls**: Axios with interceptors for JWT auth
4. **State Management**: React Context API for auth state
5. **Database**: SQLite with proper schema and relationships
6. **Security**: JWT tokens + bcryptjs password hashing

## Next Steps for Enhancement

1. Add transaction editing feature
2. Implement budget tracking
3. Add recurring transaction support
4. Create data export (CSV/PDF)
5. Add charts and visualizations
6. Implement advanced filtering
7. Add expense categories with icons
8. Create mobile app version

## Environment Setup

Backend `.env` file:
```
PORT=5000
JWT_SECRET=financehub_secret_key_2024_change_in_production
NODE_ENV=development
```

## Running Tasks in VS Code

Tasks are configured in `.vscode/tasks.json`:
- Install Dependencies
- Install Frontend Dependencies
- Start Backend
- Start Frontend
- Install All Dependencies

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port already in use | Kill process or change PORT in .env |
| Dependencies error | Delete node_modules and run npm install again |
| Login fails | Clear localStorage and restart servers |
| Database issues | Delete finance.db (recreates on startup) |

## Production Build

**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:**
```bash
cd backend
npm run build
npm start
```
