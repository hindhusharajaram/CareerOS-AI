# Security Policy

## Supported Versions

We currently support the following versions of CareerOS AI with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| 0.9.x   | :x:                |
| < 0.9   | :x:                |

## Reporting a Vulnerability

Security is a top priority for CareerOS AI. We take all security vulnerabilities seriously.

If you have discovered a security vulnerability in this project, please report it privately. **Do not disclose it publicly until it has been resolved.**

To report a vulnerability, please email **security@careeros.ai** with the following information:

1. **Type of issue** (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
2. **Full paths of source file(s)** related to the manifestation of the issue
3. **The location of the affected source code** (tag/branch/commit or direct URL)
4. **Any special configuration** required to reproduce the issue
5. **Step-by-step instructions** to reproduce the issue
6. **Proof-of-concept or exploit code** (if possible)
7. **Impact of the issue**, including how an attacker might exploit the issue

We will send an acknowledgment email within 48 hours of receiving the report. Our team will investigate the report and provide an estimated timeline for the fix.

## Responsible Disclosure Process

1. Provide us a reasonable amount of time to resolve the issue before disclosing it to the public or a third party.
2. Make a good faith effort to avoid violating privacy, destroying data, or interrupting or degrading our service.
3. We will recognize your contribution and publicly acknowledge you once the vulnerability is addressed (unless you prefer to remain anonymous).

## CI/CD and Dependency Security

CareerOS AI uses automated dependency scanning (e.g., Dependabot, Snyk) and runs comprehensive tests on every PR to ensure the continuous security of the application. Please ensure any dependencies added are actively maintained and have no known vulnerabilities.
