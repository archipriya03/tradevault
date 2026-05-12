import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "./components/Home";

// Get token and user from URL (passed from login page)
const urlParams = new URLSearchParams(window.location.search);
const tokenFromUrl = urlParams.get("token");
const userFromUrl = urlParams.get("user");

if (tokenFromUrl) {
  localStorage.setItem("token", tokenFromUrl);
  if (userFromUrl) {
    localStorage.setItem("user", decodeURIComponent(userFromUrl));
  }
  window.history.replaceState({}, document.title, "/");
}

const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "http://localhost:3000/login";
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);