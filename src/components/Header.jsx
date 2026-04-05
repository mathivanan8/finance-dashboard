import React from "react";
import { useApp } from "../context/AppContext";
import { Sun, Moon, Shield, Eye } from "lucide-react";

export default function Header() {
  const { role, setRole, darkMode, setDarkMode, activeTab } = useApp();

  const titles = { dashboard: "Dashboard Overview", transactions: "Transactions", insights: "Insights" };

  return (
    <header className="top-header">
      <div className="header-left">
        <h1 className="page-title">{titles[activeTab]}</h1>
        <span className={`role-badge ${role}`}>
          {role === "admin" ? <Shield size={12} /> : <Eye size={12} />}
          {role === "admin" ? "Admin" : "Viewer"}
        </span>
      </div>

      <div className="header-right">
        <select
          className="role-select"
          value={role}
          onChange={e => setRole(e.target.value)}
        >
          <option value="viewer">👁 Viewer</option>
          <option value="admin">🛡 Admin</option>
        </select>

        <button className="icon-btn" onClick={() => setDarkMode(!darkMode)} title="Toggle dark mode">
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
