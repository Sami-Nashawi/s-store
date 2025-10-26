import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export function getToken(req: Request) {
  const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as {
      fileNo: number;
      userId: number;
      role: string;
    };
  } catch {
    return null;
  }
}
