import express, { NextFunction } from "express";
import { Request, Response } from "express";
import cors from "cors";
import { config } from "./config/index";
import { generateResponse } from "./utils";
import Traffic from "./clients/mytomtom";

const app = express();
app.use(cors({ origin: config.cors.origin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send({ ok: true });
});
///////////////////////////////////////////////////////////

const getIntent = (req: Request, res: Response, next: NextFunction) => {
  const intent = req.body?.request?.intent?.name;
  if (!intent) return res.status(400).json({ error: "Missing intent" });

  (req as any).intent = intent;
  next();
};

const intentHandlers: Record<string, () => any> = {
  checkServer: () => "Yes, your server is online!",
  checkTraffic: async () => {
    const traffic = new Traffic();
    // TODO: handle individual route checks and generic is traffic check
    const checkTraffic = await traffic.checkRoutes([]);
    console.log(checkTraffic);
    return `Your journey to ${checkTraffic[0].name} will take ${checkTraffic[0].travelTimeMinutes} minutes.`;
  },
};

app.post("/", getIntent, async (req: Request, res: Response) => {
  const intent = (req as any).intent;
  const handler = intentHandlers[intent];

  const textResponse = handler
    ? await handler()
    : "Sorry, I don't understand that intent.";
  const responseBody = generateResponse(textResponse);
  res.json(responseBody);
});

///////////////////////////////////////////////////////////
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
