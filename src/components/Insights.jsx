import React from "react";
import { useApp } from "../context/AppContext";
import { categoryColors, monthlyData } from "../data/mockData";
import { TrendingUp, TrendingDown, AlertCircle, Award, Target } from "lucide-react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";

const fmt = (n) => `₹${Math.abs(n).toLocaleString("en-IN")}`;

export default function Insights() {
  const { transactions } = useApp();

  const categorySpend = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount); return acc; }, {});

  const sortedCats = Object.entries(categorySpend).sort((a, b) => b[1] - a[1]);
  const topCat = sortedCats[0];
  const totalExpenses = Object.values(categorySpend).reduce((a, b) => a + b, 0);
  const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : 0;

  // Monthly trend
  const latestMonth = monthlyData[monthlyData.length - 1];
  const prevMonth = monthlyData[monthlyData.length - 2];
  const expenseChange = prevMonth ? (((latestMonth.expenses - prevMonth.expenses) / prevMonth.expenses) * 100).toFixed(1) : 0;
  const incomeChange = prevMonth ? (((latestMonth.income - prevMonth.income) / prevMonth.income) * 100).toFixed(1) : 0;

  const radarData = sortedCats.slice(0, 6).map(([name, value]) => ({
    category: name,
    amount: value,
    fullMark: sortedCats[0][1]
  }));

  const catBarData = sortedCats.map(([name, value]) => ({ name, value, fill: categoryColors[name] || "#94a3b8" }));

  const insights = [
    { icon: <Award size={20} />, color: "#f59e0b", title: "Top Spending Category", text: topCat ? `${topCat[0]} accounts for ${((topCat[1] / totalExpenses) * 100).toFixed(1)}% of your expenses (${fmt(topCat[1])})` : "No data yet." },
    { icon: expenseChange > 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />, color: expenseChange > 0 ? "#ef4444" : "#22c55e", title: "Expense Trend", text: `Expenses ${expenseChange > 0 ? "increased" : "decreased"} by ${Math.abs(expenseChange)}% compared to last month.` },
    { icon: <Target size={20} />, color: "#6366f1", title: "Savings Rate", text: `You saved ${savingsRate}% of your income. ${savingsRate >= 20 ? "Great job! 🎉" : savingsRate >= 10 ? "Try to reach 20% for healthy savings." : "Consider cutting expenses to improve savings."}` },
    { icon: incomeChange >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />, color: incomeChange >= 0 ? "#22c55e" : "#ef4444", title: "Income Change", text: `Income ${incomeChange >= 0 ? "grew" : "dropped"} by ${Math.abs(incomeChange)}% this month vs last month.` },
    { icon: <AlertCircle size={20} />, color: "#14b8a6", title: "Budget Tip", text: topCat && topCat[1] / totalExpenses > 0.3 ? `${topCat[0]} is eating over 30% of your budget. Consider setting a spending limit.` : "Your spending seems balanced across categories. Keep it up!" },
  ];

  return (
    <div className="insights-page">
      {/* Insight Cards */}
      <div className="insight-cards">
        {insights.map((ins, i) => (
          <div key={i} className="insight-card">
            <div className="insight-icon" style={{ background: ins.color + "20", color: ins.color }}>{ins.icon}</div>
            <div>
              <p className="insight-title">{ins.title}</p>
              <p className="insight-text">{ins.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="charts-row">
        <div className="chart-card wide">
          <h3 className="chart-title">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={catBarData} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "var(--text-muted)", fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 12 }} width={60} />
              <Tooltip formatter={v => fmt(v)} contentStyle={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {catBarData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Spending Radar</h3>
          <ResponsiveContainer width="100%" height={230}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="category" tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
              <Radar name="Spend" dataKey="amount" stroke="#6366f1" fill="#6366f1" fillOpacity={0.35} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Comparison Table */}
      <div className="chart-card full-width">
        <h3 className="chart-title">Monthly Comparison</h3>
        <div className="comparison-table">
          <div className="comp-header">
            <span>Month</span><span>Income</span><span>Expenses</span><span>Saved</span><span>Savings Rate</span>
          </div>
          {monthlyData.map((m, i) => {
            const saved = m.income - m.expenses;
            const rate = ((saved / m.income) * 100).toFixed(1);
            const prevExp = i > 0 ? monthlyData[i-1].expenses : m.expenses;
            const delta = i > 0 ? ((m.expenses - prevExp) / prevExp * 100).toFixed(1) : null;
            return (
              <div key={m.month} className="comp-row">
                <span className="comp-month">{m.month} 2024</span>
                <span className="comp-income">+{fmt(m.income)}</span>
                <span className="comp-expense">
                  -{fmt(m.expenses)}
                  {delta && <span className={`delta ${delta > 0 ? "red" : "green"}`}> {delta > 0 ? "↑" : "↓"}{Math.abs(delta)}%</span>}
                </span>
                <span className={saved >= 0 ? "comp-saved" : "comp-loss"}>{saved >= 0 ? "+" : ""}{fmt(saved)}</span>
                <span>
                  <div className="rate-bar">
                    <div className="rate-fill" style={{ width: `${Math.min(rate, 100)}%`, background: rate >= 20 ? "#22c55e" : rate >= 10 ? "#f59e0b" : "#ef4444" }} />
                  </div>
                  <span className="rate-label">{rate}%</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
