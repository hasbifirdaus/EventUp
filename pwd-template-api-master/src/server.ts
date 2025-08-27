import express, { Application, Request, Response } from "express";

const port = 8000;
const app: Application = express();

app.use(express.json());

app.listen(port, () => {
  console.log(`[🔥API] Running in http://localhost:${port}/`);
});
