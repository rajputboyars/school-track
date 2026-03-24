import { useState, useEffect } from "react";

export interface Class {
  id: string;
  className: string;
  section: string;
}
export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  classId: string;
  status: "active" | "inactive";
}
export interface Subject {
  id: string;
  subjectName: string;
  classId: string;
}

export interface AttendanceRecord {
  studentId: string;
  classId: string;
  subjectId: string;
  date: string;
  status: "present" | "absent";
}

export function useStore() {
  const [classes, setClasses] = useState<Class[]>([
    { id: "1", className: "10th", section: "A" },
    { id: "2", className: "10th", section: "B" },
  ]);
  const [students, setStudents] = useState<Student[]>([
    {
      id: "101",
      name: "Aarav Sharma",
      rollNumber: "1001",
      classId: "1",
      status: "active",
    },
    {
      id: "102",
      name: "Priya Patel",
      rollNumber: "1002",
      classId: "1",
      status: "active",
    },
  ]);
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: "s1", subjectName: "English", classId: "1" },
    { id: "s2", subjectName: "Science", classId: "1" },
  ]);

  const addClass = (c: Omit<Class, "id">) =>
    setClasses([...classes, { ...c, id: Date.now().toString() }]);
  const updateClass = (id: string, data: Partial<Class>) =>
    setClasses(classes.map((c) => (c.id === id ? { ...c, ...data } : c)));
  const deleteClass = (id: string) =>
    setClasses(classes.filter((c) => c.id !== id));

  const addStudent = (s: Omit<Student, "id">) =>
    setStudents([...students, { ...s, id: Date.now().toString() }]);
  const updateStudent = (id: string, data: Partial<Student>) =>
    setStudents(students.map((s) => (s.id === id ? { ...s, ...data } : s)));
  const deleteStudent = (id: string) =>
    setStudents(students.filter((s) => s.id !== id));

  const addSubject = (s: Omit<Subject, "id">) =>
    setSubjects([...subjects, { ...s, id: Date.now().toString() }]);
  const deleteSubject = (id: string) =>
    setSubjects(subjects.filter((s) => s.id !== id));

  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  const markAttendance = (newRecords: AttendanceRecord[]) => {
    setAttendance((prev) => {
      // Filter out old records for the same date/class/subject to avoid duplicates
      const filtered = prev.filter(
        (a) =>
          !(
            a.date === newRecords[0].date &&
            a.classId === newRecords[0].classId &&
            a.subjectId === newRecords[0].subjectId
          ),
      );
      return [...filtered, ...newRecords];
    });
  };

  return {
    classes,
    students,
    subjects,
    attendance,
    markAttendance,
    addClass,
    updateClass,
    deleteClass,
    addStudent,
    updateStudent,
    deleteStudent,
    addSubject,
    deleteSubject,
  };
}
