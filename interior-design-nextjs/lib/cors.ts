import { NextResponse } from 'next/server';

const ALLOWED_ORIGINS = [
  "http://localhost:5173",          // dev
  "https://your-frontend.com",      // production
];

export function withCORS(request: Request, response: NextResponse) {
  const origin = request.headers.get("origin") || "";

  if (ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }

  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return response;
}

export function handlePreflight(request: Request) {
  const origin = request.headers.get("origin") || "";

  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (ALLOWED_ORIGINS.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Credentials"] = "true";
  }

  return new NextResponse(null, {
    status: 204,
    headers,
  });
}