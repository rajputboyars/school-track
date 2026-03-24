import { signToken } from "../utils/jwt";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export const loginAdmin = async (email: string, password: string) => {
  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    throw new Error("Invalid credentials");
  }

  const token = signToken({ role: "admin" });

  return { token };
};