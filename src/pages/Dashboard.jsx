import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
} from "recharts";
import { FiBarChart2 } from "react-icons/fi";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#d946ef", "#f97316", "#10b981"];

export default function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/api/requests")
      .then((res) => res.json())
      .then((data) => {
        setRequests(data);
        setLoading(false);
      });
  }, []);

  const getRegionData = () => {
    const counts = {};
    requests.forEach((r) => {
      const key = r.region || "Не указано";
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const getSubcategoryData = () => {
    const counts = {};
    requests.forEach((r) => {
      const key = r.subcategory || "Не указано";
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const getSentimentData = () => {
    const counts = { позитив: 0, нейтрально: 0, негатив: 0 };
    requests.forEach((r) => {
      const s = r.aiResult?.sentiment || "нейтрально";
      counts[s] = (counts[s] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const total = requests.length;

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4">
      <div className="flex items-center justify-center gap-2 mb-4">
        <FiBarChart2 className="text-3xl text-blue-600" />
        <h2 className="text-3xl font-bold text-center">Аналитика обращений</h2>
      </div>

      <p className="text-center text-gray-600 text-sm mb-8">
        Всего обращений: <span className="font-semibold">{loading ? "..." : total}</span>
      </p>

      <hr className="mb-8" />

      {loading ? (
        <p className="text-center text-gray-400">Загрузка данных...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* 📍 Регионы */}
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">📍 Распределение по регионам</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={getRegionData()}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label
                >
                  {getRegionData().map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 🗂 Темы */}
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">🗂 Темы обращений</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={getSubcategoryData()}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 🌈 Тональность */}
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">🌈 Тональность (AI)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={getSentimentData()}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label
                >
                  {getSentimentData().map((entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        entry.name === "позитив" ? "#22c55e"
                        : entry.name === "негатив" ? "#ef4444"
                        : "#a3a3a3"
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
