# Bid POrtal 

## Overview

This project is a full-stack application that includes a Fastify server with Auth0 validation and Swagger documentation, a Supabase database connection, and a React-based UI built with Vite and Tailwind CSS. The project also includes a CI/CD setup with GitHub Actions and comprehensive testing using Vitest for unit tests and Playwright for end-to-end (E2E) tests.

## Features

- **Fastify Server**: A high-performance web framework for Node.js with Auth0 validation and Swagger documentation.
- **Supabase Integration**: Connects to a Supabase database for data storage and management.
- **React UI**: A modern front-end built with React, Vite, and Tailwind CSS.
- **CI/CD with GitHub Actions**: Automated workflows for building, testing, and deploying the application.
- **Testing**: Unit tests with Vitest and E2E tests with Playwright.

## Prerequisites

- Node.js (v20 or higher)
- npm (v8 or higher)
- Supabase account and project
- Auth0 account and application
- vercel CLI (for deployment)

## Getting Started

### Clone the Repository

```sh
git clone https://github.com/bvkakadiya/DemoProject.git
cd DemoProject
```

### Install Dependencies

```sh
npm install
```

### Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```env
# Auth0
AUTH0_DOMAIN=your-auth0-domain
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret

# Supabase
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
```

### Start the Development Server

#### Backend (Fastify)

```sh
cd api
npm run dev
```

#### Frontend (React)

```sh
cd ui
npm run dev
```

### Build for Production

```sh
npm run build
```

### Run Unit Tests

```sh
npm run test
```

### Run E2E Tests

```sh
npm run test:e2e
```

## Project Structure

```
.
├── api
│   ├── src
│   │   ├── plugins
│   │   ├── routes
│   │   └── index.js
│   ├── test
│   └── ...
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── hooks
│   │   ├── reducers
│   │   ├── services
│   │   ├── store
│   │   ├── utils
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public
│   ├── tests // For E2E
│   └── ...
├── .github
│   └── workflows
│       ├── cicd.yml
|       ├── build.yml
│       └── deploy.yml
├── vercel.json
└── README.md

```

## CI/CD Setup

The project includes GitHub Actions workflows for continuous integration and deployment.

### CI Workflow

The CI workflow (`.github/workflows/ci.yml`) runs on every push to the `main` branch and includes the following steps:

- Checkout code
- Install dependencies
- Run ESLint
- Run unit tests
- Run E2E tests

### CD Workflow

The CD workflow (`.github/workflows/deploy.yml`) deploys the application to Vercel on every push to the `main` branch.

## Technologies Used

- **api**: Fastify, Auth0, Supabase
- **ui**: React, Auth0, Vite, Tailwind CSS
- **Testing**: Vitest, Playwright, Node Test Modules
- **CI/CD**: GitHub Actions, Vercel
