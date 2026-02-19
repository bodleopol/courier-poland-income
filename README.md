# courier-poland-income

A static site generator for job vacancies and blog posts about courier work opportunities in Poland.

## 🚀 Quick Start

### Prerequisites
- Node.js 20 or higher
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bodleopol/courier-poland-income.git
cd courier-poland-income
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Configure environment variables:
```bash
cp .env.example .env
# Edit .env and add your configuration
```

### Building the Site

```bash
npm run build
```

This will:
- Generate static HTML pages from templates
- Process vacancy and blog post data
- Create sitemaps
- Output everything to the `dist/` directory

### Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the `main` branch. See `.github/workflows/deploy.yml` for the deployment configuration.

## 📁 Project Structure

- `src/` - Source code and templates
  - `generate.js` - Main site generator
  - `generate-sitemap.js` - Sitemap generator
  - `templates/` - HTML templates
  - `content.json` - Vacancy data
  - `posts.json` - Blog posts data
- `dist/` - Generated static site (not committed)
- `.github/workflows/` - GitHub Actions workflows

## 🔒 Security

- See [SECURITY.md](SECURITY.md) for security policies and best practices
- Never commit `.env` files or tokens to the repository
- Use environment variables for sensitive configuration
- The deployment workflow uses GitHub's built-in `GITHUB_TOKEN` (no custom tokens needed)

## 🛠️ Development

### Environment Variables

This project uses environment variables for optional configuration. See `.env.example` for available options:

- `GOOGLE_SITE_VERIFICATION_TOKEN` - Google Search Console verification
- `INDEXABLE_VACANCIES_LIMIT` - Number of vacancy pages to make indexable (default: 50)

### Running Scripts

- `npm run build` - Build the entire site
- `npm run sitemap` - Generate sitemaps only

## 📝 License

See repository for license information.