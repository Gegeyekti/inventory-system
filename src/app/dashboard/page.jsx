"use client";

import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import API from "../../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function Dashboard() {
  const [data, setData] = useState({
    totalItems: 0,
    stockIn: 0,
    stockOut: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await API.get("/dashboard/summary");
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const chartData = [
    { name: "Stock In", value: data.stockIn },
    { name: "Stock Out", value: data.stockOut },
  ];

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6 text-blue-800">Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Total Items</p>
          <h2 className="text-3xl font-bold text-blue-800">
            {data.totalItems}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Stock In</p>
          <h2 className="text-3xl font-bold text-green-600">{data.stockIn}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Stock Out</p>
          <h2 className="text-3xl font-bold text-red-600">{data.stockOut}</h2>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow mt-6">
        <h2 className="mb-4 font-bold text-gray-500">Stock Activity</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />

            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.name === "Stock In"
                      ? "#16a34a"
                      : "#dc2626" 
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Layout>
  );
}
