# FinFlow — Finance Dashboard

A clean, interactive personal finance dashboard built with **React + Vite + Recharts**.

---

## 🚀 Setup & Run

### Prerequisites
- Node.js 18+ installed

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

### Build for Production
```bash
npm run build
npm run preview
```

---

## 📋 Features Overview

### 1. Dashboard Overview
- **Summary Cards**: Total Balance, Income, Expenses, and Savings Rate — all calculated live from transaction data
- **Bar Chart**: Monthly income vs expenses side-by-side comparison
- **Donut Chart**: Spending breakdown by category
- **Area Chart**: Balance trend over months
- **Recent Transactions**: Quick glance at the 5 most recent entries

### 2. Transactions Section
- Full table of all transactions with date, description, category, type, and amount
- **Search**: Filter by description or category name
- **Filter by Type**: All / Income / Expense
- **Filter by Category**: Dynamic dropdown from actual data
- **Sorting**: Click any column header (Date, Description, Amount) to sort ascending/descending
- **Export to CSV**: Download filtered transactions as a CSV file

### 3. Role-Based UI (RBAC Simulation)
- **Viewer Role**: Can view all data, charts, and insights — no edit access
- **Admin Role**: Can add new transactions, edit existing ones, and delete them
- Switch roles via the dropdown in the top header — changes take effect immediately
- Role is persisted in localStorage between sessions

### 4. Insights Section
- **5 Smart Insight Cards**: Top spending category, expense trend, savings rate, income change, budget tip
- **Horizontal Bar Chart**: Visual spending ranked by category
- **Radar Chart**: Spending pattern across top 6 categories
- **Monthly Comparison Table**: Month-over-month income, expenses, savings, and savings rate with progress bars

### 5. State Management
- **React Context API** (`AppContext`) used as the central store
- Manages: transactions, role, dark mode, filters (search, type, category), sort field/direction, and active tab
- All state changes automatically derive filtered/sorted transaction lists
- **localStorage persistence**: transactions, role, and dark mode survive page refreshes

### 6. UI/UX
- **Dark Mode**: Toggle in the header — persists across sessions
- **Fully Responsive**: Works on mobile, tablet, and desktop
- **Empty States**: Friendly "no results" message when filters return nothing
- **Transitions**: Hover effects on cards, rows, and buttons for a polished feel
- **Color-coded**: Income = green, Expense = red, each category has its own accent color

---

## 🏗 Project Structure

```
src/
├── components/
│   ├── Dashboard.jsx     # Overview with summary cards + charts
│   ├── Header.jsx        # Top bar with role switcher + dark mode
│   ├── Insights.jsx      # Analytics, radar, comparison table
│   ├── Sidebar.jsx       # Navigation sidebar
│   └── Transactions.jsx  # Full table with CRUD + filters
├── context/
│   └── AppContext.jsx    # Global state (Context API)
├── data/
│   └── mockData.js       # 40 mock transactions + monthly data
├── App.jsx
├── main.jsx
└── styles.css
```

---

## 🛠 Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite | Build tool / dev server |
| Recharts | Charts (Bar, Area, Pie, Radar) |
| Lucide React | Icon library |
| CSS Variables | Theming (light/dark) |
| localStorage | Data persistence |

---

## 💡 Design Decisions

- **No external UI library**: All components styled from scratch with pure CSS for full control and performance
- **Context API over Redux**: Application state is modest in scale; Context avoids unnecessary complexity
- **Mock data**: 40 realistic transactions across 4 months to make all charts and insights meaningful
- **Role simulation**: No backend needed — role state drives conditional rendering throughout the app

---

## 📱 Responsive Breakpoints

- **Desktop** (>900px): Full 4-column card grid, side-by-side charts
- **Tablet** (640–900px): 2-column card grid, stacked charts  
- **Mobile** (<640px): Hamburger sidebar, 2-column cards, simplified table

---

*Built as a frontend intern assignment — FinFlow v1.0.0*
