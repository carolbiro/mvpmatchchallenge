import express, { Request, Response, NextFunction } from "express";
import Joi from "joi";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { validateRequest } from "../_middlewares/validate-request";
import { UserService } from "./user.service";
import { User } from "./user.model";

export const userRouter = express.Router();
const userService = new UserService();

userRouter.post("/", validateSchema, addUser);
userRouter.get("/", getUsers);
userRouter.get("/:id", getUserById);
userRouter.put("/:id/deposit", depositCoins);
userRouter.delete("/:id", deleteUser);
userRouter.post("/authenticate", authenticate);
userRouter.post("/refreshTokens", refreshToken);

// Route to register a new user
async function addUser(req: Request, res: Response, next: NextFunction) {
  const { username, password, role, deposit } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser: User = { username, password: hashedPassword, deposit, role };
  const user = userService.addUser(newUser);
  res.status(201).json(user);
};

// Route to get all users
function getUsers(req: Request, res: Response, next: NextFunction) {
  const users = userService.getUsers();
  res.status(200).json(users);
};

// Route to get a single user by ID
function getUserById(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;
  const user = userService.getUserById(id);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).send("User not found");
  }
};

// Route to deposit coins (for buyers only)
function depositCoins(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;
  const { deposit } = req.body;
  const updatedUser = userService.depositCoins(id, deposit);
  if (updatedUser) {
    res.status(200).json(updatedUser);
  } else {
    res.status(404).send("User not found");
  }
};

// Route to delete a user
function deleteUser(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;
  userService.deleteUser(id);
  res.status(204).send();
};

function validateSchema(req, res, next) {
  const schema = Joi.object({
      username:  Joi.string().required(),
      password:  Joi.string().required(),
      deposit:  Joi.number().required(),
      role:  Joi.string().required()
  });
  validateRequest(req, next, schema);
}

async function authenticate(req: Request, res: Response, next: NextFunction) {
  const {username, password} = req.body;
  const user = userService.getUserByUsername(username);
  if (user) {
    if (await bcrypt.compare(password, user.password)) {
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      res.status(200).json({accessToken: accessToken, refreshToken: refreshToken});
    } 
    else {
      res.status(401).send("Password Incorrect!")
    }
  } else {
    res.status(404).send("User not found");
  }
}

// accessTokens
function generateAccessToken(user) {
  return jwt.sign(
    user, 
    process.env.ACCESS_TOKEN_SECRET,
     {expiresIn: 15*60}
  ); 
}
// refreshTokens
let refreshTokensArray = [];
function generateRefreshToken(user) {
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: 20*60 })
  refreshTokensArray.push(refreshToken);
  return refreshToken;
}

function refreshToken(req: Request, res: Response, next: NextFunction) {
  if (!refreshTokensArray.includes(req.body.token)) 
    return res.status(400).send("Refresh Token Invalid");

  //remove the old refreshToken from the refreshTokens list
  refreshTokensArray = refreshTokensArray.filter( (c) => c !== req.body.token);

  const user = userService.getUserByUsername(req.body.username);
  //generate new accessToken and refreshTokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  
  res.json({accessToken: accessToken, refreshToken: refreshToken});
}