export const ENV = {
  MONGODB_URI: process.env.MONGODB_URI || "",
  NEXT_PUBLIC_JWT_SECRET: process.env.NEXT_PUBLIC_JWT_SECRET || "",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "",
};

if (!ENV.MONGODB_URI) {
  throw new Error("MONGODB_URI is missing");
}

if (!ENV.NEXT_PUBLIC_JWT_SECRET) {
  throw new Error("NEXT_PUBLIC_JWT_SECRET is missing");
}