import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all paths except Next.js internals, static files, and assets
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"]
};
