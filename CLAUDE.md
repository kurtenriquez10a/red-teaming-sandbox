# Red Teaming Security Testing Project

## Project Overview
This is a Next.js application designed for red teaming security assessments and defensive security tool development. The project is authorized under the Official Red Team Authorization Document for evaluating AI agent security vulnerabilities.

## Authorization Context
**Reference Document**: `/docs/Red Teaming Authorization Doc.md`

This project is officially authorized by AI Agent's Security Team (Authorization Date: 2025-06-19) for:
- Adversarial red teaming assessments in collaboration with AI Agent's Security Team
- Prompt injection vulnerability testing and mitigation
- Privacy and data exfiltration risk evaluation
- Development of defensive security tools and methodologies
- Testing sophisticated adversarial tactics, techniques, and procedures (TTPs)

## Security Testing Framework
**Reference Document**: `/docs/Context Documentation_ Red-Teaming Data Exfil Framework.md`

The project focuses on identifying and mitigating these key risk patterns:
- **Invisible tool/debug workflows**: Background actions that silently transmit user data
- **Premature PII auto-fill**: Forms populated with sensitive data before user consent
- **Trust in low-credibility sources**: Attacks leveraging minimal reputation to bypass security checks

### Key Exfiltration Scenarios to Test
- Malicious GitHub Issue (curl GET attacks)
- Fake Travel/Restaurant booking sites (form keyloggers)
- Image-URL path exfiltration
- Fake website error message exploits

## Project Structure
- Next.js 15 with TypeScript
- Tailwind CSS for styling
- ESLint for code quality
- Turbopack for development

## Development Commands
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `./scripts/smoke.sh [URL]` - Run security testing smoke test

## Deployment
- **Production URL**: https://redteaming-542ftltsm-kurts-projects-659ec159.vercel.app
- **Platform**: Vercel with Edge Runtime
- **Protection**: Vercel Authentication enabled for security
- **Logging**: Console-based logging for Edge runtime compatibility

## Security Guidelines
- All testing must remain within authorized scope
- Maintain strict confidentiality of findings
- Follow ethical standards and regulatory compliance
- Activities are limited to personnel explicitly authorized by AI Agent
- Testing conducted in secure, sandboxed environments only

## Defensive Focus
This project is specifically designed for **defensive security purposes** including:
- Vulnerability detection and analysis
- Security tool development
- Detection rule creation
- Defensive system implementation
- Security awareness training materials