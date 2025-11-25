import { defineConfig } from "@prisma/config";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env") });

export default defineConfig({
  datasource: {
    provider: "postgresql", 
    url: process.env.DATABASE_URL || "",
  },
});