export const validateSubject = (data: any) => {
  if (!data.subjectName) throw new Error("Subject name required");
  if (!data.classId) throw new Error("Class is required");
};