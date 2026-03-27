// import { apiRequest } from "@/lib/apiClient";

import { apiRequest } from "./api";

export const getStudents = async (params: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const query = new URLSearchParams(params as any).toString();
  return apiRequest(`/api/students?${query}`);
};

export const createStudent = (data: any) =>
  apiRequest("/api/students", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateStudentById = (id: string, data: any) =>
  apiRequest(`/api/students/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteStudentById = (id: string) =>
  apiRequest(`/api/students/${id}`, {
    method: "DELETE",
  });