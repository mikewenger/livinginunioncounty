import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/admin")) {
    const password = process.env.ADMIN_PASSWORD;
    if (!password) return NextResponse.next();

    const auth = req.headers.get("authorization");
    if (auth?.startsWith("Basic ")) {
      const decoded = atob(auth.slice(6));
      const pwd = decoded.split(":").slice(1).join(":");
      if (pwd === password) return NextResponse.next();
    }

    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
