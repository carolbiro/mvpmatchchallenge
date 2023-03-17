import express, { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { UserService } from "../users/user.service";
import bcrypt from "bcrypt";

export const authRouter = express.Router();
const authService = new AuthService();
const userService = new UserService();

authRouter.post("/", authenticate);
authRouter.post("/refreshTokens", refreshToken);

async function authenticate(req: Request, res: Response, next: NextFunction) {
    const {username, password} = req.body;
    const user = userService.getUserByUsername(username);
    console.log('user ::::', user);
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        const accessToken = authService.generateAccessToken(user);
        const refreshToken = authService.generateRefreshToken(user);
        res.status(200).json({accessToken: accessToken, refreshToken: refreshToken});
      } 
      else {
        res.status(401).send("Password Incorrect!")
      }
    } else {
      res.status(404).send("User not found");
    }
  }

function refreshToken(req: Request, res: Response, next: NextFunction) {
    if (!authService.refreshTokensArray.includes(req.body.token)) 
        return res.status(400).send("Refresh Token Invalid");

    //remove the old refreshToken from the refreshTokens list
    authService.refreshTokensArray = authService.refreshTokensArray.filter( (c) => c !== req.body.token);

    const user = userService.getUserByUsername(req.body.username);
    //generate new accessToken and refreshTokens
    const accessToken = authService.generateAccessToken(user);
    const refreshToken =authService.generateRefreshToken(user);

    res.json({accessToken: accessToken, refreshToken: refreshToken});
}

