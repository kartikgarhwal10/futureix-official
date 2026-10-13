import { cookies } from "next/headers";
import crypto from "crypto";
import { AdminUser } from "./types";
import { isSupabaseConfigured, getSupabaseBrowserClient } from "./supabase";

const SESSION_COOKIE_NAME = "futureix_admin_session";
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "futureix-super-secure-jwt-hmac-secret-2026";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: "admin" | "editor";
  exp: number;
}

function createSignature(data: string): string {
  return crypto.createHmac("sha256", SESSION_SECRET).update(data).digest("hex");
}

function encodeSession(payload: SessionPayload): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createSignature(data);
  return `${data}.${signature}`;
}

function decodeSession(token: string): SessionPayload | null {
  try {
    const [data, signature] = token.split(".");
    if (!data || !signature) return null;

    const expectedSig = createSignature(data);
    if (signature !== expectedSig) return null;

    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf-8")) as SessionPayload;
    if (payload.exp < Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = decodeSession(token);
    if (!payload) return null;

    return {
      id: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export async function requireAdminSession(): Promise<AdminUser> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Unauthorized: Administrator authentication required.");
  }
  return session;
}

export async function verifyAdminCredentials(
  email: string,
  pass: string
): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedPass = pass.trim();

  // 1. If Supabase Auth is configured, try Supabase sign in
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: trimmedPass,
        });

        if (!error && data.user) {
          const user: AdminUser = {
            id: data.user.id,
            email: data.user.email || trimmedEmail,
            name: data.user.user_metadata?.name || "Administrator",
            role: "admin",
          };
          await createAdminSessionCookie(user);
          return { success: true, user };
        }
      }
    } catch {
      // Fallback to environment check
    }
  }

  // 2. Primary / Fallback Admin Credentials Check
  const configuredEmail = (process.env.ADMIN_EMAIL || "admin@futureix.in").toLowerCase();
  const configuredPassword = process.env.ADMIN_PASSWORD || "Futureix@2026!";

  if (trimmedEmail === configuredEmail && trimmedPass === configuredPassword) {
    const user: AdminUser = {
      id: "admin-1",
      email: configuredEmail,
      name: "FUTUREIX Super Admin",
      role: "admin",
    };
    await createAdminSessionCookie(user);
    return { success: true, user };
  }

  return { success: false, error: "Invalid email or password. Please verify your credentials." };
}

export async function createAdminSessionCookie(user: AdminUser): Promise<void> {
  const cookieStore = await cookies();
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp,
  };

  const token = encodeSession(payload);

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
