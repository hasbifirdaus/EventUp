// import { Router } from "express";
// import authRouter from "./auth.route"; // Impor authRouter yang sudah dibuat
import { Router } from "express";
import authenticationRoute from "./authentication.route";

const route = Router();

route.use("/api/authentication", authenticationRoute);

export default route;

// const mainRouter = Router();

// // Endpoint untuk auth
// mainRouter.use("/api/auth", authRouter);

// // Endpoint untuk test (opsional)
// mainRouter.get("/api/ping", (req, res) => {
//   res.status(200).json({ message: "pong" });
// });

// export default mainRouter;
