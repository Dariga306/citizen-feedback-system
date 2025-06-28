import React, { useState, useEffect } from "react";

export default function SubmitForm() {
  const [form, setForm] = useState({
    name: "", region: "", category: "", subcategory: "",
    service: "", customService: "", contact: "", message: "", attachment: null,
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const maxMessageLength = 500;

  const categories = {
    "Портал eGov": ["Авторизация", "Получение справки", "Личный кабинет"],
    "ЭЦП / ЦОН": ["Ошибка ЭЦП", "Проблема с ключом", "Выдача ЭЦП"],
    "Платежи / Kaspi": ["Налоги", "Госпошлина", "Платёж не прошёл"],
    "Мобильные приложения": ["eGov Mobile", "Kaspi", "eLicense"],
    "Госуслуги": ["Прописка", "Регистрация ИП", "Соцподдержка"],
    "Другое": ["Другое"]
  };

  const regions = [
    "Абайская область", "Актюбинская область", "Алматинская область", "Атырауская область",
    "Восточно-Казахстанская область", "Жамбылская область", "Жетысуская область",
    "Западно-Казахстанская область", "Карагандинская область", "Костанайская область",
    "Кызылординская область", "Мангистауская область", "Павлодарская область",
    "Северо-Казахстанская область", "Туркестанская область", "Улытауская область",
    "Астана", "Алматы", "Шымкент"
  ].sort((a, b) => a.localeCompare(b, "ru"));

  const getServiceOptions = (category) => {
    const map = {
      "Портал eGov": ["eGov.kz", "Digital Agent", "NAO eOtinish"],
      "ЭЦП / ЦОН": ["pki.gov.kz", "ЦОН", "EGov Mobile"],
      "Платежи / Kaspi": ["Kaspi.kz", "eGov Payment", "Kassa24"],
      "Мобильные приложения": ["Kaspi App", "EGov Mobile", "eLicense Mobile"],
      "Госуслуги": ["eGov.kz", "eLicense.kz", "ENPF", "Qamqor.gov.kz"]
    };
    return map[category] || [];
  };

  useEffect(() => {
    if (form.subcategory && form.category && getServiceOptions(form.category).length > 0) {
      const service = getServiceOptions(form.category)[0];
      setForm((prev) => ({ ...prev, service }));
    }
  }, [form.subcategory, form.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "category" ? { subcategory: "", service: "", customService: "" } : {})
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSuccess(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, attachment: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Укажите имя";
    if (!form.region) newErrors.region = "Выберите регион";
    if (!form.category) newErrors.category = "Выберите категорию";
    if (form.category !== "Другое" && !form.subcategory) newErrors.subcategory = "Выберите подтему";
    const service = form.service === "other" ? form.customService.trim() : form.service;
    if (!service) newErrors.service = "Укажите сервис";
    if (!form.message.trim()) newErrors.message = "Введите сообщение";
    if (form.message.length > maxMessageLength) newErrors.message = `Максимум ${maxMessageLength} символов`;
    if (form.contact && !/^\+7\d{10}$/.test(form.contact)) newErrors.contact = "Введите номер в формате +7XXXXXXXXXX";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const aiRes = await fetch("http://localhost:4000/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: form.message }),
    });
    const aiResult = await aiRes.json();

    const finalService = form.service === "other"
      ? form.customService?.trim() || "Не указано"
      : form.service;

    const newEntry = {
      ...form,
      service: finalService,
      aiResult,
      status: "Новое",
      executor: "",
    };

    try {
      const res = await fetch("http://localhost:4000/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      });

      if (!res.ok) throw new Error("Ошибка при сохранении");

      setSuccess(true);
      setForm({
        name: "", region: "", category: "", subcategory: "",
        service: "", customService: "", contact: "", message: "", attachment: null,
      });
    } catch (err) {
      console.error("Ошибка отправки:", err);
      alert("Не удалось отправить. Проверь подключение к серверу.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded shadow text-gray-900 dark:text-gray-100 transition-all">
      <h2 className="text-2xl font-bold text-center mb-4">📬 Обращение гражданина</h2>
      {success && (
        <div className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 p-2 rounded mb-4 text-sm">
          Обращение успешно отправлено!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <input name="name" value={form.name} onChange={handleChange}
          placeholder="Ваше имя *"
          className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

        <select name="region" value={form.region} onChange={handleChange}
          className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white">
          <option value="">Выберите регион *</option>
          {regions.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        {errors.region && <p className="text-red-500 text-sm">{errors.region}</p>}

        <select name="category" value={form.category} onChange={handleChange}
          className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white">
          <option value="">Выберите категорию *</option>
          {Object.keys(categories).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}

        <select name="subcategory" value={form.subcategory} onChange={handleChange}
          disabled={!form.category}
          className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white">
          <option value="">Выберите подтему *</option>
          {form.category && categories[form.category]?.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {errors.subcategory && <p className="text-red-500 text-sm">{errors.subcategory}</p>}

        {form.category && (
          <>
            <select name="service" value={form.service} onChange={handleChange}
              className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white">
              <option value="">Выберите цифровой сервис *</option>
              {getServiceOptions(form.category).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
              <option value="other">Другое...</option>
            </select>
            {errors.service && <p className="text-red-500 text-sm">{errors.service}</p>}

            {form.service === "other" && (
              <input name="customService" value={form.customService || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, customService: e.target.value }))}
                placeholder="Введите название сервиса"
                className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            )}
          </>
        )}

        <textarea name="message" value={form.message} onChange={handleChange}
          placeholder="Текст обращения *"
          className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          rows="4" maxLength={maxMessageLength} />
        {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}

        <input
          name="contact"
          value={form.contact}
          onChange={handleChange}
          placeholder="Контакт (например, +77011234567)"
          className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          inputMode="tel"
          pattern="^\\+7\\d{10}$"
        />
        {errors.contact && <p className="text-red-500 text-sm">{errors.contact}</p>}


        <input type="file" accept="image/*" onChange={handleFileChange}
          className="w-full border p-2 rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
        {form.attachment && (
          <p className="text-sm text-green-600 dark:text-green-400">📎 Файл прикреплён</p>
        )}

        <button type="submit"
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white w-full py-2 rounded transition">
          Отправить
        </button>
      </form>
    </div>
  );
}
