import { apiRequest } from "./api";

export interface ClassPayload {
  className: string;
  section: string;
}

// ✅ Get All Classes
export const getClasses = async () => {
  return apiRequest("/api/classes");
};

// ✅ Create Class
export const createClass = async (payload: ClassPayload) => {
  return apiRequest("/api/classes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

// ✅ Update Class
export const updateClassById = async (id: string, payload: ClassPayload) => {
  return apiRequest(`/api/classes/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

// ✅ Delete Class
export const deleteClassById = async (id: string) => {
  return apiRequest(`/api/classes/${id}`, {
    method: "DELETE",
  });
};