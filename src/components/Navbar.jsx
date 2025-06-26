import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiLogIn, FiLogOut, FiBarChart2, FiMail, FiPieChart } from "react-icons/fi";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isAuth = localStorage.getItem("auth") === "true";

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

  const linkClass = (path) =>
    `flex items-center gap-1 px-3 py-2 rounded hover:bg-blue-100 ${
      location.pathname === path ? "bg-blue-500 text-white" : "text-blue-600"
    }`;

  return (
    <nav className="bg-white shadow p-4 mb-6">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-xl">
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

        <div className="text-sm">
          {isAuth ? (
            <button
              onClick={handleLogout}
              className="text-red-600 hover:underline flex items-center gap-1"
            >
              <FiLogOut /> Выйти
            </button>
          ) : (
            <Link to="/login" className="text-blue-600 hover:underline flex items-center gap-1">
              <FiLogIn /> Вход
            </Link>
          )}
        </div>
      </div>

      {/* Мобильное меню */}
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
