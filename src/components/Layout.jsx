"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiHome, FiBox, FiRepeat, FiClock, FiLogOut } from "react-icons/fi";

export default function Layout({ children }) {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-60 bg-indigo-600 text-white p-4">
        <h1 className="text-xl font-bold mb-6">Inventory</h1>

        <nav className="space-y-3">
          <Link
            href="/dashboard"
            className="flex gap-2 items-center hover:bg-indigo-500 p-2 rounded"
          >
            <FiHome /> Dashboard
          </Link>

          <Link
            href="/items"
            className="flex gap-2 items-center hover:bg-indigo-500 p-2 rounded"
          >
            <FiBox /> Items
          </Link>

          <Link
            href="/stock"
            className="flex gap-2 items-center hover:bg-indigo-500 p-2 rounded"
          >
            <FiRepeat /> Stock
          </Link>

          <Link
            href="/history"
            className="flex gap-2 items-center hover:bg-indigo-500 p-2 rounded"
          >
            <FiClock /> History
          </Link>

          <button
            onClick={logout}
            className="flex gap-2 items-center hover:bg-red-500 p-2 rounded w-full cursor-pointer"
          >
            <FiLogOut /> Logout
          </button>
        </nav>
      </div>

      <div className="flex-1 p-6 bg-gray-100">{children}</div>
    </div>
  );
}
