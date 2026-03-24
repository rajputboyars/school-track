import React from 'react';
import { Users, School, BookOpen, ClipboardCheck } from 'lucide-react';
import Sidebar from '@/Component/Sidebar';

export default function DashboardPage() {
  const stats = [
    { title: 'Total Students', value: '9', sub: '10 total enrolled', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Total Classes', value: '4', sub: '', icon: School, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Subjects', value: '5', sub: '', icon: BookOpen, color: 'text-amber-500', bg: 'bg-amber-50' },
    { title: "Today's Attendance", value: '0%', sub: '0/0 present', icon: ClipboardCheck, color: 'text-rose-500', bg: 'bg-rose-50' },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* <Sidebar /> */}
      
      <main className="flex-1 p-10">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm">Overview of your school attendance system</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.title} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex justify-between">
              <div>
                <p className="text-xs font-medium text-gray-400 mb-4">{stat.title}</p>
                <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
                {stat.sub && <p className="text-[10px] text-gray-400 mt-1">{stat.sub}</p>}
              </div>
              <div className={`${stat.bg} ${stat.color} p-2 rounded-lg h-fit`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>

        {/* Recent Attendance Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="font-bold text-gray-800">Recent Attendance</h2>
          </div>
          <div className="p-12 text-center">
            <p className="text-sm text-gray-400">
              No attendance recorded today. <span className="text-[#1e816a] cursor-pointer hover:underline">Go to Mark Attendance</span> to get started.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}