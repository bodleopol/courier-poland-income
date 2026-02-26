# Rybezh — Пошук роботи в Польщі

Платформа для пошуку роботи в Польщі для всіх — від логістики та будівництва до IT, медицини та ресторанного бізнесу. Актуальні вакансії, калькулятор зарплати, генератор CV, перевірка вакансій та система верифікації Rybezh Proof.

**Сайт:** [rybezh.site](https://rybezh.site)

## 🔐 Security

Please review [SECURITY.md](./SECURITY.md) for important security guidelines, especially regarding GitHub tokens and credentials.

**Key Points:**
- Never commit tokens or credentials
- Use environment variables for sensitive data
- Review `.gitignore` before committing

## 🚀 Getting Started

### Prerequisites
- Node.js 20 or higher
- npm

### Installation

```bash
npm install
```

### Build

```bash
npm run build
```

### Utility Scripts

One-off maintenance/data scripts are organized in `/scripts` (for example: `scripts/check.cjs`, `scripts/dedup.js`, `scripts/add-batch-*.cjs`).

### Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the `main` branch. See [DEPLOYMENT_INSTRUCTIONS.md](./DEPLOYMENT_INSTRUCTIONS.md) for details.

## 📝 Contributing

When contributing to this repository:
1. Never commit sensitive data (tokens, API keys, passwords)
2. Use `.env` files for local configuration (already in `.gitignore`)
3. Follow the security guidelines in [SECURITY.md](./SECURITY.md)

## 📄 License

This project is proprietary. All rights reserved.
