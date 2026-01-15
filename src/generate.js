const html = template
  .replace("{{TITLE}}", page.title)
  .replace("{{DESCRIPTION}}", page.description)
  .replace("{{CONTENT}}", page.content)
  .replace("{{SLUG}}", page.slug);
