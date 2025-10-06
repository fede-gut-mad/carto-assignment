# CARTO QA Technical Test — Playwright + TypeScript

## Description

QA technical test for CARTO QA Engineer position, providing E2E UI and API automated tests

## Tech Stack

- Playwright with TypeScript
- Target CI/CD: Github Actions

## Installation

```bash
npm install
npx playwright install --with-deps
```

## Usage

Run all tests in headed mode

```bash
npx playwright test --headed
```

Run all tests in Chromium

```bash
npx playwright test --project=chromium tests/ui --headed
```

Run all tests in Firefox

```bash
npx playwright test --project=firefox tests/ui --headed
```

Run all tests headlessly

```bash
npx playwright test --headless
```

Run tests with Playwright UI

```bash
npx playwright test --ui
```

Run API tests

```bash
npx playwright test --project=api tests/api
```

Run ESLint checkup

```bash
npm run lint
```

## Reporting

open the last HTML report locally

```bash
npx playwright show-report
```

## CI/CD GitHub Actions

Workflow: .github/workflows/ci.yml

API job (no browsers): runs tests/api, uploads api-report artifact.

UI job (Chromium + Firefox): runs tests/ui, uploads ui-report.
On failure, uploads ui-traces (traces/screenshots) for debugging.

Repo → Settings → Secrets and variables → Actions (required):

CARTO_EMAIL, CARTO_PASSWORD

Artifacts appear on each run’s Summary page (right side). Download the ZIP and open index.html.
