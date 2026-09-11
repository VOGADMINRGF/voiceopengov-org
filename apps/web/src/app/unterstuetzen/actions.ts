"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SUPPORT_COOKIE,
  createSupportCookie,
  isSupportPasswordValid,
} from "@/lib/supportSession";
import { readSecret } from "@/lib/runtimeSecrets";

const COOKIE_TTL_DAYS = 7;

function getSupportPassword() {
  return readSecret("VOG_SUPPORT_PASSWORD");
}

function getSupportSecret() {
  return readSecret("VOG_SUPPORT_SESSION_SECRET");
}

export async function loginSupporter(formData: FormData) {
  const password = String(formData.get("password") || "").trim();
  const expected = getSupportPassword();

  const secret = getSupportSecret();
  if (!expected || !secret) {
    redirect("/unterstuetzen?error=unconfigured");
  }

  if (!password || !isSupportPasswordValid(password, expected)) {
    redirect("/unterstuetzen?error=invalid");
  }

  const { value, expiresAt } = createSupportCookie(secret, COOKIE_TTL_DAYS);
  cookies().set(SUPPORT_COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(expiresAt),
    path: "/",
  });

  redirect("/unterstuetzen");
}

export async function logoutSupporter() {
  cookies().set(SUPPORT_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
  redirect("/unterstuetzen");
}
