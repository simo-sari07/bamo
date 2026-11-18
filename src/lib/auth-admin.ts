import crypto from "crypto";
import fs from "fs";
import path from "path";

const CONFIG_PATH = path.join(process.cwd(), "data", "admin-config.json");
const ADMIN_SECRET_KEY = process.env.ADMIN_SESSION_SECRET || "bamo_haute_parfumerie_secret_key_2026";
export const ADMIN_COOKIE_NAME = "bamo_admin_session";

// In-memory rate limiting store: ip -> { count, lastAttempt, blockedUntil }
const rateLimitMap = new Map<string, { count: number; lastAttempt: number; blockedUntil?: number }>();

interface AdminConfig {
  passwordHash: string;
  salt: string;
  updatedAt: string;
}

// Default password is "bamo2026"
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
}

function ensureConfigDir() {
  const dir = path.dirname(CONFIG_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function getAdminConfig(): AdminConfig {
  ensureConfigDir();
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      const data = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
      if (data.passwordHash && data.salt) {
        return data;
      }
    } catch {
      // fallback
    }
  }

  // Initialize with default password "bamo2026"
  const defaultSalt = crypto.randomBytes(16).toString("hex");
  const defaultHash = hashPassword(process.env.ADMIN_PASSWORD || "bamo2026", defaultSalt);
  const initialConfig: AdminConfig = {
    passwordHash: defaultHash,
    salt: defaultSalt,
    updatedAt: new Date().toISOString(),
  };

  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(initialConfig, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write admin config:", e);
  }

  return initialConfig;
}

export function verifyAdminPassword(password: string): boolean {
  const config = getAdminConfig();
  const inputHash = hashPassword(password, config.salt);
  return crypto.timingSafeEqual(Buffer.from(inputHash, "hex"), Buffer.from(config.passwordHash, "hex"));
}

export function updateAdminPassword(newPassword: string): boolean {
  try {
    ensureConfigDir();
    const newSalt = crypto.randomBytes(16).toString("hex");
    const newHash = hashPassword(newPassword, newSalt);
    const updated: AdminConfig = {
      passwordHash: newHash,
      salt: newSalt,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(updated, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error updating admin password:", err);
    return false;
  }
}

// Generate secure signed session token: "admin.{timestamp}.{signature}"
export function createSessionToken(): string {
  const issuedAt = Date.now();
  const payload = `bamo_admin:${issuedAt}`;
  const signature = crypto.createHmac("sha256", ADMIN_SECRET_KEY).update(payload).digest("hex");
  return `${issuedAt}.${signature}`;
}

// Verify session token integrity and 7-day validity
export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [issuedAtStr, signature] = parts;
  const issuedAt = parseInt(issuedAtStr, 10);
  if (isNaN(issuedAt)) return false;

  // Max age: 7 days
  const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
  if (Date.now() - issuedAt > maxAgeMs) {
    return false; // Expired
  }

  const payload = `bamo_admin:${issuedAt}`;
  const expectedSignature = crypto.createHmac("sha256", ADMIN_SECRET_KEY).update(payload).digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expectedSignature, "hex"));
  } catch {
    return false;
  }
}

// Rate Limiting: Max 5 failed attempts in 15 minutes
export function checkRateLimit(ip: string): { allowed: boolean; remainingAttempts: number; retryAfterSec?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (record && record.blockedUntil && record.blockedUntil > now) {
    const retryAfterSec = Math.ceil((record.blockedUntil - now) / 1000);
    return { allowed: false, remainingAttempts: 0, retryAfterSec };
  }

  if (!record || now - record.lastAttempt > 15 * 60 * 1000) {
    return { allowed: true, remainingAttempts: 5 };
  }

  const remaining = Math.max(0, 5 - record.count);
  return { allowed: remaining > 0, remainingAttempts: remaining };
}

export function registerFailedLogin(ip: string) {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, lastAttempt: now };

  if (now - record.lastAttempt > 15 * 60 * 1000) {
    record.count = 1;
  } else {
    record.count += 1;
  }
  record.lastAttempt = now;

  if (record.count >= 5) {
    record.blockedUntil = now + 15 * 60 * 1000; // Block for 15 minutes
  }

  rateLimitMap.set(ip, record);
}

export function resetRateLimit(ip: string) {
  rateLimitMap.delete(ip);
}
