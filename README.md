# Book Club API

This is an API powering the book club app.

## 🚀 Getting Started

### Prerequisites

- Node.js 22.x
- Docker

### Installing

1. Clone the repo
2. Install the dependencies: `npm install`
3. Copy environment file: `.env.example` to `.env`
4. Bootup the containers: `docker-compose up` or `docker-compose up -d`
5. Visit http://localhost:8080 to verify the API is running

### Database Management

Under the hood, [Drizzle](https://orm.drizzle.team/docs/overview) is used as both an **ORM** and to manage the database schema. So after booting the app, we need to push the schema to the postgres database initially and for subsequent schema updates:

```bash
docker exec -it book_club_api ./node_modules/.bin/drizzle-kit push
```

You can view the database schema by visiting [Drizzle Studio](https://orm.drizzle.team/docs/drizzle-kit-studio) locally: https://local.drizzle.studio/?port=8081&host=127.0.0.1

## Testing

Run `npm test`

## Deployment

TBD
