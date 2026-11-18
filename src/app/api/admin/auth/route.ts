import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  verifyAdminPassword,
  createSessionToken,
  verifySessionToken,
  checkRateLimit,
  registerFailedLogin,
  resetRateLimit,
  ADMIN_COOKIE_NAME,
} from "@/lib/auth-admin";

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "127.0.0.1";
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rateStatus = checkRateLimit(ip);

    if (!rateStatus.allowed) {
      return NextResponse.json(
        {
          error: `Trop de tentatives échouées. Accès temporairement bloqué pendant ${Math.ceil(
            (rateStatus.retryAfterSec || 900) / 60
          )} minutes.`,
        },
        { status: 429 }
      );
    }

    const { password } = await req.json();

    if (!password || typeof password !== "string") {
      registerFailedLogin(ip);
      return NextResponse.json(
        { error: "Veuillez saisir votre mot de passe administrateur." },
        { status: 400 }
      );
    }

    const isValid = verifyAdminPassword(password);
    if (!isValid) {
      registerFailedLogin(ip);
      const updatedStatus = checkRateLimit(ip);
      return NextResponse.json(
        {
          error: `Mot de passe administrateur incorrect. (${updatedStatus.remainingAttempts} essai(s) restant(s))`,
        },
        { status: 401 }
      );
    }

    // Success: reset rate limit and issue signed HMAC session token
    resetRateLimit(ip);
    const sessionToken = createSessionToken();

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      success: true,
      message: "Authentification administrateur réussie.",
    });
  } catch (error) {
    console.error("Admin Auth Error:", error);
    return NextResponse.json({ error: "Erreur serveur lors de la connexion." }, { status: 500 });
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME);

  if (token && verifySessionToken(token.value)) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  return NextResponse.json({ success: true, message: "Déconnexion réussie." });
}
