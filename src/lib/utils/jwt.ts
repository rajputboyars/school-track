import jwt from "jsonwebtoken";

// const SECRET = process.env.NEXT_PUBLIC_JWT_SECRET! || "defaultsecret";
export const signToken = (payload: any) => {
  return jwt.sign(payload, "defaultsecret", { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, "defaultsecret");
};
export const getToken = (req: any) => {
  const authHeader = req.headers.get("authorization");

  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  return req.cookies.get("token")?.value;
};