'use client';
import { useState, useMemo } from "react";
import { Check, X, Calendar, BookOpen, School } from "lucide-react";
import { useStore } from "@/lib/store";

export default function MarkAttendancePage() {
  const { classes, subjects, students, attendance, markAttendance } = useStore();
  
  // Form State
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  
  // Local state for UI toggles before saving
  const [statuses, setStatuses] = useState<Record<string, "present" | "absent">>({});

  const filteredSubjects = subjects.filter(s => s.classId === classId);
  const filteredStudents = students.filter(s => s.classId === classId && s.status === "active");

  // Load existing records if they exist for this specific combination
  const existingRecords = useMemo(() => {
    if (!classId || !subjectId || !date) return {};
    const map: Record<string, "present" | "absent"> = {};
    attendance
      .filter(a => a.classId === classId && a.subjectId === subjectId && a.date === date)
      .forEach(a => { map[a.studentId] = a.status; });
    return map;
  }, [classId, subjectId, date, attendance]);

  const getStatus = (studentId: string) => statuses[studentId] ?? existingRecords[studentId] ?? "present";

  const toggleStatus = (studentId: string) => {
    const current = getStatus(studentId);
    setStatuses(prev => ({ 
      ...prev, 
      [studentId]: current === "present" ? "absent" : "present" 
    }));
  };

  const handleSave = () => {
    if (!classId || !subjectId || !date) return alert("Please select all fields");
    
    const records = filteredStudents.map(s => ({
      studentId: s.id,
      classId,
      subjectId,
      date,
      status: getStatus(s.id),
    }));

    markAttendance(records);
    setStatuses({}); // Clear local overrides after save
    alert(`Attendance saved for ${records.length} students`);
  };

  const presentCount = filteredStudents.filter(s => getStatus(s.id) === "present").length;

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Mark Attendance</h1>
        <p className="text-gray-500 text-sm">Record daily attendance by class and subject</p>
      </header>

      {/* Filters Section */}
      <div className="grid gap-6 sm:grid-cols-3 mb-8 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-400 flex items-center gap-2">
            <School size={14} /> Class
          </label>
          <select 
            value={classId} 
            onChange={e => { setClassId(e.target.value); setSubjectId(""); setStatuses({}); }}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1e816a]/20 outline-none"
          >
            <option value="">Select Class</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.className} - {c.section}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-400 flex items-center gap-2">
            <BookOpen size={14} /> Subject
          </label>
          <select 
            value={subjectId} 
            disabled={!classId}
            onChange={e => { setSubjectId(e.target.value); setStatuses({}); }}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm disabled:opacity-50 outline-none"
          >
            <option value="">Select Subject</option>
            {filteredSubjects.map(s => <option key={s.id} value={s.id}>{s.subjectName}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-400 flex items-center gap-2">
            <Calendar size={14} /> Date
          </label>
          <input 
            type="date" 
            value={date} 
            onChange={e => { setDate(e.target.value); setStatuses({}); }}
            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none" 
          />
        </div>
      </div>

      {/* Attendance Table */}
      {classId && subjectId ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b bg-gray-50/50 px-6 py-4">
            <p className="text-sm font-semibold text-gray-700">{filteredStudents.length} Students found</p>
            <div className="flex gap-4 text-xs font-medium">
              <span className="text-green-600 bg-green-50 px-2 py-1 rounded-md">{presentCount} Present</span>
              <span className="text-red-600 bg-red-50 px-2 py-1 rounded-md">{filteredStudents.length - presentCount} Absent</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-400 border-b">
                  <th className="px-6 py-4 font-medium">Roll No.</th>
                  <th className="px-6 py-4 font-medium">Student Name</th>
                  <th className="px-6 py-4 font-medium text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredStudents.map(s => {
                  const status = getStatus(s.id);
                  return (
                    <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-gray-500">{s.rollNumber}</td>
                      <td className="px-6 py-4 font-medium text-gray-800">{s.name}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => toggleStatus(s.id)}
                          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
                            status === "present" 
                            ? "bg-green-100 text-green-700 hover:bg-green-200" 
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                          }`}
                        >
                          {status === "present" ? <Check size={14} /> : <X size={14} />}
                          {status.toUpperCase()}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-6 bg-gray-50/30 border-t">
            <button 
              onClick={handleSave}
              className="bg-[#1e816a] hover:bg-[#186b58] text-white px-8 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-lg shadow-emerald-900/10"
            >
              Save Attendance
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
          <p className="text-gray-400 text-sm">Please select a class and subject to load the student list.</p>
        </div>
      )}
    </div>
  );
}