export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);

    // Security headers that also improve search engine trust
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'SAMEORIGIN');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');

    // Cache control for static assets (improves Core Web Vitals / PageSpeed)
    const pathname = url.pathname;
    if (/\.(css|js|svg|png|jpg|jpeg|webp|ico|woff2?)$/i.test(pathname)) {
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (pathname.endsWith('.html') || pathname === '/') {
      headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    } else if (pathname.endsWith('.xml') || pathname.endsWith('.txt')) {
      headers.set('Cache-Control', 'public, max-age=86400');
    }

    if (response.status !== 404) {
      return new Response(response.body, {
        status: response.status,
        headers
      });
    }

    // Custom 404 page with proper status
    const notFoundUrl = new URL('/404.html', request.url);
    const notFoundResponse = await env.ASSETS.fetch(notFoundUrl);

    if (notFoundResponse.status === 404) {
      return new Response(response.body, { status: 404, headers });
    }

    const notFoundHeaders = new Headers(notFoundResponse.headers);
    notFoundHeaders.set('X-Content-Type-Options', 'nosniff');
    notFoundHeaders.set('X-Robots-Tag', 'noindex');
    notFoundHeaders.set('Cache-Control', 'no-cache');

    return new Response(notFoundResponse.body, {
      status: 404,
      headers: notFoundHeaders
    });
  }
};
