import React, { createContext, useContext, useState, useEffect } from "react";
import { mockTransactions } from "../data/mockData";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [role, setRole] = useState(() => localStorage.getItem("ff_role") || "viewer");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("ff_dark") === "true");
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("ff_transactions");
    return saved ? JSON.parse(saved) : mockTransactions;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortField, setSortField] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => { localStorage.setItem("ff_role", role); }, [role]);
  useEffect(() => { localStorage.setItem("ff_dark", darkMode); }, [darkMode]);
  useEffect(() => { localStorage.setItem("ff_transactions", JSON.stringify(transactions)); }, [transactions]);

  const addTransaction = (tx) => {
    const newTx = { ...tx, id: Date.now() };
    setTransactions(prev => [newTx, ...prev]);
  };

  const editTransaction = (id, updated) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const filteredTransactions = transactions
    .filter(t => {
      const matchSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = filterType === "all" || t.type === filterType;
      const matchCat = filterCategory === "all" || t.category === filterCategory;
      return matchSearch && matchType && matchCat;
    })
    .sort((a, b) => {
      let valA = a[sortField], valB = b[sortField];
      if (sortField === "amount") { valA = Math.abs(valA); valB = Math.abs(valB); }
      if (sortField === "date") { valA = new Date(valA); valB = new Date(valB); }
      return sortDir === "asc" ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });

  const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === "expense").reduce((s, t) => s + Math.abs(t.amount), 0);
  const totalBalance = totalIncome - totalExpenses;

  const categories = [...new Set(transactions.map(t => t.category))];

  return (
    <AppContext.Provider value={{
      role, setRole, darkMode, setDarkMode,
      transactions, addTransaction, editTransaction, deleteTransaction,
      searchQuery, setSearchQuery, filterType, setFilterType,
      filterCategory, setFilterCategory, sortField, setSortField, sortDir, setSortDir,
      filteredTransactions, totalIncome, totalExpenses, totalBalance,
      categories, activeTab, setActiveTab
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
