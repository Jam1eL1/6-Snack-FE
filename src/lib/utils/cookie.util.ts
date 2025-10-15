import { cookies } from "next/headers";

// Function to get token from cookie (client)
export function getTokenFromCookie() {
  if (typeof window === "undefined") return null;

  const cookies = document.cookie.split(";");
  const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith("accessToken="));
  return tokenCookie ? tokenCookie.trim().split("=")[1] : null;
}

// Function to get token from cookie on server
export async function getTokenFromServerCookie() {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value || null;
}

// Function to save token to cookie (can be used freely in both server and client environments)
export function setTokensToCookie(accessToken: string, refreshToken?: string) {
  if (typeof window === "undefined") {
    // In server environment
    return setServerSideTokens(accessToken, refreshToken);
  }

  // In browser environment
  const accessTokenData = JSON.parse(atob(accessToken.split(".")[1]));
  const accessTokenExpiresIn = accessTokenData.exp - Math.floor(Date.now() / 1000);

  document.cookie = `accessToken=${accessToken}; path=/; max-age=${accessTokenExpiresIn}; SameSite=Lax`;

  if (refreshToken) {
    const refreshTokenData = JSON.parse(atob(refreshToken.split(".")[1]));
    const refreshTokenExpiresIn = refreshTokenData.exp - Math.floor(Date.now() / 1000);
    document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${refreshTokenExpiresIn}; SameSite=Lax`;
  }
}

// Server-side token setting
async function setServerSideTokens(accessToken: string, refreshToken?: string) {
  const cookieStore = await cookies();

  const accessTokenData = JSON.parse(atob(accessToken.split(".")[1]));
  const accessTokenExpiresIn = accessTokenData.exp - Math.floor(Date.now() / 1000);

  cookieStore.set({
    name: "accessToken",
    value: accessToken,
    httpOnly: true,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: accessTokenExpiresIn,
  });

  if (refreshToken) {
    const refreshTokenData = JSON.parse(atob(refreshToken.split(".")[1]));
    const refreshTokenExpiresIn = refreshTokenData.exp - Math.floor(Date.now() / 1000);

    cookieStore.set({
      name: "refreshToken",
      value: refreshToken,
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: refreshTokenExpiresIn,
    });
  }
}

// Delete token from cookie
export async function removeTokensFromCookie() {
  if (typeof window === "undefined") {
    // In server environment
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    return;
  }

  // In browser environment
  document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}
