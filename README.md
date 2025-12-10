# Express.js + Prisma API Server

This project is a robust boilerplate for building REST APIs using Express.js, TypeScript, and the Prisma ORM. It's designed to provide a solid foundation with essential features like environment management, request validation, and a structured setup for modern backend development.

## Features

*   **Framework**: [Express.js](https://expressjs.com/) for building the web server and APIs.
*   **Language**: [TypeScript](https://www.typescriptlang.org/) for static typing and a better development experience.
*   **ORM**: [Prisma](https://www.prisma.io/) for intuitive, type-safe database access.
*   **Validation**: [class-validator](https://github.com/typestack/class-validator) and [class-transformer](https://github.com/typestack/class-transformer) for validating and transforming incoming request bodies.
*   **Environment Variables**: [dotenv](https://github.com/motdotla/dotenv) to load environment variables from a `.env` file.
*   **CORS**: Pre-configured CORS support.

## Getting Started

Follow these steps to get the project up and running on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/danielreinhard1129/express-finpro-boilerplate
cd express-finpro-boilerplate
```

### 2. Install Dependencies

Install all the required project dependencies using npm or yarn.

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root of the project by copying the example file (if one exists) or creating it from scratch.

```bash
touch .env
```

Add your database connection string to the `.env` file. This is required for Prisma to connect to your database.

```env
# Example for PostgreSQL
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

### 4. Set Up the Database

Run the Prisma migration command to create the database schema based on your `prisma/schema.prisma` file. This will also generate the Prisma Client.

```bash
npx prisma migrate dev
```

If you prefer to only generate the client without running migrations, use:

```bash
npx prisma generate
```

### Run in Development Mode

```bash
npm run dev
```

### Start in Production Mode

```bash
npm run start
```
