"use client";

import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import API from "../../services/api";

export default function Stock() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    item_id: "",
    quantity: "",
    date: "",
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await API.get("/items");
    setItems(res.data);
  };

  const handleStockIn = async () => {
    await API.post("/stock/in", form);
    alert("Stock added");
  };

  const handleStockOut = async () => {
    await API.post("/stock/out", form);
    alert("Stock reduced");
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6 text-blue-800">
        Stock Management
      </h1>

      <div className="bg-white p-6 rounded-xl shadow max-w-md">
        <div className="space-y-3">

          <select
            className="border p-2 rounded w-full text-black"
            value={form.item_id}
            onChange={(e) =>
              setForm({ ...form, item_id: e.target.value })
            }
          >
            <option value="">Select Item</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Quantity"
            className="border p-2 rounded w-full text-black"
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: e.target.value })
            }
          />

          <input
            type="date"
            className="border p-2 rounded w-full text-black"
            value={form.date}
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
          />

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleStockIn}
              className="bg-green-600 text-white px-4 py-2 rounded w-full cursor-pointer"
            >
              Stock In
            </button>

            <button
              onClick={handleStockOut}
              className="bg-red-600 text-white px-4 py-2 rounded w-full cursor-pointer"
            >
              Stock Out
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}