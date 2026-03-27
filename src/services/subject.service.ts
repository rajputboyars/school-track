// import { apiRequest } from "@/lib/apiClient";

import { apiRequest } from "./api";

// Get all subjects (optional filter by classId)
export const getSubjects = (classId?: string) => {
  const query = classId ? `?classId=${classId}` : "";
  return apiRequest(`/api/subjects${query}`);
};

export const createSubject = (data: any) =>
  apiRequest("/api/subjects", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateSubjectById = (id: string, data: any) =>
  apiRequest(`/api/subjects/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteSubjectById = (id: string) =>
  apiRequest(`/api/subjects/${id}`, {
    method: "DELETE",
  });