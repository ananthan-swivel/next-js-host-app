import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const cookieName = "testingcoote";
  const cookies = request.cookies;
  let uuid = cookies.get(cookieName)?.value;

  if (!uuid) {
    uuid = crypto.randomUUID();
    const response = NextResponse.next();
    response.cookies.set(cookieName, uuid, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/users", "/logsync"],
};
