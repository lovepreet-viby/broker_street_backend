import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

// authenticating token in request headers
export default async function auth(
  req: Request,
  res: Response,
  next: Function
) {
  try {
    let token = req.headers.authorization;
    if (token) {
      token = token.split(" ")[1];
      jwt.verify(
        token,
        SECRET_KEY ? SECRET_KEY : "lreigns",
        function (err, decoded: any) {
          if (err) {
            res.status(401).send("Unauthorized");
          } else if (decoded) {
            req.body.email = decoded.email;
            next();
          }
        }
      );
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (error) {
    next(error);
  }
}

export async function AdminAuth(
  req: Request,
  res: Response,
  next: Function) {

  try {

    let token = req.headers.authorization as string;
    if (token) {

      token = token.split(" ")[1];
      jwt.verify(token, SECRET_KEY ? SECRET_KEY : "lreigns", (err, decoded: any) => {
        if (err) {
          res.status(400).send("Token verification failed");
        }
        
        //decoded.role !== 'admin' 
        if (decoded.role !== 'superadmin') {
          return res.status(403).json('Access denied. User is not an admin.');
        }
        next();

      });
    } else {
      res.status(401).send("Unauthorized");
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};