import express, { Express, Response, Request } from "express";
import http from "http";
import dotenv from "dotenv";
import auth from "./middlewares/auth";
import usersRoutes from "./routes/users.routes";
import cors from "cors"; 
import * as path from 'path';  // Import the 'path' module


import { run } from "./database/connection";
import errorHandler from "./middlewares/errorHandler";

dotenv.config();

const app: Express = express();
const server = http.createServer(app);
const port = process.env.PORT;
run().catch(console.dir);

app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) =>
  res.status(200).send("Welcome to Viby Info Media Pvt. Limited")
);

app.use("/users", usersRoutes);
//app.use("/fruits", fruitsRoutes);






// app.use(errorHandler);

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
