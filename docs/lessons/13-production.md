# Lesson 13: Production

## Goal

Understand what changes when deploying to production.

## Concepts

### Development vs Production

| Aspect | Development | Production |
|--------|-------------|------------|
| Database | Local Docker | Cloud PostgreSQL |
| Email | Mailhog (fake) | Real email service |
| URL | localhost:3000 | yourdomain.com |
| Build | Development mode | Optimized build |
| Migrations | `db:push` | `db:migrate` |

## Building for Production

### The Build Command

```bash
pnpm build
```

This:
1. Compiles TypeScript
2. Bundles client JavaScript
3. Pre-renders static pages
4. Optimizes images
5. Creates `.next/` output directory

### Running the Production Build

```bash
pnpm start
```

This starts Next.js in production mode.

## Database Migrations

### Development: `db:push`

```bash
pnpm db:push
```

- Directly syncs schema to database
- No migration files
- May lose data if columns removed
- Fast for development

### Production: Generate + Migrate

```bash
# Generate migration files
pnpm drizzle-kit generate

# Apply migrations
pnpm drizzle-kit migrate
```

Migration files:
- Track every schema change
- Can be reviewed before applying
- Reversible (in theory)
- Safe for production data

### Migration Files

Generated in `drizzle/` directory:

```
drizzle/
├── 0000_initial.sql
├── 0001_add_todos.sql
└── meta/
    └── _journal.json
```

Each file contains SQL to apply that change.

## Environment Variables

### Production Variables

| Variable | Production Value |
|----------|------------------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Cloud PostgreSQL URL |
| `AUTH_SECRET` | Strong random secret |
| `BASE_URL` | `https://yourdomain.com` |
| `EMAIL_CONNECTION_URL` | Real SMTP or `ses` |

### Security Notes

- **Never commit `.env` to git**
- Generate a strong `AUTH_SECRET`
- Use environment variables in your hosting platform

## Deployment Options

### Vercel (Recommended for Next.js)

1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables
4. Deploy

Vercel handles:
- Building
- SSL certificates
- CDN
- Automatic deployments on push

### Docker

Create a `Dockerfile`:

```dockerfile
FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
```

### Other Platforms

- **Railway** - Similar to Vercel, supports Docker
- **Fly.io** - Docker-based, global deployment
- **AWS** - EC2, ECS, or Lambda
- **DigitalOcean** - App Platform or Droplets

## Pre-Deployment Checklist

### Code Quality

- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm build` succeeds
- [ ] Tests pass (if you have them)

### Environment

- [ ] Strong `AUTH_SECRET` generated
- [ ] Production `DATABASE_URL` configured
- [ ] Real email service configured (or disabled)
- [ ] `BASE_URL` set to production domain

### Database

- [ ] Migration files generated
- [ ] Migrations tested locally
- [ ] Database backup strategy in place

### Security

- [ ] `.env` not in git
- [ ] No secrets in code
- [ ] HTTPS enabled
- [ ] Rate limiting configured

## Code Task: Build Locally

### Step 1: Run the Build

```bash
pnpm build
```

Watch the output. You'll see:
- Route compilation
- Static generation
- Bundle sizes

### Step 2: Start Production Server

```bash
pnpm start
```

### Step 3: Test It

Open [http://localhost:3000](http://localhost:3000)

The app should work the same, but it's running in production mode.

### Step 4: Generate a Migration

```bash
pnpm drizzle-kit generate
```

Check the `drizzle/` directory for the generated SQL file.

## What's Next?

Congratulations! You've built a complete fullstack application. Here's where to go from here:

### Add More Features

- Edit todo titles
- Due dates
- Categories/tags
- Search and filter

### Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [oRPC Documentation](https://orpc.dev/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Better Auth Documentation](https://www.better-auth.com/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Best Practices

- Write tests for critical paths
- Set up CI/CD pipeline
- Monitor errors in production
- Regular backups
- Security audits

## Summary

You've learned:

1. **Setup** - Docker, environment variables
2. **Project Structure** - Where everything lives
3. **Routing** - Next.js App Router
4. **Database** - Drizzle ORM, migrations
5. **Components** - shadcn/ui, Tailwind
6. **DI** - Awilix dependency injection
7. **API** - oRPC type-safe endpoints
8. **Auth** - Better Auth, email verification
9. **Forms** - Zod, react-hook-form
10. **Data Fetching** - TanStack Query, Suspense
11. **Integration** - Putting it all together
12. **Code Quality** - TypeScript, ESLint
13. **Production** - Building and deploying

You now have the foundation to build any fullstack application!

## Feedback

If you found this course helpful (or have suggestions), please:
- Star the repository
- Open an issue with feedback
- Share it with others learning fullstack development

Happy coding!
