import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const canonicalHostname = "arthasiddhi.com";
const wwwHostname = "www.arthasiddhi.com";

export function proxy(request: NextRequest) {
  if (request.nextUrl.hostname.toLowerCase() !== wwwHostname) {
    return NextResponse.next();
  }

  const destination = request.nextUrl.clone();
  destination.protocol = "https:";
  destination.hostname = canonicalHostname;
  destination.port = "";

  return NextResponse.redirect(destination, 308);
}
