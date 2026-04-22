import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import express from "express";
import compression from "compression";
import morgan from "morgan";
import http from "http";

import swaggerUi from "swagger-ui-express";
import swaggerFile from "../../swagger_output.json" with { type: "json" };

import Routes from "../infra/http/routes/routes.js";
import {
  BODY_PARSER_LIMIT,
  MORGAN_FORMAT,
} from "../shared/constants/app.constants.js";

export class Application {
  public express!: express.Application;
  public server!: http.Server;

  public constructor() {
    this.initialize();
  }

  protected initialize(): void {
    this.express = express();
    this.server = http.createServer(this.express);

    this.express.use(
      cors({
        origin: (origin, callback) => {
          const allowed = [
            "https://myskool-pro.vercel.app",
            "http://localhost:3000",
            "http://localhost:3001",
          ];

          if (!origin || allowed.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error("Not allowed by CORS"));
          }
        },
        credentials: true,
      })
    );
    this.express.options("*", cors());
    this.express.use((err: any, req: any, res: any, next: any) => {
      console.error("GLOBAL ERROR:", err);

      res.status(500).json({
        message: "Internal Server Error",
        error: err?.message,
      });
    });
    this.express.use(helmet());
    this.express.use(compression());
    this.express.use(bodyParser.json({ limit: BODY_PARSER_LIMIT }));
    this.express.use(
      bodyParser.urlencoded({ limit: BODY_PARSER_LIMIT, extended: true })
    );
    this.express.use(morgan(MORGAN_FORMAT));

    this.express.use(Routes);

    this.express.use(
      "/doc",
      swaggerUi.serve,
      swaggerUi.setup(swaggerFile)
    );
  }
}

export const appInstance = new Application();
export default appInstance.express;