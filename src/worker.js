export default {
  async fetch(request, env) {
    let response = await env.ASSETS.fetch(request);

    // If we have custom logic for 404 handling beyond what Wrangler handles, we can put it here.
    if (response.status === 404) {
      // Trying to return 404-page if needed, though Wrangler.toml handles it mostly.
      const notFoundResponse = await env.ASSETS.fetch(new Request(new URL("/404.html", request.url)));
      return new Response(notFoundResponse.body, { ...notFoundResponse, status: 404 });
    }

    return response;
  }
};
