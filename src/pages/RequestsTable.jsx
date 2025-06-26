import React, { useEffect, useState } from "react";

export default function RequestsTable() {
  const [requests, setRequests] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [issueTypeFilter, setIssueTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const executors = ["Айбек", "Дана", "Ербол", "Сауле", ""]; // 👤 Исполнители

  useEffect(() => {
    fetch("http://localhost:4000/api/requests")
      .then((res) => res.json())
      .then((data) => {
        setRequests(data);
        setLoading(false);
      });
  }, []);

  const updateField = async (id, field, value) => {
    const updated = requests.map((r) => (r._id === id ? { ...r, [field]: value } : r));
    setRequests(updated);

    await fetch(`http://localhost:4000/api/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
  };

  const filtered = requests.filter((r) => {
    return (
      (!categoryFilter || r.category === categoryFilter) &&
      (!regionFilter || r.region === regionFilter) &&
      (!issueTypeFilter || r.subcategory === issueTypeFilter)
    );
  });

  const unique = (key) => [...new Set(requests.map((r) => r[key]).filter(Boolean))];

  const colorForSentiment = (s) => {
    if (s === "позитив") return "text-green-600";
    if (s === "негатив") return "text-red-600";
    return "text-gray-500";
  };

  const statusColors = {
    "Новое": "text-blue-600",
    "В работе": "text-yellow-600",
    "Завершено": "text-green-600",
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6">📋 Обращения</h2>

      {/* Фильтры */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="p-2 border rounded">
          <option value="">Все категории</option>
          {unique("category").map((c) => <option key={c}>{c}</option>)}
        </select>

        <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)} className="p-2 border rounded">
          <option value="">Все регионы</option>
          {unique("region").map((r) => <option key={r}>{r}</option>)}
        </select>

        <select value={issueTypeFilter} onChange={(e) => setIssueTypeFilter(e.target.value)} className="p-2 border rounded">
          <option value="">Все подтемы</option>
          {unique("subcategory").map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Загрузка / Нет данных */}
      {loading ? (
        <p className="text-center text-gray-500">Загрузка...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500">Нет обращений</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm text-left">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
              <tr>
                <th className="p-2 border">Имя</th>
                <th className="p-2 border">Регион</th>
                <th className="p-2 border">Категория</th>
                <th className="p-2 border">Подтема</th>
                <th className="p-2 border">Сообщение</th>
                <th className="p-2 border">Контакт</th>
                <th className="p-2 border">AI: Интенция</th>
                <th className="p-2 border">AI: Тональность</th>
                <th className="p-2 border">🟡 Статус</th>
                <th className="p-2 border">👤 Исполнитель</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r._id} className="border-b hover:bg-gray-50">
                  <td className="p-2 border">{r.name}</td>
                  <td className="p-2 border">{r.region}</td>
                  <td className="p-2 border">{r.category}</td>
                  <td className="p-2 border">{r.subcategory}</td>
                  <td className="p-2 border">{r.message}</td>
                  <td className="p-2 border">{r.contact || "-"}</td>
                  <td className="p-2 border">{r.aiResult?.intent || "-"}</td>
                  <td className={`p-2 border ${colorForSentiment(r.aiResult?.sentiment)}`}>
                    {r.aiResult?.sentiment || "-"}
                  </td>
                  <td className="p-2 border">
                    <select
                      value={r.status || "Новое"}
                      onChange={(e) => updateField(r._id, "status", e.target.value)}
                      className={`text-sm ${statusColors[r.status || "Новое"]}`}
                    >
                      <option>Новое</option>
                      <option>В работе</option>
                      <option>Завершено</option>
                    </select>
                  </td>
                  <td className="p-2 border">
                    <select
                      value={r.executor || ""}
                      onChange={(e) => updateField(r._id, "executor", e.target.value)}
                      className="text-sm"
                    >
                      <option value="">—</option>
                      {executors.map((e) => (
                        <option key={e} value={e}>{e}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
