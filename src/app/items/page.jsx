"use client";

import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import API from "../../services/api";

export default function Items() {
  const [items, setItems] = useState([]);

  const [form, setForm] = useState({
    name: "",
    code: "",
    stock: 0,
    price: 0,
  });

  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await API.get("/items");
    setItems(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...form,
        stock: Number(form.stock),
        price: Number(form.price),
      };

      if (editId) {
        await API.put(`/items/${editId}`, payload);
      } else {
        await API.post("/items", payload);
      }

      setForm({
        name: "",
        code: "",
        stock: 0,
        price: 0,
      });

      setEditId(null);
      setShowModal(false);

      fetchItems();
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    await API.delete(`/items/${deleteId}`);
    setDeleteId(null);
    setShowModal(false);
    fetchItems();
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number || 0);
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6 text-blue-800">Items</h1>

      <button
        onClick={() => {
          setForm({
            name: "",
            code: "",
            stock: "",
            price: "",
          });
          setEditId(null);
          setShowModal(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 cursor-pointer"
      >
        + Add Item
      </button>

      <div className="bg-white p-5 rounded-xl shadow">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2 text-blue-700">Name</th>
              <th className="p-2 text-blue-700">Code</th>
              <th className="p-2 text-blue-700">Stock</th>
              <th className="p-2 text-blue-700">Price</th>
              <th className="p-2 text-blue-700">Action</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b text-black">
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.code}</td>
                <td className="p-2">{item.stock}</td>
                <td className="p-2">{formatRupiah(item.price)}</td>

                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => {
                      setForm({
                        name: item.name || "",
                        code: item.code || "",
                        stock: item.stock ?? 0,
                        price: item.price ?? 0,
                      });
                      setEditId(item.id);
                      setShowModal(true);
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            {/* DELETE MODE */}
            {deleteId ? (
              <>
                <h2 className="text-lg font-bold mb-4 text-red-600">
                  Delete Item?
                </h2>

                <p className="text-gray-600 mb-6">
                  Data akan dihapus permanen.
                </p>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setDeleteId(null);
                      setShowModal(false);
                    }}
                    className="px-4 py-2 bg-blue-800 rounded cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold mb-4 text-black">
                  {editId ? "Edit Item" : "Add Item"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    className="border p-2 rounded w-full text-black"
                    placeholder="Name"
                    value={form.name || ""}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />

                  <input
                    className="border p-2 rounded w-full text-black"
                    placeholder="Code"
                    value={form.code || ""}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                  />

                  <input
                    type="number"
                    className="border p-2 rounded w-full text-black"
                    placeholder="Stock"
                    value={form.stock ?? 0}
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                  />

                  <input
                    type="number"
                    className="border p-2 rounded w-full text-black"
                    placeholder="Price"
                    value={form.price ?? 0}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                  />

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-red-800 rounded cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
