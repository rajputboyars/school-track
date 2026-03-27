"use client"
import React, { useState } from "react";
import { School } from "lucide-react";
import { loginUser } from "@/services/auth.service";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginUser({
        email,
        password,
      });

      console.log("Login Success:", res);

      // ✅ store token
      localStorage.setItem("token", res.data.token);

      // ✅ redirect
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f8fafc] p-4">
      {/* Logo and Header Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="bg-[#1e816a] p-3 rounded-xl mb-4 shadow-sm">
          <School className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          SchoolTrack
        </h1>
        <p className="text-gray-500 text-sm mt-1">Admin Login</p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-[400px] bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 p-8">
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Username
            </label>
            <input
              type="test"
              placeholder="admin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e816a]/20 focus:border-[#1e816a] transition-all"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="admin123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e816a]/20 focus:border-[#1e816a] transition-all"
            />
          </div>
          {/* Error */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {/* Sign In Button */}
          <button
            disabled={loading}
            type="submit"
            className="w-full py-3 bg-[#1e816a] hover:bg-[#186b58] text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer Hint */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">Default: admin / admin123</p>
        </div>
      </div>

      {/* Mock "Activate Windows" text just for the aesthetic of your screenshot */}
      <div className="fixed bottom-6 right-6 text-gray-300 text-right select-none hidden md:block">
        <p className="text-sm">Activate Windows</p>
        <p className="text-xs">Go to Settings to activate Windows.</p>
      </div>
    </div>
  );
}
