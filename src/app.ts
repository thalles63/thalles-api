import express from "express";
import { errorHandler } from "./middlewares/error.middleware";
import pingRoute from "./routes/ping.route";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/ping", pingRoute);

app.use(errorHandler);

export default app;
