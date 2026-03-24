import Subject from "../models/Subject";
import { validateSubject } from "../validators/subject.validator";

export const createSubject = async (data: any) => {
  validateSubject(data);
  return await Subject.create(data);
};

export const getSubjects = async (query: any) => {
  return await Subject.find(query).populate("classId");
};

export const deleteSubject = async (id: string) => {
  return await Subject.findByIdAndDelete(id);
};