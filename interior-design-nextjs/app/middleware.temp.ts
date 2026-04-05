import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const response = NextResponse.next();

//   response.headers.set(
//     "Access-Control-Allow-Origin",
//     "http://localhost:5173" // your React app port
//   );
//   response.headers.set("Access-Control-Allow-Credentials", "true");
//   response.headers.set(
//     "Access-Control-Allow-Methods",
//     "GET,POST,PUT,DELETE,OPTIONS"
//   );
//   response.headers.set(
//     "Access-Control-Allow-Headers",
//     "Content-Type, Authorization"
//   );

//   // Handle preflight request
//   if (request.method === "OPTIONS") {
//     return new NextResponse(null, { status: 200, headers: response.headers });
//   }

//   return response;
// }

export function middleware() {
    // retrieve the current response
    const res = NextResponse.next()

    // add the CORS headers to the response
    res.headers.append('Access-Control-Allow-Credentials', "true")
    res.headers.append('Access-Control-Allow-Origin', 'http://localhost:5173/') // replace this your actual origin
    res.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
    res.headers.append(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )

    return res
}

export const config = {
  matcher: ["/api/:path*",] // apply only to API routes
};