import Attendance from "../models/Attendance";
import { validateAttendance } from "../validators/attendance.validator";
import { normalizeDate } from "../utils/date";

export const markAttendance = async (data: any) => {
  validateAttendance(data);

  const date = normalizeDate(data.date);

  const records = data.records.map((r: any) => ({
    studentId: r.studentId,
    classId: data.classId,
    subjectId: data.subjectId,
    date,
    status: r.status,
  }));

  return await Attendance.insertMany(records, { ordered: false });
};

export const getAttendance = async (filters: any) => {
  const query: any = {};

  if (filters.classId) query.classId = filters.classId;
  if (filters.subjectId) query.subjectId = filters.subjectId;
  if (filters.date) query.date = normalizeDate(filters.date);

  return await Attendance.find(query)
    .populate("studentId")
    .populate("subjectId");
};