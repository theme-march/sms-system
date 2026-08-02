// This file previously exported a POST route which conflicted with the page at the same path.
// To avoid the Next.js conflicting route+page error, the real login POST handler
// has been moved to /api/auth/login/route.ts. This file is left intentionally
// without GET/POST exports so Next.js will not treat it as a route handler.

export const _disabled = true;
