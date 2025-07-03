import React, { useEffect, useState, useMemo } from "react";
import {
  PieChart, Pie, Cell, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis,
  LineChart, Line, CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  PieChartOutlined,
  BarChartOutlined,
  AreaChartOutlined,
  ExperimentOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";

import InfoCard from "../components/InfoCard"; 

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

  const countByField = (data, field) => {
    const counts = {};
    data.forEach((r) => {
      const key = r[field] || "Не указано";
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const getSentimentData = useMemo(() => {
    const counts = { позитив: 0, нейтрально: 0, негатив: 0 };
    requests.forEach((r) => {
      const s = r.aiResult?.sentiment || "нейтрально";
      counts[s] = (counts[s] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [requests]);

  const getDateData = useMemo(() => {
    const counts = {};
    requests.forEach((r) => {
      const date = r.createdAt?.slice(0, 10) || "Не указано";
      counts[date] = (counts[date] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [requests]);

  const regionData = useMemo(() => countByField(requests, "region"), [requests]);
  const categoryData = useMemo(() => countByField(requests, "subcategory"), [requests]);
  const statusData = useMemo(() => countByField(requests, "status"), [requests]);

  const total = requests.length;

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4">
      <div className="flex items-center justify-center gap-2 mb-4">
        <BarChartOutlined className="text-3xl text-blue-600" />
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
          <InfoCard title="📍 Распределение по регионам" icon={<PieChartOutlined />}>
            <PieChartContent data={regionData} />
          </InfoCard>

          <InfoCard title="🗂 Темы обращений" icon={<BarChartOutlined />}>
            <BarChartContent data={categoryData} />
          </InfoCard>

          <InfoCard title="🌈 Тональность (AI)" icon={<ExperimentOutlined />}>
            <PieChartContent data={getSentimentData} useSentimentColors />
          </InfoCard>

          <InfoCard title="📌 Статусы обращений" icon={<CheckCircleOutlined />}>
            <BarChartContent data={statusData} />
          </InfoCard>

          <InfoCard title="📅 Обращения по датам" icon={<AreaChartOutlined />}>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={getDateData}>
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </InfoCard>
        </div>
      )}
    </div>
  );
}

function PieChartContent({ data, useSentimentColors = false }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" outerRadius={90} dataKey="value" label>
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={
                useSentimentColors
                  ? entry.name === "позитив"
                    ? "#22c55e"
                    : entry.name === "негатив"
                    ? "#ef4444"
                    : "#a3a3a3"
                  : COLORS[index % COLORS.length]
              }
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

function BarChartContent({ data }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#10b981" />
      </BarChart>
    </ResponsiveContainer>
  );
}
