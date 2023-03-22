import  { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { User } from "../users/user.model";

export interface AuthenticatedRequest extends Request {
    user?: User;
  }

function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    // Check if Authorization header is present
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header missing' });
    }

    // Check if Authorization header is in the correct format
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Authorization header invalid' });
    }

    // Verify the JWT
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
        // Remove the 'exp' field from the payload
        const { exp, iat, ...user } = decoded;
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
  }

  // Define the whitelist middleware function
export function whitelist(req: Request, res: Response, next: NextFunction) {
    const whitelistRoutes = ['/auth', '/users','/products','/auth/refreshTokens']; // Array of whitelisted routes

    // Check if the requested route is in the whitelist
    if (whitelistRoutes.includes(req.path)) {
        if(req.method !== 'POST' && req.path === '/users'){
            // do nothing here and go to authentication
        } else return next(); // Skip authentication for whitelisted routes
    }

    // If the requested route is not in the whitelist, continue with authentication
    return authenticateToken(req as AuthenticatedRequest, res, next);
}