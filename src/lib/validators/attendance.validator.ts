export const validateAttendance = (data: any) => {
  if (!data.classId) throw new Error("Class required");
  if (!data.subjectId) throw new Error("Subject required");
  if (!data.date) throw new Error("Date required");
  if (!Array.isArray(data.records))
    throw new Error("Records must be array");
};