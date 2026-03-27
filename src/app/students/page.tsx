"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, X, User } from "lucide-react";
import {
  getStudents,
  createStudent,
  updateStudentById,
  deleteStudentById,
} from "@/services/student.service";

import { getClasses } from "@/services/class.service";

interface Student {
  _id: string;
  name: string;
  rollNumber: string;
  classId: any;
  section: string;
  status: "active" | "inactive";
}

interface Class {
  _id: string;
  className: string;
  section: string;
}

export default function StudentsPage() {
  // State
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 8;
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  // Form State
  const [form, setForm] = useState({
    name: "",
    rollNumber: "",
    classId: "",
    section: "",
    status: "active" as "active" | "inactive",
  });

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const res = await getStudents({
        page,
        limit: perPage,
        search,
      });

      setStudents(res.data.students); // adjust based on your API
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await getClasses();
      setClasses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, [page, search]);

  // Handlers
  const openAdd = () => {
    setEditing(null);
    setForm({
      name: "",
      rollNumber: "",
      classId: classes[0]?._id ?? "",
      section: "",
      status: "active",
    });
    setIsModalOpen(true);
  };

  const openEdit = (s: Student) => {
    setEditing(s);
    setForm({
      name: s.name,
      rollNumber: s.rollNumber,
      classId: s.classId?._id,
      section: s.section,
      status: s.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.rollNumber.trim() || !form.classId)
      return alert("Fill required fields");

    try {
      if (editing) {
        await updateStudentById(editing._id, form);
      } else {
        await createStudent(form);
      }

      setIsModalOpen(false);
      fetchStudents();
    } catch (err: any) {
      alert(err.message);
    }
    setIsModalOpen(false);
  };

  const getClassName = (classId: any) => {
    const c = classes.find((c) => c._id === classId?._id);
    return c ? `${c.className} - ${c.section}` : "—";
  };

  return (
    <div className="p-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Students</h1>
          <p className="text-gray-500 text-sm">
            {students.length} active
            students
          </p>
        </div>
        <button
          onClick={openAdd}
          className="bg-[#1e816a] text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#186b58] transition-colors"
        >
          <Plus size={18} /> Add Student
        </button>
      </header>

      {/* Search Bar */}
      <div className="mb-6 relative max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Search by name or roll number..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1e816a]/10 focus:border-[#1e816a] transition-all"
        />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 border-b">
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">
                  Roll No
                </th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">
                  Name
                </th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">
                  Class
                </th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px]">
                  Status
                </th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[10px] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((s) => (
                <tr
                  key={s._id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-6 py-4 font-mono text-gray-500">
                    {s.rollNumber}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-800">
                    {s.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {getClassName(s.classId)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-tighter ${
                        s.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 ">
                      <button
                        onClick={() => openEdit(s)}
                        className="p-1.5 text-gray-400 hover:text-[#1e816a] hover:bg-[#1e816a]/10 rounded-lg transition-colors"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={async () => {
                          if (!confirm("Delete student?")) return;
                          await deleteStudentById(s._id);
                          fetchStudents();
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
       {students.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50/30 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              Page {page} of {students.length}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 text-xs font-bold border border-gray-200 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Prev
              </button>
              <button
                disabled={page >= students.length}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 text-xs font-bold border border-gray-200 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Custom Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-800">
                {editing ? "Edit Student" : "New Student"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1e816a]"
                  placeholder="Enter student name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    value={form.rollNumber}
                    onChange={(e) =>
                      setForm({ ...form, rollNumber: e.target.value })
                    }
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1e816a]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value as any })
                    }
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1e816a]"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">
                  Assigned Class
                </label>
                <select
                  value={form.classId}
                  onChange={(e) =>
                    setForm({ ...form, classId: e.target.value })
                  }
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1e816a]"
                >
                  {classes.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.className} - {c.section}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-6 bg-gray-50/50 border-t flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-[#1e816a] text-white py-2.5 rounded-lg font-bold text-sm hover:bg-[#186b58] transition-all shadow-lg shadow-emerald-900/10"
              >
                {editing ? "Save Changes" : "Create Student"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
