# Contributing to CareerOS AI

First off, thank you for considering contributing to CareerOS AI! It's people like you that make this platform such a great tool for students and educators.

## Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting Started

### Prerequisites

*   **Java 21**
*   **Node.js 20+**
*   **Docker & Docker Compose**
*   **Git**

### Local Development Setup

1.  **Fork the repository** on GitHub.
2.  **Clone the forked repository** to your local machine:
    ```bash
    git clone https://github.com/<your-username>/CareerOS-AI.git
    cd CareerOS-AI
    ```
3.  **Start PostgreSQL and Redis** via Docker:
    ```bash
    docker-compose -f docker-compose.yml up -d postgres redis
    ```
4.  **Run the Backend**:
    ```bash
    cd backend
    ./gradlew bootRun
    ```
5.  **Run the Frontend**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## Development Workflow

### Branch Naming Convention

We use a standard branching strategy. Branch names should be descriptive and follow this pattern:

*   `feature/<feature-name>` (e.g., `feature/ai-resume-parser`)
*   `fix/<issue-name>` (e.g., `fix/jwt-auth-expiration`)
*   `docs/<docs-update>` (e.g., `docs/update-readme-badges`)
*   `chore/<maintenance-task>` (e.g., `chore/bump-react-version`)

### Commit Messages

Commit messages should be clear, concise, and follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. 

Example:
`feat(ai): integrate OpenAI API for resume scoring`
`fix(ui): resolve overflow issue on mobile dashboard`

### Pull Requests

1.  **Create a new branch** from `main`.
2.  Make your changes, ensuring code is formatted correctly and passes all checks.
3.  **Run backend tests**: `./gradlew test`
4.  **Run frontend tests**: `npm run lint` and `npm run build`
5.  Push your branch and **submit a Pull Request (PR)** against the `main` branch.
6.  Ensure your PR description clearly describes the problem and solution.

## Code Style & Linting

*   **Backend**: We use Checkstyle/Spotless for Java to maintain code consistency.
*   **Frontend**: We use ESLint and Prettier for React/TypeScript formatting.

Run linters locally before submitting your PR to ensure CI/CD passes smoothly.

## Architectural Principles

Please review our architecture documentation in the README before modifying core components. We strictly adhere to Domain-Driven Design (DDD) principles in the backend and a modular component structure in the frontend.

Any modifications to database schemas require a new Flyway migration script in `backend/src/main/resources/db/migration`. Do not modify existing migrations.
