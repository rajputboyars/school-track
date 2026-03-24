export const validateStudent = (data: any) => {
  if (!data.name) throw new Error("Name is required");
  if (!data.rollNumber) throw new Error("Roll number is required");
  if (!data.classId) throw new Error("Class is required");
};