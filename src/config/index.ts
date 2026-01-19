import dotenv from "dotenv";

dotenv.config();

type Config = {
    port: number;
    nodeEnv: string;
    cors: {
        origin: string;
    }
    mytomtomUrl: string;
    mytomtomKey: string;
}
// TODO: handle missing values
export const config: Config = {
  port: parseInt(process.env.PORT || "3000"),
  nodeEnv: process.env.NODE_ENV || "development",
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  },
  mytomtomUrl: process.env.MYTOMTOM_URL || "",
  mytomtomKey: process.env.MYTOMTOM_KEY || ""
};
