# Type-B Digital Fullstack Todo App

A full-stack Todo application built with **React + TypeScript** (frontend) and **Express.js + TypeScript + MongoDB** (backend), managed as an **npm workspaces monorepo**.

---

## Tech Stack

| Layer     | Technology                                              |
|-----------|---------------------------------------------------------|
| Frontend  | React 19, TypeScript, Vite, Redux Toolkit, Tailwind CSS |
| Backend   | Express.js, TypeScript, Mongoose, Swagger               |
| Database  | MongoDB (Atlas or local)                                |
| Monorepo  | npm Workspaces                                          |

---

## Project Structure

```
.
├── apps/
│   ├── backend/          # Express.js API (port 8001)
│   └── frontend/         # React + Vite app (port 5174)
├── package.json          # Root monorepo config & scripts
└── README.md
```

---

## Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **MongoDB** – a running local instance or a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster URI

---

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd Type-B-Digital-Fullstack-Todo-app
```

### 2. Install all dependencies

Run this once from the **root** of the monorepo. It installs dependencies for both apps.

```bash
npm install
```

### 3. Configure environment variables

#### Backend — `apps/backend/.env`

Create the file if it doesn't exist:

```bash
cp apps/backend/.env.example apps/backend/.env   # if example exists, otherwise create manually
```

```env
NODE_ENV=development
PORT=8001
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?appName=<AppName>
CORS_ORIGIN=http://localhost:5174
API_PREFIX=/api/v1
```

| Variable      | Description                                      | Default               |
|---------------|--------------------------------------------------|-----------------------|
| `NODE_ENV`    | Runtime environment (`development` / `test`)     | `development`         |
| `PORT`        | Port the API server listens on                   | `8001`                |
| `MONGODB_URI` | MongoDB connection string (**required**)         | —                     |
| `CORS_ORIGIN` | Allowed origin for CORS                          | `http://localhost:5173` |
| `API_PREFIX`  | Base path prefix for all API routes              | `/api/v1`             |

#### Frontend — `apps/frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:8001
```

| Variable            | Description                        | Default                    |
|---------------------|------------------------------------|----------------------------|
| `VITE_API_BASE_URL` | Base URL of the backend API        | `http://localhost:8001`    |

> **Note:** Make sure `CORS_ORIGIN` in the backend `.env` matches the URL the frontend dev server uses (default: `http://localhost:5174`).

---

## Running the App

### Development (both apps together)

From the **root** of the monorepo:

```bash
npm run dev
```

This starts both servers concurrently:

| App      | URL                          |
|----------|------------------------------|
| Frontend | http://localhost:5174        |
| Backend  | http://localhost:8001        |
| API Docs | http://localhost:8001/api-docs |
| Health   | http://localhost:8001/health |

### Run apps individually

```bash
# Backend only
npm run dev --workspace=apps/backend

# Frontend only
npm run dev --workspace=apps/frontend
```

---

## API Endpoints

All routes are prefixed with `/api/v1`.

| Method   | Endpoint            | Description              |
|----------|---------------------|--------------------------|
| `GET`    | `/api/v1/todos`     | Get all todos            |
| `POST`   | `/api/v1/todos`     | Create a new todo        |
| `PUT`    | `/api/v1/todos/:id` | Update a todo by ID      |
| `PATCH`  | `/api/v1/todos/:id/done` | Toggle done status  |
| `DELETE` | `/api/v1/todos/:id` | Delete a todo by ID      |

Full interactive documentation is available at **http://localhost:8001/api-docs** (Swagger UI).

---

## Testing

### Run all tests (backend + frontend)

```bash
npm run test
```

### Run tests with coverage

```bash
npm run test:coverage
```

### Run individually

```bash
# Backend tests only
npm run test:backend

# Backend tests with coverage
npm run test:backend:coverage

# Frontend tests only
npm run test:frontend

# Frontend tests with coverage
npm run test:frontend:coverage

# Frontend tests in watch mode
npm run test:watch --workspace=apps/frontend
```

---

## Linting

```bash
# Lint both apps
npm run lint

# Lint backend only
npm run lint --workspace=apps/backend

# Lint frontend only
npm run lint --workspace=apps/frontend
```

---

## Building for Production

```bash
# Build frontend
npm run build --workspace=apps/frontend

# Build backend
npm run build --workspace=apps/backend
```

### Start the backend in production mode

```bash
# Build first, then start
npm run build --workspace=apps/backend
npm run start --workspace=apps/backend
```

---

## License

This project is licensed under the terms found in the [LICENSE](./LICENSE) file.

