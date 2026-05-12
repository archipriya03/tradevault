import React from "react";
import Menu from "./Menu";
import { useNavigate } from "react-router-dom";

const TopBar = () => {


  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "http://localhost:3000/login";
  };

  return (
    <div className="topbar-container">
      <div className="indices-container">
        <div className="nifty">
          <p className="index">NIFTY 50</p>
          <p className="index-points">{100.2}</p>
          <p className="percent"></p>
        </div>
        <div className="sensex">
          <p className="index">SENSEX</p>
          <p className="index-points">{100.2}</p>
          <p className="percent"></p>
        </div>
      </div>

      <Menu />

      {/* User info + Logout */}
      <div style={styles.userSection}>
        <div style={styles.avatar}>
          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
        </div>
        <span style={styles.userName}>{user.name || "User"}</span>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </div>
  );
};

const styles = {
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginLeft: "auto",
    paddingRight: "16px",
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "#387ed1",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "14px",
  },
  userName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1a1a1a",
  },
  logoutBtn: {
    padding: "6px 14px",
    border: "1.5px solid #d1d5db",
    borderRadius: "4px",
    background: "transparent",
    fontSize: "13px",
    cursor: "pointer",
    color: "#374151",
    fontFamily: "inherit",
  },
};

export default TopBar;