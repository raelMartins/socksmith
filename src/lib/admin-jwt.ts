import { SignJWT, jwtVerify } from "jose";

async function getSecretKey() {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_JWT_SECRET must be set to a random string of at least 32 characters.");
  }
  return new TextEncoder().encode(secret);
}

export async function signAdminJwt() {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(await getSecretKey());
}

export async function verifyAdminJwt(token: string | undefined) {
  if (!token) return false;
  try {
    await jwtVerify(token, await getSecretKey());
    return true;
  } catch {
    return false;
  }
}
