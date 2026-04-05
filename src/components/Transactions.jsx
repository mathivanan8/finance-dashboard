import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { categoryColors } from "../data/mockData";
import { Search, Plus, Trash2, Edit2, ChevronUp, ChevronDown, Download, X, Check } from "lucide-react";

const CATEGORIES = ["Income","Housing","Food","Transport","Entertainment","Shopping","Utilities","Health","Education"];
const fmt = (n) => `₹${Math.abs(n).toLocaleString("en-IN")}`;

export default function Transactions() {
  const {
    role, filteredTransactions, addTransaction, editTransaction, deleteTransaction,
    searchQuery, setSearchQuery, filterType, setFilterType,
    filterCategory, setFilterCategory, sortField, setSortField, sortDir, setSortDir,
    categories
  } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ date: "", description: "", amount: "", category: "Food", type: "expense" });
  const [formError, setFormError] = useState("");

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  const openAdd = () => {
    setEditId(null);
    setForm({ date: new Date().toISOString().split("T")[0], description: "", amount: "", category: "Food", type: "expense" });
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (tx) => {
    setEditId(tx.id);
    setForm({ date: tx.date, description: tx.description, amount: Math.abs(tx.amount), category: tx.category, type: tx.type });
    setFormError("");
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!form.date || !form.description || !form.amount) {
      setFormError("Please fill all required fields.");
      return;
    }
    const amt = parseFloat(form.amount);
    if (isNaN(amt) || amt <= 0) { setFormError("Enter a valid positive amount."); return; }
    const data = { ...form, amount: form.type === "expense" ? -amt : amt };
    if (editId) editTransaction(editId, data);
    else addTransaction(data);
    setShowModal(false);
  };

  const exportCSV = () => {
    const headers = ["Date","Description","Category","Type","Amount"];
    const rows = filteredTransactions.map(t => [t.date, t.description, t.category, t.type, t.amount]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "transactions.csv";
    a.click();
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronDown size={14} className="sort-icon inactive" />;
    return sortDir === "asc" ? <ChevronUp size={14} className="sort-icon" /> : <ChevronDown size={14} className="sort-icon" />;
  };

  return (
    <div className="transactions-page">
      {/* Filters */}
      <div className="filters-bar">
        <div className="search-wrap">
          <Search size={16} className="search-icon" />
          <input
            className="search-input"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <select className="filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select className="filter-select" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <div className="filter-actions">
          <button className="outline-btn" onClick={exportCSV} title="Export CSV">
            <Download size={15} /> Export
          </button>
          {role === "admin" && (
            <button className="primary-btn" onClick={openAdd}>
              <Plus size={15} /> Add
            </button>
          )}
        </div>
      </div>

      {/* Stats bar */}
      <div className="tx-stats">
        <span className="tx-stat">{filteredTransactions.length} transactions</span>
        <span className="tx-stat income">Income: {fmt(filteredTransactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0))}</span>
        <span className="tx-stat expense">Expenses: {fmt(filteredTransactions.filter(t => t.type === "expense").reduce((s, t) => s + Math.abs(t.amount), 0))}</span>
      </div>

      {/* Table */}
      {filteredTransactions.length === 0 ? (
        <div className="empty-state">
          <p>🔍 No transactions found</p>
          <small>Try adjusting your filters</small>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="tx-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("date")} className="sortable">Date <SortIcon field="date" /></th>
                <th onClick={() => handleSort("description")} className="sortable">Description <SortIcon field="description" /></th>
                <th>Category</th>
                <th>Type</th>
                <th onClick={() => handleSort("amount")} className="sortable">Amount <SortIcon field="amount" /></th>
                {role === "admin" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(tx => (
                <tr key={tx.id} className="tx-row">
                  <td className="tx-date">{new Date(tx.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                  <td className="tx-desc">{tx.description}</td>
                  <td>
                    <span className="cat-chip" style={{ background: (categoryColors[tx.category] || "#94a3b8") + "22", color: categoryColors[tx.category] || "#94a3b8" }}>
                      {tx.category}
                    </span>
                  </td>
                  <td><span className={`type-badge ${tx.type}`}>{tx.type}</span></td>
                  <td className={`tx-amount ${tx.type}`}>{tx.type === "income" ? "+" : "-"}{fmt(tx.amount)}</td>
                  {role === "admin" && (
                    <td className="tx-actions">
                      <button className="action-btn edit" onClick={() => openEdit(tx)}><Edit2 size={14} /></button>
                      <button className="action-btn del" onClick={() => deleteTransaction(tx.id)}><Trash2 size={14} /></button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editId ? "Edit Transaction" : "Add Transaction"}</h3>
              <button className="icon-btn" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              {formError && <div className="form-error">{formError}</div>}
              <label>Date *</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="form-input" />
              <label>Description *</label>
              <input type="text" placeholder="e.g. Grocery Store" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="form-input" />
              <label>Amount (₹) *</label>
              <input type="number" placeholder="0.00" min="0" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="form-input" />
              <div className="form-row">
                <div>
                  <label>Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="form-input">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label>Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="form-input">
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="outline-btn" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="primary-btn" onClick={handleSubmit}><Check size={15} /> {editId ? "Save" : "Add"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
