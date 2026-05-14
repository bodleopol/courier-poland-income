# Security Guidelines

## 🔐 GitHub Token Security

### ⚠️ NEVER Commit Tokens

**NEVER** commit GitHub tokens or any sensitive credentials to the repository:
- ❌ Personal Access Tokens (PATs) starting with `ghp_`
- ❌ OAuth tokens starting with `gho_`
- ❌ GitHub App tokens starting with `ghs_`
- ❌ API keys, passwords, or secrets

### ✅ Proper Token Usage

#### For GitHub Actions
This repository uses GitHub Actions for deployment. The workflow automatically receives a `GITHUB_TOKEN` with appropriate permissions:

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

**No manual token configuration is needed.**

#### For Local Development
If you need GitHub API access for local development:

1. **Use environment variables** (never commit these):
   ```bash
   export GITHUB_TOKEN=your_token_here
   ```

2. **Add to .env file** (already in .gitignore):
   ```
   GITHUB_TOKEN=your_token_here
   ```

3. **Never hardcode tokens** in scripts or configuration files

### 🚨 If a Token is Exposed

If a GitHub token has been accidentally exposed:

1. **Immediately revoke the token**:
   - Go to https://github.com/settings/tokens
   - Find the exposed token
   - Click "Delete" or "Revoke"

2. **Generate a new token** if needed:
   - Go to https://github.com/settings/tokens
   - Click "Generate new token"
   - Set appropriate scopes (minimal permissions needed)
   - Store securely using environment variables

3. **Check git history**:
   ```bash
   git log -S "ghp_" --all
   ```

4. **If token was committed**, consider using tools like:
   - `git-filter-repo` to remove from history
   - Or create a new repository without the sensitive history

### 📋 Security Checklist

- [x] `.gitignore` includes `.env` files
- [x] No hardcoded tokens in codebase
- [x] GitHub Actions use built-in `GITHUB_TOKEN`
- [x] Workflow permissions follow principle of least privilege
- [x] Security documentation is in place

### 🔍 Regular Security Audits

Periodically check for exposed secrets:

```bash
# Check current files
grep -r "ghp_\|gho_\|ghs_" . --exclude-dir=.git --exclude-dir=node_modules

# Check git history
git log -S "ghp_" --all --oneline
git log -S "GITHUB_TOKEN" --all --oneline
```

## 📚 Additional Resources

- [GitHub Token Security Best Practices](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [Managing GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Security Hardening for GitHub Actions](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)

## 🛡️ Reporting Security Issues

If you discover a security vulnerability, please report it privately:
- **DO NOT** open a public issue
- Contact the repository owner directly
- Include details about the vulnerability and steps to reproduce

---

**Last Updated**: 2026-02-19  
**Status**: ✅ No exposed tokens found in current codebase
