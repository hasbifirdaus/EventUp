import express, {
  json,
  urlencoded,
  Express,
  Request,
  Response,
  NextFunction,
} from "express";
import cors from "cors";
import { PORT } from "./config";
import { MainRouter } from "./routes/main.router";
import { AppError } from "./utils/app.error";
import { NotFoundMiddleware } from "./middlewares/not-found.middleware";
import { ErrorHandlerMiddleware } from "./middlewares/error-handler.middleware";

export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
  }

  private handleError(): void {
    /*
      📒 Docs:
      This is a not found error handler.
    */
    this.app.use(NotFoundMiddleware.handle());

    /*
        📒 Docs:
        This is a centralized error-handling middleware.
    */
    this.app.use(ErrorHandlerMiddleware.handle());
  }

  private routes(): void {
    const mainRouter = new MainRouter();

    this.app.get("/api", (req: Request, res: Response) => {
      res.send(
        `Hello, Purwadhika student 👋. Have fun working on your mini project ☺️`
      );
    });

    this.app.use(mainRouter.getRouter());
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`➜ [API] Local: http://localhost:${PORT}/`);
    });
  }
}
