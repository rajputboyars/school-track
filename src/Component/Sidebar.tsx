"use client";

import React from "react";
import {
  LayoutDashboard,
  Users,
  School,
  BookOpen,
  CheckSquare,
  History,
  BarChart3,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/login"; // 👈 check route

  const menuItems = [
    {
      section: "Management",
      items: [
        { name: "Dashboard", icon: LayoutDashboard, href: "/" },
        { name: "Students", icon: Users, href: "/students" },
        { name: "Classes", icon: School, href: "/classes" },
        { name: "Subjects", icon: BookOpen, href: "/subjects" },
      ],
    },
    {
      section: "Attendance",
      items: [
        { name: "Mark Attendance", icon: CheckSquare, href: "/attendance" },
        { name: "History", icon: History, href: "/history" },
        { name: "Reports", icon: BarChart3, href: "/reports" },
      ],
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <aside
      className={`h-screen w-64 bg-[#1a1f2b] text-gray-400 flex flex-col 
      transform transition-transform duration-300 ease-in-out z-50
      ${isLoginPage ? "fixed top-0 left-0 -translate-x-full" : "translate-x-0"}`}
    >
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="bg-[#1e816a] p-1.5 rounded-lg">
          <School className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-white font-bold text-sm leading-tight">
            SchoolTrack
          </h2>
          <p className="text-[10px]">Admin Panel</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 mt-4">
        {menuItems.map((group) => (
          <div key={group.section} className="mb-6">
            <p className="text-[10px] uppercase font-bold tracking-wider mb-2 px-2 text-gray-500">
              {group.section}
            </p>

            {group.items.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  href={item.href}
                  key={item.name}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm mb-1 transition-all ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/5">
        <button
          className="flex items-center gap-3 px-3 py-2 text-sm hover:text-white transition-colors"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;