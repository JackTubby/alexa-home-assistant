import express, { NextFunction } from "express";
import { Request, Response } from "express";
import cors from "cors";
import { config } from "./config/index";

const app = express();
app.use(cors({ origin: config.cors.origin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send({ ok: true });
});

app.post("/", (req: Request, res: Response) => {
  // "Alexa, ask server checker to ping my server"
  const responseBody = {
    version: "1.0",
    response: {
      outputSpeech: {
        type: "PlainText",
        text: "Yes, your server is online!",
      },
      shouldEndSession: true,
    },
  };
  res.json(responseBody);
});

app.post("/alexa", (req: Request, res: Response) => {
  console.log("Alexa endpoint hit");
  res.send({ ok: true });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  const status = (err as any).status || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Something went wrong"
      : err.message;

  res.status(status).json({ error: message });
});

export default app;
