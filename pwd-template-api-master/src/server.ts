import express, { Express, NextFunction, Request, Response } from "express";
import mainRouter from "./routers/main.router";
import cors from "cors";
import { config } from "./config/index"; // Menggunakan config dari file yang sudah ada

const app: Express = express();
const port: number = parseInt(config.port as string, 10) || 8000; // Mengubah tipe port menjadi number

// Middleware
app.use(cors()); // Semua client dapat mengakses API kita
app.use(express.json());

// Main route
app.use(mainRouter);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Cetak stack trace untuk debugging
  res.status(500).json({
    success: false,
    message: err?.message || "Something broke!",
    data: {},
  });
});

// Start the server
app.listen(port, () => {
  console.log(`[API] Running in port: ${port}`);
});
