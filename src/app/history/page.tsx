'use client';
import { useState } from "react";
import { Search, Calendar, Filter, School, BookOpen } from "lucide-react";
import { useStore } from "@/lib/store";

export default function AttendanceHistoryPage() {
  const { classes, subjects, students, attendance } = useStore();
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [date, setDate] = useState("");

  // Filtering Logic
  let filtered = attendance;
  if (classId && classId !== "all") filtered = filtered.filter(a => a.classId === classId);
  if (subjectId && subjectId !== "all") filtered = filtered.filter(a => a.subjectId === subjectId);
  if (date) filtered = filtered.filter(a => a.date === date);

  // Sort by latest date first
  filtered = [...filtered].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="p-8 ">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Attendance History</h1>
        <p className="text-gray-500 text-sm">View and track past attendance records</p>
      </header>

      {/* Filter Bar */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-gray-400 flex items-center gap-1.5">
            <School size={12} /> Filter by Class
          </label>
          <select 
            value={classId} 
            onChange={(e) => setClassId(e.target.value)}
            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1e816a] transition-colors"
          >
            <option value="all">All Classes</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.className} - {c.section}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-gray-400 flex items-center gap-1.5">
            <BookOpen size={12} /> Filter by Subject
          </label>
          <select 
            value={subjectId} 
            onChange={(e) => setSubjectId(e.target.value)}
            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1e816a] transition-colors"
          >
            <option value="all">All Subjects</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.subjectName}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-gray-400 flex items-center gap-1.5">
            <Calendar size={12} /> Filter by Date
          </label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1e816a]"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 border-b">
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Student Name</th>
                <th className="px-6 py-4 font-semibold">Class</th>
                <th className="px-6 py-4 font-semibold">Subject</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.slice(0, 50).map((rec, index) => {
                const student = students.find(s => s.id === rec.studentId);
                const cls = classes.find(c => c.id === rec.classId);
                const sub = subjects.find(s => s.id === rec.subjectId);

                return (
                  <tr key={`${rec.studentId}-${rec.date}-${index}`} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-gray-500 tabular-nums">
                      {new Date(rec.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">{student?.name ?? "Unknown Student"}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {cls ? `${cls.className}-${cls.section}` : "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{sub?.subjectName ?? "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        rec.status === "present" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-red-100 text-red-700"
                      }`}>
                        {rec.status === "present" ? "✓ Present" : "✕ Absent"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <Filter className="mx-auto text-gray-200 mb-3" size={40} />
            <p className="text-gray-400 text-sm font-medium">No matching records found.</p>
          </div>
        )}

        {filtered.length > 50 && (
          <div className="p-4 bg-gray-50/50 border-t text-center">
            <p className="text-xs text-gray-400 font-medium italic">
              Showing the latest 50 records. Refine your search to find specific data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}