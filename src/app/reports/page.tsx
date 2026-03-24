'use client';
import { useState, useMemo } from "react";
import { BarChart3, Users, School, BookOpen, Calendar } from "lucide-react";
import { useStore } from "@/lib/store";

export default function ReportsPage() {
  const { classes, subjects, students, attendance } = useStore();
  
  // Filter States
  const [view, setView] = useState<"student" | "class" | "subject">("student");
  const [classFilter, setClassFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Memoized Filtered Data
  const filteredAttendance = useMemo(() => {
    let data = attendance;
    if (classFilter !== "all") data = data.filter(a => a.classId === classFilter);
    if (dateFrom) data = data.filter(a => a.date >= dateFrom);
    if (dateTo) data = data.filter(a => a.date <= dateTo);
    return data;
  }, [attendance, classFilter, dateFrom, dateTo]);

  // Aggregate Helper
  const calculateStats = (key: 'studentId' | 'classId' | 'subjectId') => {
    const map: Record<string, { total: number; present: number }> = {};
    filteredAttendance.forEach(a => {
      const id = a[key];
      if (!map[id]) map[id] = { total: 0, present: 0 };
      map[id].total++;
      if (a.status === "present") map[id].present++;
    });
    return map;
  };

  // Reports Generation
  const studentReport = useMemo(() => {
    const stats = calculateStats('studentId');
    return Object.entries(stats).map(([id, d]) => ({
      student: students.find(s => s.id === id),
      ...d,
      percent: Math.round((d.present / d.total) * 100),
    })).sort((a, b) => b.percent - a.percent);
  }, [filteredAttendance, students]);

  const classReport = useMemo(() => {
    const stats = calculateStats('classId');
    return Object.entries(stats).map(([id, d]) => ({
      cls: classes.find(c => c.id === id),
      ...d,
      percent: Math.round((d.present / d.total) * 100),
    })).sort((a, b) => b.percent - a.percent);
  }, [filteredAttendance, classes]);

  const subjectReport = useMemo(() => {
    const stats = calculateStats('subjectId');
    return Object.entries(stats).map(([id, d]) => ({
      subject: subjects.find(s => s.id === id),
      ...d,
      percent: Math.round((d.present / d.total) * 100),
    })).sort((a, b) => b.percent - a.percent);
  }, [filteredAttendance, subjects]);

  // Custom Progress Bar Component
  const PercentBar = ({ value }: { value: number }) => {
    const getColor = () => {
      if (value >= 80) return "bg-[#1e816a]"; // Success
      if (value >= 60) return "bg-amber-500"; // Warning
      return "bg-rose-500"; // Danger
    };

    return (
      <div className="flex items-center gap-4">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${getColor()}`}
            style={{ width: `${value}%` }}
          />
        </div>
        <span className="text-xs font-bold text-gray-700 w-8">{value}%</span>
      </div>
    );
  };

  return (
    <div className="p-8 mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <BarChart3 className="text-[#1e816a]" /> Reports & Analytics
        </h1>
        <p className="text-gray-500 text-sm">Analyze attendance trends and performance</p>
      </header>

      {/* Control Panel */}
      <div className="grid gap-4 sm:grid-cols-4 mb-8 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-gray-400">View Mode</label>
          <div className="flex p-1 bg-gray-50 rounded-lg border border-gray-100">
            {(['student', 'class', 'subject'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                  view === v ? "bg-white text-[#1e816a] shadow-sm" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-gray-400">Filter Class</label>
          <select 
            value={classFilter} 
            onChange={e => setClassFilter(e.target.value)}
            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
          >
            <option value="all">All Classes</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.className}-{c.section}</option>)}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-gray-400">Date From</label>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none" />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-gray-400">Date To</label>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none" />
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-50/50 text-gray-500 border-b">
              <th className="px-6 py-4 font-semibold">
                {view === "student" ? "Student Name" : view === "class" ? "Class Name" : "Subject Name"}
              </th>
              <th className="px-6 py-4 font-semibold">Total Sessions</th>
              <th className="px-6 py-4 font-semibold">Attended</th>
              <th className="px-6 py-4 font-semibold w-72">Attendance Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {view === "student" && studentReport.map((r, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-800">{r.student?.name ?? "Unknown"}</td>
                <td className="px-6 py-4 text-gray-600 tabular-nums">{r.total}</td>
                <td className="px-6 py-4 text-gray-600 tabular-nums">{r.present}</td>
                <td className="px-6 py-4"><PercentBar value={r.percent} /></td>
              </tr>
            ))}
            {view === "class" && classReport.map((r, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-800">{r.cls ? `${r.cls.className}-${r.cls.section}` : "Unknown"}</td>
                <td className="px-6 py-4 text-gray-600 tabular-nums">{r.total}</td>
                <td className="px-6 py-4 text-gray-600 tabular-nums">{r.present}</td>
                <td className="px-6 py-4"><PercentBar value={r.percent} /></td>
              </tr>
            ))}
            {view === "subject" && subjectReport.map((r, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-800">{r.subject?.subjectName ?? "Unknown"}</td>
                <td className="px-6 py-4 text-gray-600 tabular-nums">{r.total}</td>
                <td className="px-6 py-4 text-gray-600 tabular-nums">{r.present}</td>
                <td className="px-6 py-4"><PercentBar value={r.percent} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAttendance.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-gray-400 text-sm">No data available for the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}