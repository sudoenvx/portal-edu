import argon from "argon2";

export async function hashPassword(password: string, saltRounds = 12): Promise<string> {
  return argon.hash(password, { timeCost: saltRounds });
}

export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  return argon.verify(hashed, password);
}

