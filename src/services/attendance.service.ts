import { apiRequest } from "./api";

// ✅ Mark Attendance
export const markAttendance = (data: {
  classId: string;
  subjectId: string;
  date: string;
  records: {
    studentId: string;
    status: "present" | "absent";
  }[];
}) => {
  return apiRequest("/api/attendance/mark", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// ✅ Get Attendance (by class + subject + date)
export const getAttendance = (params: {
  classId: string;
  subjectId: string;
  date: string;
}) => {
  const query = new URLSearchParams(params).toString();

  return apiRequest(`/api/attendance?${query}`);
};

// ✅ Update Attendance (single record)
export const updateAttendanceById = (
  attendanceId: string,
  data: { status: "present" | "absent" }
) => {
  return apiRequest(`/api/attendance/${attendanceId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// ✅ Delete Attendance
export const deleteAttendanceById = (attendanceId: string) => {
  return apiRequest(`/api/attendance/${attendanceId}`, {
    method: "DELETE",
  });
};

// ✅ Get Attendance Report (class-wise)
export const getAttendanceReport = (classId: string) => {
  return apiRequest(`/api/attendance/report?classId=${classId}`);
};