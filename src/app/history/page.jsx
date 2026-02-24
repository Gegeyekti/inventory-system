"use client";

import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import API from "../../services/api";

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const res = await API.get("/stock/history");
    setHistory(res.data);
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6 text-blue-800">
        Stock History
      </h1>

      <div className="bg-white p-5 rounded-xl shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="p-2 text-gray-500">Item</th>
              <th className="p-2 text-gray-500">Type</th>
              <th className="p-2 text-gray-500">Qty</th>
              <th className="p-2 text-gray-500">Date</th>
            </tr>
          </thead>

          <tbody>
            {history.map((row, i) => (
              <tr key={i} className="border-b text-black">
                <td className="p-2">{row.item_name}</td>

                <td
                  className={`p-2 font-semibold ${
                    row.type === "IN"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {row.type}
                </td>

                <td className="p-2">{row.quantity}</td>

                <td className="p-2">
                  {new Date(row.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}