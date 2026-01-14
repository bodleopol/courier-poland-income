import fs from "fs";
import path from "path";

const outputDir = "dist";
const templatePath = "src/templates/page.html";

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const template = fs.readFileSync(templatePath, "utf-8");

const pages = [
  {
    slug: "courier-job-poland",
    title: "Робота кур'єром у Польщі — вакансії 2026",
    content: "Актуальні вакансії для кур'єрів у Польщі. Glovo, Uber Eats, Bolt."
  },
  {
    slug: "glovo-work-poland",
    title: "Робота в Glovo Польща",
    content: "Як почати працювати в Glovo у Польщі: документи, оплата, умови."
  }
];

pages.forEach(page => {
  const html = template
    .replace("{{TITLE}}", page.title)
    .replace("{{CONTENT}}", page.content);

  fs.writeFileSync(
    path.join(outputDir, `${page.slug}.html`),
    html
  );
});

const links = pages
  .map(p => `<li><a href="./${p.slug}.html">${p.title}</a></li>`)
  .join("");

const indexHtml = `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <title>Робота кур'єром у Польщі</title>
</head>
<body>
  <h1>Робота кур'єром у Польщі</h1>
  <ul>${links}</ul>
</body>
</html>`;

fs.writeFileSync(path.join(outputDir, "index.html"), indexHtml);

console.log("Pages generated incl. index.html");
