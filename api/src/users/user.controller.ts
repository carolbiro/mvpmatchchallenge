import express, { Request, Response, NextFunction } from "express";
import Joi from "joi";
import bcrypt from "bcrypt";
import { validateRequest } from "../_middlewares/validate-request";
import { UserService } from "./user.service";
import { User } from "./user.model";
import { AuthenticatedRequest } from "../_middlewares/authenticate-routes";

export const userRouter = express.Router();
const userService = new UserService();

userRouter.post("/", validateSchema, addUser);
userRouter.get("/", getUsers); 
userRouter.get("/:id", getUserById);
userRouter.put("/:id", validateSchema, updateUser);
userRouter.delete("/:id", deleteUser);

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

// Route to delete a user
function deleteUser(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;
  userService.deleteUser(id);
  res.status(204).send();
};

// Route to update a user
function updateUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const id = req.params.id;
  const { username, password, deposit, role } = req.body;
  const updateResult = userService.updateUser(id, { username, password, deposit, role });
  req.user = { username, password, deposit, role };

  if (updateResult) {
    res.status(200).json(updateResult);
  } else {
    res.status(404).send({ message: "User not found"});
  }
}

function validateSchema(req, res, next) {
  const schema = Joi.object({
      username:  Joi.string().required(),
      password:  Joi.string().required(),
      deposit:  Joi.number().required(),
      role:  Joi.string().required()
  });
  validateRequest(req, next, schema);
}