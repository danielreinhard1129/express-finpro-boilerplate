# Express.js + Prisma API Server

This project is a robust boilerplate for building REST APIs using Express.js, TypeScript, and the Prisma ORM. It's designed to provide a solid foundation with essential features like environment management, request validation, Docker support, and a structured setup for modern backend development.

## Features

- **Framework**: [Express.js](https://expressjs.com/) 5.x for building the web server and APIs
- **Language**: [TypeScript](https://www.typescriptlang.org/) for static typing and a better development experience
- **ORM**: [Prisma](https://www.prisma.io/) 7.x with PostgreSQL adapter (`@prisma/adapter-pg`) for intuitive, type-safe database access
- **Explicit Module Registration**: Modules in `/src/modules/` are manually registered in `app.ts` for clear dependency management
- **Validation**: [class-validator](https://github.com/typestack/class-validator) and [class-transformer](https://github.com/typestack/class-transformer) for validating and transforming incoming request bodies
- **Environment Variables**: [dotenv](https://github.com/motdotla/dotenv) to load environment variables from a `.env` file
- **CORS**: Pre-configured CORS support
- **Logging**: [Pino](https://getpino.io/) with request ID tracking for structured logging
- **Error Handling**: Centralized error handling with 404 Not Found middleware
- **Docker**: Ready-to-use Docker configuration for PostgreSQL database
- **Code Quality**: Pre-configured Prettier for code formatting and Husky for Git hooks
- **Conventional Commits**: Enforced commit message standards using Commitlint

## Project Structure

```
src/
├── app.ts                            # Main Express application with module registration
├── index.ts                          # Application entry point
├── config/                           # Configuration files
│   └── env.ts                        # Environment variables (PORT, DATABASE_URL)
├── lib/                              # Shared libraries
│   ├── prisma.ts                     # Prisma client setup
│   ├── logger.ts                     # Pino logger configuration
│   └── logger-http.ts                # HTTP request logger
├── middlewares/                      # Express middlewares
│   ├── validation.middleware.ts      # Request body validation
│   └── error.middleware.ts           # Error & 404 handling
├── modules/                          # Feature modules (explicitly registered)
│   └── sample/                       # Sample module (use as reference)
│       ├── dto/                      # Data Transfer Objects
│       │   └── create-sample.dto.ts
│       ├── sample.service.ts         # Business logic
│       ├── sample.controller.ts      # HTTP handlers
│       └── sample.router.ts          # Route definitions
└── utils/                            # Utility functions
    └── api-error.ts                  # Custom error class
```

## Architecture

### Explicit Module Registration

Modules in the `/src/modules/` directory are manually registered in `src/app.ts`. Each module follows a consistent structure:

- **Service Layer**: Contains business logic and database operations
- **Controller Layer**: Handles HTTP requests and responses
- **Router Layer**: Defines routes and applies middleware (validation, etc.)
- **DTO Layer**: Data Transfer Objects with validation rules using class-validator

### Middleware Chain

Requests flow through the following middleware chain (configured in `app.ts` → `configure()` method):

1. **CORS** - Cross-origin resource sharing
2. **Logging** - Pino HTTP logger with request ID tracking
3. **JSON Parser** - Express JSON body parser
4. **Module Routes** - Registered routes with validation middleware
5. **Error Handler** - Centralized error handling
6. **404 Handler** - Not found middleware

## Creating a New Module

This boilerplate uses explicit module registration. Modules are manually registered in `src/app.ts` following a clear dependency injection pattern.

### Step-by-Step: Creating a "Products" Module

1. **Create the module directory:**

```bash
mkdir -p src/modules/products/dto
```

2. **Create the DTO** (`src/modules/products/dto/create-product.dto.ts`):

```typescript
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDTO {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsNumber()
  price!: number;
}
```

3. **Create the Service** (`src/modules/products/products.service.ts`):

```typescript
import { PrismaClient } from "../../../generated/prisma/client.js";
import { CreateProductDTO } from "./dto/create-product.dto.js";

export class ProductService {
  constructor(private prisma: PrismaClient) {}

  getProducts = async () => {
    return await this.prisma.product.findMany();
  };

  createProduct = async (body: CreateProductDTO) => {
    return await this.prisma.product.create({ data: body });
  };
}
```

4. **Create the Controller** (`src/modules/products/products.controller.ts`):

```typescript
import { Request, Response } from "express";
import { ProductService } from "./products.service.js";

export class ProductController {
  constructor(private productService: ProductService) {}

  getProducts = async (req: Request, res: Response) => {
    const result = await this.productService.getProducts();
    res.status(200).send(result);
  };

  createProduct = async (req: Request, res: Response) => {
    const result = await this.productService.createProduct(req.body);
    res.status(200).send(result);
  };
}
```

5. **Create the Router** (`src/modules/products/products.router.ts`):

```typescript
import { Router } from "express";
import { ValidationMiddleware } from "../../middlewares/validation.middleware.js";
import { CreateProductDTO } from "./dto/create-product.dto.js";
import { ProductController } from "./products.controller.js";

export class ProductRouter {
  private router: Router;

  constructor(
    private productController: ProductController,
    private validationMiddleware: ValidationMiddleware,
  ) {
    this.router = Router();
    this.initializedRoutes();
  }

  private initializedRoutes = () => {
    this.router.get("/", this.productController.getProducts);
    this.router.post(
      "/",
      this.validationMiddleware.validateBody(CreateProductDTO),
      this.productController.createProduct,
    );
  };

  getRouter = () => {
    return this.router;
  };
}
```

6. **Register the module in `src/app.ts`**:

Add imports at the top of the file:

```typescript
import { ProductController } from "./modules/products/products.controller.js";
import { ProductRouter } from "./modules/products/products.router.js";
import { ProductService } from "./modules/products/products.service.js";
```

Then update the `registerModules()` method:

```typescript
private registerModules() {
  // services
  const sampleService = new SampleService(prisma);
  const productService = new ProductService(prisma);

  // controllers
  const sampleController = new SampleController(sampleService);
  const productController = new ProductController(productService);

  // middlewares
  const validationMiddleware = new ValidationMiddleware();

  // routes
  const sampleRouter = new SampleRouter(sampleController, validationMiddleware);
  const productRouter = new ProductRouter(productController, validationMiddleware);

  // entry points
  this.app.use("/samples", sampleRouter.getRouter());
  this.app.use("/products", productRouter.getRouter());
}
```

7. **That's it!** Start the server and your endpoints will be available:

```bash
npm run dev
# Endpoints: GET /products, POST /products
```

### How Module Registration Works

The `App` class in `src/app.ts` explicitly registers modules in the `registerModules()` method:

1. **Service Layer**: Create service instances with Prisma client
2. **Controller Layer**: Create controller instances with service dependencies
3. **Middleware Layer**: Create shared middleware instances (e.g., validation)
4. **Router Layer**: Create router instances with controller and middleware dependencies
5. **Mount Routes**: Register each router with its base path using `app.use()`

This pattern provides:

- Clear dependency flow
- Explicit visibility of all registered modules
- Easy sharing of dependencies (e.g., validation middleware)
- Better TypeScript support with full type checking

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/danielreinhard1129/express-finpro-boilerplate
cd express-finpro-boilerplate
```

### 2. Install Dependencies

```bash
npm install
```

This will also set up Husky Git hooks automatically via the `prepare` script.

### 3. Set Up Environment Variables

Create a `.env` file in the root of the project:

```bash
cp .env.example .env
```

Or create it manually with the following content:

```env
# APP
PORT=8000

# DB
DATABASE_URL="postgresql://postgres:admin@localhost:6543/postgres"
```

**Note**: The database runs on port `6543` to avoid conflicts with other PostgreSQL instances.

### 4. Start PostgreSQL with Docker

Start the PostgreSQL container:

```bash
npm run docker:up
```

### 5. Set Up the Database

Run Prisma migrations to create the database schema:

```bash
npx prisma migrate dev
```

Or generate the Prisma Client without running migrations:

```bash
npx prisma generate
```

## Running the Application

### Development Mode

Run the application in development mode with hot-reload:

```bash
npm run dev
```

The server will start on `http://localhost:8000` (or the port specified in your `.env` file).

### Production Mode (Local Build)

Build the TypeScript project and start the server:

```bash
npm run build
npm run start
```

## Docker Support

This project includes Docker configuration for the PostgreSQL database. The application runs locally while the database runs in a container.

### Start PostgreSQL

```bash
npm run docker:up
```

### Stop PostgreSQL

```bash
npm run docker:down
```

### View Logs

```bash
npm run docker:logs
```

## Code Quality

### Formatting

This project uses Prettier for code formatting. All code is automatically formatted on commit via Husky and lint-staged.

Format all files manually:

```bash
npm run format
```

Check formatting without making changes:

```bash
npm run format:check
```

### Conventional Commits

This project enforces [Conventional Commits](https://www.conventionalcommits.org/) using Commitlint and Husky. All commit messages must follow this format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Commit Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that don't affect code meaning (formatting, white-space, etc.)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files

#### Example Commits

```bash
git commit -m "feat: add user authentication endpoint"
git commit -m "fix: resolve database connection timeout"
git commit -m "docs: update README with Docker instructions"
git commit -m "refactor: simplify validation middleware"
```

If your commit message doesn't follow the conventional format, the commit will be rejected by Husky's commit-msg hook.

## Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Start the production server
- `npm run dev` - Start the development server with hot-reload
- `npm run db:deploy` - Run Prisma migrations and generate client
- `npm run docker:up` - Start PostgreSQL container with Docker
- `npm run docker:down` - Stop Docker containers
- `npm run docker:logs` - View Docker logs
- `npm run format` - Format all files with Prettier
- `npm run format:check` - Check formatting without making changes

## Environment Variables

| Variable       | Description                        | Default |
| -------------- | ---------------------------------- | ------- |
| `PORT`         | Port number for the Express server | `8000`  |
| `DATABASE_URL` | PostgreSQL connection string       | -       |

**Example:**

```env
PORT=8000
DATABASE_URL="postgresql://postgres:admin@localhost:6543/postgres"
```

## Database

This project uses Prisma 7.x with the PostgreSQL adapter (`@prisma/adapter-pg`) for type-safe database access. The PostgreSQL database runs in a Docker container on port `6543`.

### Running Migrations

**Development:**

```bash
npx prisma migrate dev
```

**Production:**

```bash
npm run db:deploy
```

### Viewing Database

You can use Prisma Studio to view and edit your database data:

```bash
npx prisma studio
```

## Security Notes

⚠️ **Important Security Practices:**

1. Never commit `.env` files to version control
2. Use strong passwords for production databases
3. Keep dependencies updated regularly
4. Review and audit middleware configurations
