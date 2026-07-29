# Testing Strategy

To maintain FAANG-level stability and security, CareerOS-AI enforces a multi-layered testing strategy. Empty placeholder folders have been deprecated in favor of actionable guidelines and automated enforcement via GitHub Actions.

## 1. Unit Testing
- **Backend:** JUnit 5 and Mockito. All critical business logic, services, and utility classes must have unit tests.
- **Frontend:** Vitest (or Jest) + React Testing Library. Component rendering and custom hooks must be verified independently of the DOM.

## 2. Integration Testing
- **Backend:** Spring Boot Test (`@SpringBootTest`). We use Testcontainers to spin up ephemeral PostgreSQL instances to verify JPA repository behavior and API layer contracts without mutating the production or staging databases.
- **Frontend:** API mocking using Mock Service Worker (MSW) to verify Redux/React Query state changes against simulated backend responses.

## 3. Static Analysis & Security (SAST)
- **CodeQL:** Automatically scans Java and TypeScript code for zero-day vulnerabilities and CVEs upon every push to `main`.
- **Dependency Review:** GitHub Actions automatically blocks PRs that introduce vulnerable transitive dependencies.

## 4. E2E Testing (Future Roadmap)
End-to-End tests simulating real user interactions across the full Vercel-Render-Neon stack using **Playwright**. Once implemented, these tests will reside in a dedicated `tests/e2e` directory.
