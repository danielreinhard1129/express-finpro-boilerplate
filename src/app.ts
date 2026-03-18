import cors from "cors";
import express, { Express } from "express";
import { readdir, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import "reflect-metadata";
import { PORT } from "./config/env.js";
import { loggerHttp } from "./lib/logger-http.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

export class App {
  app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.handleError();
  }

  private configure() {
    this.app.use(cors());
    this.app.use(loggerHttp);
    this.app.use(express.json());
  }

  private async registerModules() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const modulesDir = join(__dirname, "modules");

    const moduleDirs = await readdir(modulesDir, { withFileTypes: true });

    for (const dir of moduleDirs) {
      if (!dir.isDirectory()) continue;

      const indexPath = join(modulesDir, dir.name, "index.ts");

      // Check if file exists - stat rejects if file doesn't exist
      if (await stat(indexPath).catch(() => null)) {
        const module = await import(`file://${indexPath}`);

        if (typeof module.register === "function") {
          module.register(this.app);
        }
      }
    }
  }

  private handleError() {
    this.app.use(errorMiddleware);
  }

  public async start() {
    await this.registerModules();
    this.app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  }
}
