import express from "express";
import healthRouter from "./routes/health.js"
import authRouter from "./modules/auth/auth.routes.js"
import orgRouter from "./modules/organization/organization.routes.js"
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/health",healthRouter);
app.use("/api/v1/auth",authRouter);
app.use("/org",orgRouter);

export default app;