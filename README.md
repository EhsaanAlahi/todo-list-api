# Todo List API

A simple Todo List REST API built with Next.js and TypeScript. The API allows users to create todos, view all todos, and mark todos as completed.

## Tech Stack

* Next.js
* TypeScript
* Node.js
* PNPM
* Docker
* GitHub Actions

## Project Structure

```text
app/
├── api/
│   └── todos/
│       ├── route.ts
│       ├── store.ts
│       └── [id]/
│           └── route.ts
├── layout.tsx
└── page.tsx

Dockerfile
.dockerignore
.github/
└── workflows/
    └── docker.yaml
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js 20+
* PNPM 12.3.4

### Run Locally

Clone the repository:

```bash
git clone https://github.com/EhsaanAlahi/todo-list-api.git
cd todo-list-api
```

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

The application will be available at:

```text
http://localhost:3000
```

## API Endpoints

### 1. Get All Todos

**GET**

```text
/api/todos
```

Example:

```bash
curl http://localhost:3000/api/todos
```

Response:

```json
[]
```

---

### 2. Add a Todo

**POST**

```text
/api/todos
```

Request body:

```json
{
  "title": "Learn Docker"
}
```

Example response:

```json
{
  "id": "todo-id",
  "title": "Learn Docker",
  "completed": false,
  "createdAt": "2026-09-15T10:00:00.000Z"
}
```

---

### 3. Mark a Todo as Completed

**PATCH**

```text
/api/todos/:id
```

Request body:

```json
{
  "completed": true
}
```

Example:

```text
/api/todos/5a8c0b0c-16ab-49cc-8773-ee34481e5121
```

Response:

```json
{
  "id": "5a8c0b0c-16ab-49cc-8773-ee34481e5121",
  "title": "Learn Docker",
  "completed": true,
  "createdAt": "2026-09-15T10:00:00.000Z"
}
```

If the todo ID does not exist, the API returns:

```json
{
  "error": "Todo not found."
}
```

## Running with Docker

Build the Docker image:

```bash
docker build -t todo-list-api .
```

Run the container:

```bash
docker run -d --name todo-list-api -p 3000:3000 todo-list-api
```

The API will then be available at:

```text
http://localhost:3000/api/todos
```

Check the running container:

```bash
docker ps
```

To stop the container:

```bash
docker stop todo-list-api
```

## Docker Configuration

The application uses a single-stage Docker build based on `node:20-alpine`.

The Docker image:

1. Enables Corepack
2. Uses PNPM 12.3.4
3. Installs project dependencies
4. Builds the Next.js application
5. Exposes port 3000
6. Starts the application using `pnpm start`

A `.dockerignore` file is also included to keep unnecessary files out of the Docker build context.

## GitHub Actions CI

The project includes a GitHub Actions workflow located at:

```text
.github/workflows/docker.yaml
```

The workflow runs automatically on every push.

It performs the following steps:

1. Checks out the repository
2. Sets up Docker Buildx
3. Builds the Docker image
4. Verifies that the Dockerfile can successfully build the application

The workflow **does not push the image to Docker Hub and does not perform deployment**.

This keeps the workflow focused on CI and ensures that Docker build issues are detected automatically on every push.

## Data Storage

Todo data is currently stored in memory using a simple array.

This means the data is temporary. If the application or Docker container is restarted, previously created todos will be lost.

For a production application, this could be replaced with a persistent database such as PostgreSQL, MySQL, or MongoDB.

## Reflection

This project helped me understand the complete basic workflow of containerizing an application and adding CI with GitHub Actions.

I learned how to:

* Build and test a REST API
* Create a Dockerfile for a Next.js application
* Use PNPM inside a Docker container
* Build and run the application with Docker
* Create a `.dockerignore` file
* Configure GitHub Actions to build Docker images automatically
* Work with Git branches and pull requests
* Separate CI from deployment

One important improvement for a production version would be adding persistent database storage instead of keeping todos in memory. I would also consider adding automated API tests, security scanning, image publishing, and deployment as future improvements.
