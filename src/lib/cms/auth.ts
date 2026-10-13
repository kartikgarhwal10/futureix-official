import { cookies } from "next/headers";
import crypto from "crypto";
import { AdminUser } from "./types";
import { isSupabaseConfigured, getSupabaseBrowserClient, getSupabaseAdminClient } from "./supabase";

const SESSION_COOKIE_NAME = "futureix_admin_session";
const DEV_FALLBACK_SECRET = "futureix-dev-only-jwt-hmac-secret-not-for-prod-2026-min-32-chars";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: "admin" | "editor";
  exp: number;
}

// In-memory rate limiter for login brute-force mitigation
interface RateLimitRecord {
  count: number;
  lockedUntil: number;
}
const loginRateLimitMap = new Map<string, RateLimitRecord>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Validates and retrieves the HMAC secret key.
 * In production, strictly enforces a minimum 32-character custom secret.
 */
function getSessionSecret(): string {
  const isProd = process.env.NODE_ENV === "production";
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (isProd) {
    if (!secret || secret.length < 32 || secret === DEV_FALLBACK_SECRET) {
      throw new Error(
        "Production configuration error: ADMIN_SESSION_SECRET must be set with at least 32 characters in production."
      );
    }
    return secret;
  }

  return secret || DEV_FALLBACK_SECRET;
}

/**
 * Constant-time comparison between two strings to prevent timing attacks.
 */
function safeStringCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, "utf-8");
    const bufB = Buffer.from(b, "utf-8");
    if (bufA.length !== bufB.length) {
      crypto.timingSafeEqual(bufA, bufA); // Prevent length disclosure timing
      return false;
    }
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

function createSignature(data: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

function encodeSession(payload: SessionPayload): string {
  const secret = getSessionSecret();
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createSignature(data, secret);
  return `${data}.${signature}`;
}

function decodeSession(token: string): SessionPayload | null {
  try {
    const secret = getSessionSecret();
    const [data, signature] = token.split(".");
    if (!data || !signature) return null;

    const expectedSig = createSignature(data, secret);
    if (!safeStringCompare(signature, expectedSig)) return null;

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

/**
 * Checks and updates rate limits for failed login attempts.
 */
function checkRateLimit(identifier: string): { allowed: boolean; remainingMinutes?: number } {
  const now = Date.now();
  const record = loginRateLimitMap.get(identifier);

  if (record) {
    if (now < record.lockedUntil) {
      const remainingMinutes = Math.ceil((record.lockedUntil - now) / 60000);
      return { allowed: false, remainingMinutes };
    }
    if (now > record.lockedUntil && record.lockedUntil > 0) {
      // Lockout expired, reset counter
      loginRateLimitMap.delete(identifier);
    }
  }

  return { allowed: true };
}

function recordFailedAttempt(identifier: string): void {
  const now = Date.now();
  const record = loginRateLimitMap.get(identifier) || { count: 0, lockedUntil: 0 };
  record.count += 1;

  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_WINDOW_MS;
  }

  loginRateLimitMap.set(identifier, record);
}

function recordSuccessfulAttempt(identifier: string): void {
  loginRateLimitMap.delete(identifier);
}

/**
 * Validates admin credentials.
 * Enforces production secrets, timing attack safety, brute-force mitigation,
 * and verified role authorization on Supabase.
 */
export async function verifyAdminCredentials(
  email: string,
  pass: string
): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedPass = pass.trim();
  const isProd = process.env.NODE_ENV === "production";

  // Rate Limiting Check
  const rateLimitStatus = checkRateLimit(trimmedEmail);
  if (!rateLimitStatus.allowed) {
    return {
      success: false,
      error: `Too many failed login attempts. Account temporarily locked. Please try again in ${rateLimitStatus.remainingMinutes} minute(s).`,
    };
  }

  // 1. Supabase Auth Verification (with Role Verification)
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: trimmedPass,
        });

        if (!error && data.user) {
          // Verify that user has an explicit admin role in admin_profiles
          const adminClient = getSupabaseAdminClient();
          if (adminClient) {
            const { data: profile, error: profileErr } = await adminClient
              .from("admin_profiles")
              .select("role")
              .eq("id", data.user.id)
              .single();

            if (profileErr || !profile || !["superadmin", "admin"].includes(profile.role)) {
              recordFailedAttempt(trimmedEmail);
              return {
                success: false,
                error: "Access denied. Your account is authenticated but does not possess administrator privileges.",
              };
            }
          }

          const user: AdminUser = {
            id: data.user.id,
            email: data.user.email || trimmedEmail,
            name: data.user.user_metadata?.name || "Administrator",
            role: "admin",
          };
          recordSuccessfulAttempt(trimmedEmail);
          await createAdminSessionCookie(user);
          return { success: true, user };
        }
      }
    } catch {
      // Fall through to primary environment credential check
    }
  }

  // 2. Environment Administrator Credentials Validation
  const configuredEmail = process.env.ADMIN_EMAIL;
  const configuredPassword = process.env.ADMIN_PASSWORD;

  // Strict Production Enforcement: Never accept missing or default credentials in production
  if (isProd) {
    if (!configuredEmail || !configuredPassword) {
      return {
        success: false,
        error: "Production security error: ADMIN_EMAIL and ADMIN_PASSWORD must be configured in environment variables.",
      };
    }

    if (
      configuredPassword === "Futureix@2026!" ||
      configuredPassword === "password" ||
      configuredPassword === "admin" ||
      configuredPassword.length < 12
    ) {
      return {
        success: false,
        error: "Production security error: Default or weak ADMIN_PASSWORD detected. A custom strong password (minimum 12 characters) is required in production.",
      };
    }
  }

  // Active comparison values
  const expectedEmail = (configuredEmail || (isProd ? "" : "admin@futureix.in")).toLowerCase();
  const expectedPassword = configuredPassword || (isProd ? "" : "Futureix@2026!");

  if (!expectedEmail || !expectedPassword) {
    recordFailedAttempt(trimmedEmail);
    return { success: false, error: "Administrator credentials have not been configured on this server." };
  }

  // Timing-safe comparison of both email and password
  const emailMatches = safeStringCompare(trimmedEmail, expectedEmail);
  const passwordMatches = safeStringCompare(trimmedPass, expectedPassword);

  if (emailMatches && passwordMatches) {
    const user: AdminUser = {
      id: "admin-1",
      email: expectedEmail,
      name: "FUTUREIX Administrator",
      role: "admin",
    };
    recordSuccessfulAttempt(trimmedEmail);
    await createAdminSessionCookie(user);
    return { success: true, user };
  }

  recordFailedAttempt(trimmedEmail);
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
