'use client';
import Link from "next/link";
import { useEffect, useState } from "react";

type Node = {
  id: number;
  parentId: number | null;
  operation: string | null;
  leftValue: number;
  rightValue: number | null;
  result: number;
  userId: string;
  username: string;
};

export default function HomePage() {
  const [tree, setTree] = useState<Node[]>([]);
  const [startNumber, setStartNumber] = useState<number>(0);
  const [operationNumber, setOperationNumber] = useState<number>(0);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [operationType, setOperationType] = useState<string>("+");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);

    fetch("/api/tree")
      .then((res) => res.json())
      .then((data) => setTree(data));
  }, []);

  const handleStart = async () => {
    if (!token) {
      alert("You must login to start a discussion!");
      return;
    }

    const res = await fetch("/api/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ startNumber }),
    });
    const data = await res.json();
    if (!data || res.status !== 200) {
      alert(data?.error || "An error occurred");
      return;
    }
    setTree([...tree, data[0]]);
  };

  const handleOperation = async () => {
    if (!token) {
      alert("You must login to add an operation!");
      return;
    }
    if (!selectedNode) {
      alert("Please select a node from the tree!");
      return;
    }

    const res = await fetch("/api/operation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        parentId: selectedNode,
        operation: operationType,
        rightValue: operationNumber,
      }),
    });
    const data = await res.json();
    if (!data || res.status !== 200) {
      alert(data?.error || "An error occurred");
      return;
    }
    setTree([...tree, data[0]]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600">
        📊 Number Communication Tree
      </h1>

      {/* Login info + register/login buttons */}
      <div className="text-center mb-6">
        {token ? (
          <div className="space-y-3">
            <p className="text-green-600 font-semibold">✅ You are logged in</p>
            <button
              onClick={async () => {
                await fetch("/api/logout", { method: "POST" });
                localStorage.removeItem("token");
                window.location.href = "/login"; // redirect to login
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-red-600 font-semibold">
              ❌ You are not logged in.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href={"/login"}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Start number form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Start New Discussion</h2>
        <div className="flex gap-4">
          <input
            type="number"
            value={startNumber}
            onChange={(e) => setStartNumber(Number(e.target.value))}
            className="w-32 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={handleStart}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
          >
            Start
          </button>
        </div>
      </div>

      {/* Operation form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Add Operation</h2>
        <div className="flex gap-4 items-center">
          <select
            value={operationType}
            onChange={(e) => setOperationType(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="+">+</option>
            <option value="-">-</option>
            <option value="*">*</option>
            <option value="/">/</option>
          </select>
          <input
            type="number"
            value={operationNumber}
            onChange={(e) => setOperationNumber(Number(e.target.value))}
            className="w-32 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={handleOperation}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Add
          </button>
        </div>
      </div>

      {/* Discussion tree */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Discussion Tree</h2>
        <ul className="space-y-2">
          {tree.map((node) => (
            <li key={node.id} className="flex items-center gap-2">
              <span className="text-gray-500 w-30">
                @{node.username}
              </span>
              :
              <button
                onClick={() => setSelectedNode(node.id)}
                className={`px-3 py-1 rounded-lg border ${selectedNode === node.id
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
                  }`}
              >
                {node.result}
              </button>
              {node.operation && (
                <span className="text-gray-600">
                  = {node.leftValue} {node.operation} {node.rightValue}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
