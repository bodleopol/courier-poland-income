# Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability in this project, please report it by:
1. **Do NOT** open a public issue
2. Email the repository owner directly through GitHub
3. Include detailed information about the vulnerability

## Secure Development Practices

### Environment Variables and Secrets

**NEVER** commit sensitive information to the repository:
- API keys
- Access tokens
- Passwords
- Private keys
- Service account credentials

### Proper Token Management

1. **Use Environment Variables**: Store all secrets in `.env` files (already in `.gitignore`)
2. **Use GitHub Secrets**: For GitHub Actions workflows, use repository secrets
3. **Rotate Tokens Regularly**: Change tokens periodically and after any potential exposure
4. **Use Minimal Permissions**: Grant only necessary permissions to tokens and service accounts

### GitHub Actions Security

This project uses GitHub Actions for deployment. Security measures:

1. **Built-in GITHUB_TOKEN**: The workflow uses GitHub's built-in `GITHUB_TOKEN` which is automatically provided and scoped to the repository
2. **Minimal Permissions**: The workflow uses minimal permissions:
   - `contents: read` - Only read access to repository
   - `pages: write` - Write access only for GitHub Pages deployment
   - `id-token: write` - For OIDC authentication

3. **No Custom Tokens Required**: The deployment workflow doesn't require any custom GitHub tokens

### Environment Variables Used

This project uses the following environment variables (see `.env.example`):

- `GOOGLE_SITE_VERIFICATION_TOKEN` (optional): Google Search Console verification
- `INDEXABLE_VACANCIES_LIMIT` (optional): SEO configuration

### What to Do If a Token Is Exposed

If you accidentally commit a token or secret:

1. **Immediately Revoke**: Go to the service (GitHub, Google, etc.) and revoke/delete the exposed token
2. **Generate New Token**: Create a new token with appropriate permissions
3. **Update Configuration**: Update the `.env` file or GitHub Secrets with the new token
4. **Remove from History**: Consider using `git filter-branch` or BFG Repo-Cleaner to remove from git history
5. **Notify**: If the repository is shared, notify collaborators

### GitHub Token Types

- **Personal Access Tokens (PAT)**: Format `ghp_...` - Never commit these!
- **GITHUB_TOKEN**: Automatically provided by GitHub Actions - Safe to use in workflows

### Checklist for Contributors

Before committing:
- [ ] No tokens, keys, or passwords in code
- [ ] All secrets use environment variables
- [ ] `.env` file is in `.gitignore`
- [ ] No sensitive data in commit messages
- [ ] Reviewed `git diff` before committing

## Dependencies Security

Run `npm audit` regularly to check for known vulnerabilities in dependencies:

```bash
npm audit
npm audit fix  # Apply automatic fixes
```

## License

This security policy is part of the courier-poland-income project.
