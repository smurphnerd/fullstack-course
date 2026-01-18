# Lesson 1: Setup & Environment

## Goal

Get the project running locally with Docker services for the database and email.

## Concepts

### What is Docker?

Docker lets you run applications in isolated containers. Instead of installing PostgreSQL and a mail server directly on your machine, we'll run them in Docker containers. This ensures everyone has the same setup.

**Learn more:** [Docker Overview](https://docs.docker.com/get-started/overview/)

### What is docker-compose?

Docker Compose lets you define and run multiple containers with a single command. Our `docker-compose.yml` file defines two services:

- **PostgreSQL** - Our database
- **Mailhog** - A fake email server for testing email verification

## Steps

### 1. Clone the Repository

```bash
git clone <repository-url> fullstack-course
cd fullstack-course
```

### 2. Install Dependencies

```bash
pnpm install
```

This reads `package.json` and installs all the libraries we need.

> **Note:** If you see errors, make sure you have pnpm installed (`npm install -g pnpm`).

### 3. Start Docker Services

First, make sure Docker Desktop is running. Then:

```bash
docker compose up -d
```

This starts:
- PostgreSQL on port 5432
- Mailhog on ports 1025 (SMTP) and 8025 (Web UI)

The `-d` flag runs them in the background.

### 4. Verify Services are Running

```bash
docker compose ps
```

You should see two services running.

Open [http://localhost:8025](http://localhost:8025) in your browser - you should see the Mailhog interface.

### 5. Setup Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Open `.env` in your editor. The defaults work for local development:

```bash
# Database (matches docker-compose.yml)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/coursedb

# Email (Mailhog for local development)
EMAIL_CONNECTION_URL=smtp://localhost:1025
SYSTEM_EMAIL_FROM=noreply@localhost

# Auth Secret - generate your own!
AUTH_SECRET=your-secret-key-here-change-in-production
```

Generate a secure AUTH_SECRET:

```bash
openssl rand -base64 32
```

Copy the output and paste it as your `AUTH_SECRET`.

### 6. Understanding the Environment File

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Connection string for PostgreSQL |
| `EMAIL_CONNECTION_URL` | SMTP server for sending emails |
| `SYSTEM_EMAIL_FROM` | "From" address for system emails |
| `AUTH_SECRET` | Secret key for signing auth tokens |

> **Security:** Never commit your `.env` file! It's in `.gitignore` for a reason.

## Verify

Run the following to ensure your setup is correct:

```bash
# Check Docker services
docker compose ps

# Should show postgres and mailhog running
```

Open Mailhog at [http://localhost:8025](http://localhost:8025) - you should see an empty inbox.

## Common Issues

### "Cannot connect to Docker daemon"

Make sure Docker Desktop is running.

### "Port already in use"

Another service is using port 5432 or 8025. Stop it or change the ports in `docker-compose.yml`.

### "pnpm: command not found"

Install pnpm: `npm install -g pnpm`

## Next

[Lesson 2: Project Structure](./02-project-structure.md) - Understanding where everything lives
