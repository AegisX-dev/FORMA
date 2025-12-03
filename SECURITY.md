# Security Policy

## 🔒 Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.1.x   | ✅ Active Support  |
| 1.0.x   | ❌ End of Life     |

## 🛡️ Reporting a Vulnerability

If you discover a security vulnerability in FORMA, please report it responsibly:

1. **Do NOT** create a public GitHub issue
2. Email security concerns to the maintainers
3. Include detailed reproduction steps
4. Allow 48 hours for initial response

## 📋 Security Log

| Date | CVE ID | Severity | Type | Affected | Action | Status |
|------|--------|----------|------|----------|--------|--------|
| 2025-12-03 | CVE-2025-55182 | 🔴 Critical | Remote Code Execution (RCE) | React 19.0.0-19.2.0, Next.js 16.0.6 | Upgraded to Next.js 16.0.7, React 19.2.1 | ✅ Patched |

## 🔐 Security Best Practices

This project follows security best practices:

- **Environment Variables**: All API keys stored in `.env.local` (never committed)
- **Row Level Security**: Supabase RLS policies enabled on all tables
- **Input Validation**: User inputs validated before processing
- **Dependency Auditing**: Regular `npm audit` checks

## 📦 Dependency Updates

We monitor dependencies for vulnerabilities using:
- `npm audit` — Run before each release
- GitHub Dependabot — Automated security alerts
- Manual review of critical packages (Next.js, React, Supabase)

---

<p align="center">
  <sub>Last Updated: December 3, 2025</sub>
</p>
