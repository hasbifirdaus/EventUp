// import { Router } from "express";
// import authRouter from "./auth.route"; // Impor authRouter yang sudah dibuat
import { Router } from "express";
import authenticationRoute from "./authentication.route";

const route = Router();

// Endpoint untuk auth
route.use("/api/authentication", authenticationRoute);

export default route;

// // Endpoint untuk test (opsional)
// mainRouter.get("/api/ping", (req, res) => {
//   res.status(200).json({ message: "pong" });
// });

// export default mainRouter;
