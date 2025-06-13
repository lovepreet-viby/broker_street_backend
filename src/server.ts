import express, { Express, Response, Request } from "express";
import http from "http";
import dotenv from "dotenv";
import auth, { AdminAuth } from "./middlewares/auth";
import usersRoutes from "./routes/users.routes";
import sellPropertyRoutes from "./routes/sellPropertys.routes";
import buyPropertyRoutes from "./routes/buyPropertys.routes";
import assignSellPropertyRoutes from "./routes/assignSellPropertys.routes";

import assignBuyPropertyRoutes from "./routes/assignBuyPropertys.routes";

import cors from "cors";
import * as path from "path"; // Import the 'path' module

import { run } from "./database/connection";
import errorHandler from "./middlewares/errorHandler";

dotenv.config();

const app: Express = express();
const server = http.createServer(app);
const port = process.env.PORT;
run().catch(console.dir);

app.use("/uploads", express.static("uploads"));
app.use(express.json());

const allowedOrigins = process.env.CORS;
const allowedOriginsArray = allowedOrigins
  ?.split(",")
  .map((item) => item.trim());
app.use(
  cors({
    credentials: true,
    origin: allowedOriginsArray,
  })
);

app.get("/", (req: Request, res: Response) =>
  res.status(200).send("Welcome to Viby Info Media Pvt. Limited")
);

app.use("/users", usersRoutes);
app.use("/sellproperty", sellPropertyRoutes);
app.use("/buyproperty", buyPropertyRoutes);
app.use("/assignSell", assignSellPropertyRoutes); // auth setup in a routing file
app.use("/assignBuy", assignBuyPropertyRoutes); // auth setup in a routing file

// app.use(errorHandler);

console.log(port);

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
