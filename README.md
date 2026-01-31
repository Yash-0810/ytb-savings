# FinanceHub - Financial Management Website

A modern, full-stack web application for tracking debits and credits with comprehensive financial reporting capabilities.

## 🎯 Features

### Authentication & Security
- ✅ User registration and login with JWT tokens
- ✅ Secure password hashing with bcryptjs
- ✅ Session persistence with localStorage
- ✅ Protected routes and API endpoints

### Transaction Management
- ✅ Add manual debit and credit transactions
- ✅ Categorize transactions
- ✅ View transaction history
- ✅ Delete transactions
- ✅ Transaction date tracking

### Report Generation
1. **Daily Reports** - Summary for any selected date
   - Total debits and credits
   - Daily balance calculation
   - Date selector for historical data
   
2. **Monthly Reports** - Detailed monthly analysis
   - Monthly totals and balance
   - Complete transaction list
   - Date range filtering
   
3. **Annual Reports** - Yearly overview
   - Annual totals and balance
   - Monthly breakdown view
   - Trend analysis across months

### UI/UX Design
- ✅ Modern, responsive design with Tailwind CSS
- ✅ Mobile-friendly interface
- ✅ Clean dashboard with summary cards
- ✅ Color-coded transaction types (green: credit, red: debit)
- ✅ Intuitive navigation
- ✅ Professional gradient backgrounds

## 📁 Project Structure

```
Saving/
├── frontend/                  # React + TypeScript (Vite)
│   ├── src/
│   │   ├── pages/            # Login, Signup, Dashboard, Reports
│   │   ├── components/       # Reusable UI components
│   │   ├── api/              # API client
│   │   ├── context/          # Auth context
│   │   ├── types/            # TypeScript interfaces
│   │   ├── App.tsx           # Main app component
│   │   └── main.tsx          # Entry point
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── backend/                   # Node.js + Express
│   ├── src/
│   │   ├── routes/           # API routes (auth, transactions, reports)
│   │   ├── middleware/       # Auth middleware
│   │   ├── utils/            # Helper functions
│   │   ├── db/               # Database setup
│   │   └── index.ts          # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                  # Environment variables
│
├── .vscode/
│   ├── tasks.json           # VS Code tasks
│   └── settings.json        # Editor settings
├── .github/
│   └── copilot-instructions.md
├── SETUP.md                 # Detailed setup guide
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** - Download from https://nodejs.org/
- **npm** (comes with Node.js)
- **Git** (optional)

### Quick Start

1. **Install Dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   ```

2. **Start the Application**
   
   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   Backend runs on: `http://localhost:5000`

   **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on: `http://localhost:5173`

3. **Access the Application**
   - Open your browser and go to: `http://localhost:5173`

### Default Login Credentials
```
Email: user@example.com
Password: password123
```

## 📊 Available Scripts

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run compiled backend

### Frontend
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔗 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | Get all transactions |
| POST | `/api/transactions` | Add new transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/daily?date=YYYY-MM-DD` | Get daily report |
| GET | `/api/reports/monthly?month=YYYY-MM` | Get monthly report |
| GET | `/api/reports/annual?year=YYYY` | Get annual report |

## 💾 Database Schema

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

## 🛠 Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **Chart.js** - Data visualization (ready to use)

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **SQLite** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin support

## ⚙️ Configuration

### Backend Environment Variables
Create `.env` file in backend directory:
```
PORT=5000
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### Frontend Configuration
- API proxy configured in `vite.config.ts`
- Routes defined in `src/App.tsx`
- Styling with Tailwind CSS in `tailwind.config.js`

## 🔐 Security Features
- ✅ JWT-based authentication
- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ Protected API endpoints
- ✅ CORS enabled for cross-origin requests
- ✅ Secure token storage in localStorage

## 🎨 UI Components

### Pages
- **Login** - User authentication
- **Signup** - User registration
- **Dashboard** - Main interface with summary and transactions
- **Daily Report** - Daily financial summary
- **Monthly Report** - Monthly analysis with transactions
- **Annual Report** - Yearly overview with monthly breakdown

### Components
- **Navbar** - Navigation and logout
- **TransactionForm** - Add new transactions
- **TransactionList** - Display transactions in table format

## 📈 Future Enhancements
- Transaction editing capability
- Budget tracking and alerts
- Recurring transactions
- Data export (CSV/PDF)
- Advanced charts and visualizations
- Multi-currency support
- Transaction search and filters
- Expense categories with icons
- Mobile app version
- Cloud sync capabilities

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000
# Kill the process
kill -9 <PID>
```

### Database Issues
- Delete `finance.db` file to reset
- Tables recreate automatically on server start

### Login Issues
- Clear browser localStorage
- Ensure backend is running on `http://localhost:5000`
- Check `.env` file in backend directory

### Dependencies Issue
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 Notes

- All transactions are date-stamped and user-specific
- Reports are calculated in real-time from transaction data
- Currency shown in ₹ (can be customized)
- No external API dependencies required
- Database file (`finance.db`) created automatically

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to fork, modify, and improve this project!

---

**Happy Tracking! 💰**

For detailed setup instructions, see [SETUP.md](./SETUP.md)
