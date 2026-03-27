"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Users, X, School } from "lucide-react";
import {
  getClasses,
  createClass,
  updateClassById,
  deleteClassById,
} from "@/services/class.service";

interface Class {
  _id: string;
  className: string;
  section: string;
  students: string;
}

export default function ClassesPage() {

  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  // UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Class | null>(null);
  const [form, setForm] = useState({ className: "", section: "" });

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await getClasses();
      setClasses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ className: "", section: "" });
    setIsModalOpen(true);
  };

  const openEdit = (c: Class) => {
    setEditing(c);
    setForm({ className: c.className, section: c.section });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.className.trim()) return alert("Class name is required");

    try {
      if (editing) {
        await updateClassById(editing._id, form);
      } else {
        await createClass(form);
      }

      setIsModalOpen(false);
      fetchClasses(); // refresh list
    } catch (err: any) {
      alert(err.message);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this class?")) return;

    try {
      await deleteClassById(id);
      fetchClasses();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="p-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Classes</h1>
          <p className="text-gray-500 text-sm">Manage grades and sections</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-[#1e816a] text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-[#186b58] transition-colors shadow-lg shadow-emerald-900/10"
        >
          <Plus size={18} /> Add Class
        </button>
      </header>
      {loading && <p>Loading classes...</p>}
      {/* Grid Layout */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((c) => {
          
          const count = c?.students?.length;
          return (
            <div
              key={c._id}
              className="group relative bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 text-[#1e816a] rounded-xl">
                    <School size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg leading-tight">
                      Grade {c.className}
                    </h3>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                      Section {c.section || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-1 ">
                  <button
                    onClick={() => openEdit(c)}
                    className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Users size={14} className="text-gray-400" />
                  <span className="text-sm font-medium">{count} Students</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
                  Active
                </span>
              </div>
            </div>
          );
        })}

        {classes.length === 0 && (
          <div className="col-span-full py-20 bg-white rounded-2xl border border-dashed border-gray-200 text-center">
            <School className="mx-auto text-gray-200 mb-4" size={48} />
            <p className="text-gray-400 text-sm font-medium">
              No classes defined. Start by adding one.
            </p>
          </div>
        )}
      </div>

      {/* Custom Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-800">
                {editing ? "Edit Class" : "New Class"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Class Name
                </label>
                <input
                  type="text"
                  value={form.className}
                  placeholder="e.g. 10th Grade"
                  onChange={(e) =>
                    setForm({ ...form, className: e.target.value })
                  }
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1e816a] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Section / Room
                </label>
                <input
                  type="text"
                  value={form.section}
                  placeholder="e.g. Section A"
                  onChange={(e) =>
                    setForm({ ...form, section: e.target.value })
                  }
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1e816a] transition-all"
                />
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
                {editing ? "Save Changes" : "Create Class"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
