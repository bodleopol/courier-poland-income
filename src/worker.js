export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Simple static file serving logic mapping to /dist
    let assetPath = path === '/' ? '/index.html' : path;

    try {
      const response = await env.ASSETS.fetch(request);

      if (response.status === 404 && !path.includes('.')) {
         // return 404 page if no extension and not found
         return env.ASSETS.fetch(new Request(new URL('/404.html', request.url)));
      }
      return response;
    } catch (e) {
      return new Response("Not Found", { status: 404 });
    }
  }
};
