export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);

    if (response.status !== 404) {
      return response;
    }

    const notFoundUrl = new URL('/404.html', request.url);
    const notFoundResponse = await env.ASSETS.fetch(notFoundUrl);

    if (notFoundResponse.status === 404) {
      return response;
    }

    return new Response(notFoundResponse.body, {
      status: 404,
      headers: notFoundResponse.headers
    });
  }
};
