export default {
  async fetch(request, env) {
    const page = await env.ASSETS.fetch(request);
    
    // Якщо сторінка не знайдена (404), повернути 404.html
    if (page.status === 404) {
      return env.ASSETS.fetch(new URL('/404.html', request.url));
    }
    
    return page;
  }
};
