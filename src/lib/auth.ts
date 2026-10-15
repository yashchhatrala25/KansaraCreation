import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "kansara_craft_secure_jwt_secret_key_2026_xyz";

export interface AdminSession {
  id: string;
  email: string;
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signAdminToken(admin: AdminSession): string {
  return jwt.sign(
    {
      id: admin.id,
      email: admin.email,
      name: admin.name,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyAdminToken(token: string): AdminSession | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminSession;
    return decoded;
  } catch {
    return null;
  }
}
