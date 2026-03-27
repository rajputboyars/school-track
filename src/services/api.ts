// export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const res = await fetch(`${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}