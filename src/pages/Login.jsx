import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "admin@gov.kz" && password === "moderator123") {
      localStorage.setItem("auth", "true");
      navigate("/dashboard", { replace: true });
    } else {
      setError("Неверный логин или пароль");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 rounded shadow bg-white dark:bg-gray-900">
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-white">
        🔐 Вход для модератора
      </h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:text-white"
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:text-white"
          required
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          Войти
        </button>
      </form>
    </div>
  );
}
