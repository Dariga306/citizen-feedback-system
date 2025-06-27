import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Table, Select, Tag, Spin, Button, Input, Image } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import debounce from "lodash.debounce";

const { Option } = Select;

export default function RequestsTable() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const executors = ["Айбек", "Дана", "Ербол", "Сауле"];

  useEffect(() => {
    fetch("http://localhost:4000/api/requests")
      .then((res) => res.json())
      .then((data) => {
        setRequests(data);
        setLoading(false);
      });
  }, []);

  const updateField = useCallback(async (id, field, value) => {
    setRequests((prev) =>
      prev.map((r) => (r._id === id ? { ...r, [field]: value } : r))
    );

    await fetch(`http://localhost:4000/api/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
  }, []);

  const unique = (key) => [...new Set(requests.map((r) => r[key]).filter(Boolean))];

  const sentimentColor = (s) =>
    s === "позитив" ? "green" : s === "негатив" ? "red" : "default";

  const statusColor = {
    "Новое": "blue",
    "В работе": "orange",
    "Завершено": "green",
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      requests.map((r) => ({
        Имя: r.name,
        Регион: r.region,
        Категория: r.category,
        Подтема: r.subcategory,
        Сообщение: r.message,
        Контакт: r.contact,
        Интенция: r.aiResult?.intent,
        Тональность: r.aiResult?.sentiment,
        Статус: r.status,
        Исполнитель: r.executor,
        Дата: r.createdAt?.slice(0, 10),
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Обращения");

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(file, "обращения.xlsx");
  };

  const handleSearch = useMemo(() => debounce((value) => {
    setSearchText(value.toLowerCase());
  }, 300), []);

  const filteredRequests = useMemo(() => {
    return requests.filter((r) =>
      r.message?.toLowerCase().includes(searchText)
    );
  }, [requests, searchText]);

  const columns = [
    {
      title: "Имя",
      dataIndex: "name",
      sorter: (a, b) => a.name?.localeCompare(b.name),
    },
    {
      title: "Регион",
      dataIndex: "region",
      filters: unique("region").map((r) => ({ text: r, value: r })),
      onFilter: (value, record) => record.region === value,
    },
    {
      title: "Категория",
      dataIndex: "category",
      filters: unique("category").map((c) => ({ text: c, value: c })),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: "Подтема",
      dataIndex: "subcategory",
      filters: unique("subcategory").map((s) => ({ text: s, value: s })),
      onFilter: (value, record) => record.subcategory === value,
    },
    {
      title: "Сообщение",
      dataIndex: "message",
      sorter: (a, b) => (a.message?.length || 0) - (b.message?.length || 0),
    },
    {
      title: "Контакт",
      dataIndex: "contact",
    },
    {
      title: "AI: Интенция",
      dataIndex: ["aiResult", "intent"],
    },
    {
      title: "AI: Тональность",
      dataIndex: ["aiResult", "sentiment"],
      filters: ["позитив", "негатив", "нейтрально"].map((s) => ({ text: s, value: s })),
      onFilter: (value, record) => record.aiResult?.sentiment === value,
      render: (text) => <Tag color={sentimentColor(text)}>{text || "-"}</Tag>,
    },
    {
      title: "🟡 Статус",
      dataIndex: "status",
      filters: Object.keys(statusColor).map((s) => ({ text: s, value: s })),
      onFilter: (value, record) => record.status === value,
      render: (text, record) => (
        <Select
          defaultValue={text || "Новое"}
          style={{ width: 120 }}
          onChange={(value) => updateField(record._id, "status", value)}
        >
          {Object.keys(statusColor).map((s) => (
            <Option key={s} value={s}>
              <Tag color={statusColor[s]}>{s}</Tag>
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "👤 Исполнитель",
      dataIndex: "executor",
      render: (text, record) => (
        <Select
          defaultValue={text || ""}
          style={{ width: 120 }}
          onChange={(value) => updateField(record._id, "executor", value)}
        >
          <Option value="">—</Option>
          {executors.map((e) => (
            <Option key={e} value={e}>
              {e}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "📎 Вложение",
      dataIndex: "attachment",
      render: (img) =>
        img ? (
          <a href={img} target="_blank" rel="noreferrer">
            <Image
              src={img}
              alt="вложение"
              width={50}
              height={50}
              style={{ objectFit: "cover", borderRadius: 4 }}
              preview={false}
            />
          </a>
        ) : (
          "-"
        ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-6">📋 Обращения</h2>

      <Input.Search
        placeholder="Поиск по сообщению..."
        onChange={(e) => handleSearch(e.target.value)}
        enterButton
        allowClear
        className="mb-4 max-w-md"
      />

      <Button
        type="primary"
        icon={<DownloadOutlined />}
        onClick={exportToExcel}
        className="mb-4 ml-4"
      >
        Экспорт в Excel
      </Button>

      {loading ? (
        <Spin size="large" className="block mx-auto mt-10" />
      ) : (
        <Table
          columns={columns}
          dataSource={filteredRequests}
          rowKey="_id"
          bordered
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
        />
      )}
    </div>
  );
}
