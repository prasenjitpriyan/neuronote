import { auth } from '@/auth';

// NextAuth v5 middleware: auth() wraps the handler, req.auth contains the session
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  const isApiNotes = pathname.startsWith('/api/notes');
  const isAuthRoute = pathname.startsWith('/api/auth');
  const isPublicPage = pathname === '/' || isAuthRoute;

  if (isApiNotes && !isLoggedIn) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isPublicPage && !isLoggedIn) {
    return Response.redirect(new URL('/', req.nextUrl.origin));
  }
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
