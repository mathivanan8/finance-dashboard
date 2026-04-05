import React from "react";
import { useApp } from "../context/AppContext";
import { Wallet, TrendingUp, TrendingDown, Activity } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { monthlyData, categoryColors } from "../data/mockData";

const fmt = (n) => `₹${Math.abs(n).toLocaleString("en-IN")}`;

export default function Dashboard() {
  const { totalBalance, totalIncome, totalExpenses, transactions } = useApp();

  // Spending by category
  const categorySpend = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {});
  const pieData = Object.entries(categorySpend)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : 0;

  return (
    <div className="dashboard">
      {/* Summary Cards */}
      <div className="cards-grid">
        <SummaryCard icon={<Wallet />} label="Total Balance" value={fmt(totalBalance)} color="blue" positive={totalBalance >= 0} />
        <SummaryCard icon={<TrendingUp />} label="Total Income" value={fmt(totalIncome)} color="green" positive />
        <SummaryCard icon={<TrendingDown />} label="Total Expenses" value={fmt(totalExpenses)} color="red" positive={false} />
        <SummaryCard icon={<Activity />} label="Savings Rate" value={`${savingsRate}%`} color="purple" positive={savingsRate > 20} />
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        <div className="chart-card wide">
          <h3 className="chart-title">Monthly Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Spending Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={categoryColors[entry.name] || "#94a3b8"} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Legend iconType="circle" iconSize={10} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Balance Trend */}
      <div className="chart-card full-width">
        <h3 className="chart-title">Balance Trend</h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
            <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
            <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 8 }} />
            <Area type="monotone" dataKey="balance" name="Balance" stroke="#6366f1" strokeWidth={2.5} fill="url(#balanceGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Transactions */}
      <div className="recent-section">
        <h3 className="chart-title">Recent Transactions</h3>
        <div className="recent-list">
          {transactions.slice(0, 5).map(t => (
            <div key={t.id} className="recent-item">
              <div className="recent-dot" style={{ background: categoryColors[t.category] || "#94a3b8" }} />
              <div className="recent-info">
                <span className="recent-desc">{t.description}</span>
                <span className="recent-cat">{t.category}</span>
              </div>
              <div className="recent-meta">
                <span className={`recent-amount ${t.type}`}>{t.type === "income" ? "+" : ""}{fmt(t.amount)}</span>
                <span className="recent-date">{new Date(t.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value, color, positive }) {
  return (
    <div className={`summary-card card-${color}`}>
      <div className={`card-icon icon-${color}`}>{icon}</div>
      <div className="card-content">
        <p className="card-label">{label}</p>
        <p className={`card-value ${!positive && color !== "purple" ? "negative" : ""}`}>{value}</p>
      </div>
    </div>
  );
}
