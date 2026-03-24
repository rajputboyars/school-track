import Student from "../models/Student";
import { validateStudent } from "../validators/student.validator";

export const createStudent = async (data: any) => {
  validateStudent(data);
  return await Student.create(data);
};

export const getStudents = async (query: any) => {
  return await Student.find(query).populate("classId").sort({ createdAt: -1 });
};

export const updateStudent = async (id: string, data: any) => {
  return await Student.findByIdAndUpdate(id, data, { new: true });
};

export const deleteStudent = async (id: string) => {
  return await Student.findByIdAndDelete(id);
};