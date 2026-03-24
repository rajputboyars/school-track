'use client';
import { useState } from "react";
import { Plus, Pencil, Trash2, BookOpen, X, Layers } from "lucide-react";
import { useStore, type Subject } from "@/lib/store";

export default function SubjectsPage() {
  const { subjects, classes, addSubject, updateSubject, deleteSubject } = useStore();
  
  // UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Subject | null>(null);
  const [form, setForm] = useState({ subjectName: "", classId: "" });

  const openAdd = () => { 
    setEditing(null); 
    setForm({ subjectName: "", classId: classes[0]?.id ?? "" }); 
    setIsModalOpen(true); 
  };

  const openEdit = (s: Subject) => { 
    setEditing(s); 
    setForm({ subjectName: s.subjectName, classId: s.classId }); 
    setIsModalOpen(true); 
  };

  const handleSave = () => {
    if (!form.subjectName.trim() || !form.classId) return alert("Please fill all fields");
    
    if (editing) {
      updateSubject(editing.id, form);
    } else {
      addSubject(form);
    }
    setIsModalOpen(false);
  };

  // Grouping logic for the UI
  const grouped = classes.map(c => ({
    cls: c,
    subs: subjects.filter(s => s.classId === c.id),
  }));

  return (
    <div className="p-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Subjects</h1>
          <p className="text-gray-500 text-sm">Assign and manage courses for each class</p>
        </div>
        <button 
          onClick={openAdd}
          className="bg-[#1e816a] text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-[#186b58] transition-colors shadow-lg shadow-emerald-900/10"
        >
          <Plus size={18} /> Add Subject
        </button>
      </header>

      <div className="space-y-6">
        {grouped.map(({ cls, subs }) => (
          <div key={cls.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Layers size={18} className="text-[#1e816a]" />
              <h3 className="font-bold text-gray-800 uppercase tracking-tight text-sm">
                Grade {cls.className} — {cls.section}
              </h3>
            </div>
            
            {subs.length === 0 ? (
              <div className="py-4 px-6 border border-dashed border-gray-100 rounded-xl text-center">
                <p className="text-xs text-gray-400 italic">No subjects assigned to this class yet.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {subs.map(s => (
                  <div 
                    key={s.id} 
                    className="flex items-center gap-2 bg-gray-50 border border-gray-200 pl-4 pr-2 py-2 rounded-xl group hover:border-[#1e816a] transition-all"
                  >
                    <BookOpen size={14} className="text-gray-400 group-hover:text-[#1e816a]" />
                    <span className="text-sm font-medium text-gray-700">{s.subjectName}</span>
                    
                    <div className="flex items-center ml-2 border-l pl-2 border-gray-200">
                      <button 
                        onClick={() => openEdit(s)}
                        className="p-1 text-gray-400 hover:text-[#1e816a] rounded-md transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button 
                        onClick={() => { if(confirm("Delete subject?")) deleteSubject(s.id) }}
                        className="p-1 text-gray-400 hover:text-red-500 rounded-md transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {classes.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed">
            <p className="text-gray-500 text-sm">Please create a class first before adding subjects.</p>
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">{editing ? "Edit Subject" : "New Subject"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subject Name</label>
                <input 
                  type="text" 
                  value={form.subjectName} 
                  placeholder="e.g. Mathematics"
                  onChange={e => setForm({...form, subjectName: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1e816a]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Assign to Class</label>
                <select 
                  value={form.classId} 
                  onChange={e => setForm({...form, classId: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#1e816a]"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.className} - {c.section}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-2 text-sm font-bold text-gray-500">Cancel</button>
              <button 
                onClick={handleSave}
                className="flex-1 bg-[#1e816a] text-white py-2 rounded-lg font-bold text-sm"
              >
                {editing ? "Update" : "Add Subject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}