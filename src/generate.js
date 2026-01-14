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
    content: "Актуальні вакансії для кур'єрів у Польщі. Безкоштовна консультація."
  },
  {
    slug: "glovo-work-poland",
    title: "Робота в Glovo Польща",
    content: "Як почати працювати в Glovo у Польщі. Документи, оплата, умови."
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

console.log("Pages generated");
