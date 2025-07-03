import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiMenu, FiLogIn, FiLogOut, FiBarChart2, FiMail, FiPieChart
} from "react-icons/fi";
import { BsSun, BsMoon } from "react-icons/bs";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  const location = useLocation();
  const navigate = useNavigate();
  const isAuth = localStorage.getItem("auth") === "true";

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  const linkClass = (path) =>
    `flex items-center gap-1 px-3 py-2 rounded hover:bg-blue-100 dark:hover:bg-gray-700 ${
      location.pathname === path
        ? "bg-blue-500 text-white"
        : "text-blue-600 dark:text-blue-300"
    }`;

  return (
    <nav className="bg-white dark:bg-gray-900 shadow p-4 mb-6 text-sm">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {}
        <div className="flex items-center gap-4">
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-xl text-blue-600 dark:text-blue-300">
            <FiMenu />
          </button>
          <div className="hidden md:flex gap-3">
            <Link to="/submit" className={linkClass("/submit")}>
              <FiMail /> Обращение
            </Link>
            {isAuth && (
              <>
                <Link to="/dashboard" className={linkClass("/dashboard")}>
                  <FiPieChart /> Аналитика
                </Link>
                <Link to="/requests" className={linkClass("/requests")}>
                  <FiBarChart2 /> Обращения
                </Link>
              </>
            )}
          </div>
        </div>

        {}
        <div className="flex items-center gap-4">
          {}
          <button
            onClick={toggleTheme}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Переключить тему"
          >
            {theme === "dark" ? (
              <BsSun className="text-yellow-400 text-lg" />
            ) : (
              <BsMoon className="text-gray-800 text-lg" />
            )}
          </button>

          {isAuth ? (
            <button
              onClick={handleLogout}
              className="text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
            >
              <FiLogOut /> Выйти
            </button>
          ) : (
            <Link to="/login" className="text-blue-600 hover:underline flex items-center gap-1 dark:text-blue-300">
              <FiLogIn /> Вход
            </Link>
          )}
        </div>
      </div>

      {}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-2">
          <Link to="/submit" className={linkClass("/submit")}>
            <FiMail /> Обращение
          </Link>
          {isAuth && (
            <>
              <Link to="/dashboard" className={linkClass("/dashboard")}>
                <FiPieChart /> Аналитика
              </Link>
              <Link to="/requests" className={linkClass("/requests")}>
                <FiBarChart2 /> Обращения
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
