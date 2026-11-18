import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  verifyAdminPassword,
  updateAdminPassword,
  createSessionToken,
  verifySessionToken,
  ADMIN_COOKIE_NAME,
} from "@/lib/auth-admin";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME);

    if (!token || !verifySessionToken(token.value)) {
      return NextResponse.json({ error: "Non autorisé. Session expirée." }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Veuillez renseigner le mot de passe actuel et le nouveau mot de passe." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Le nouveau mot de passe doit comporter au moins 6 caractères." },
        { status: 400 }
      );
    }

    const isCurrentValid = verifyAdminPassword(currentPassword);
    if (!isCurrentValid) {
      return NextResponse.json(
        { error: "Le mot de passe actuel est incorrect." },
        { status: 400 }
      );
    }

    const updated = updateAdminPassword(newPassword);
    if (!updated) {
      return NextResponse.json(
        { error: "Impossible de mettre à jour le mot de passe." },
        { status: 500 }
      );
    }

    // Refresh session token
    const newToken = createSessionToken();
    cookieStore.set(ADMIN_COOKIE_NAME, newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      success: true,
      message: "Mot de passe administrateur mis à jour avec succès.",
    });
  } catch (error) {
    console.error("Change Password Error:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
