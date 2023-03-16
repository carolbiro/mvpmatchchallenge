import  { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
    user?: { id: string };
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
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
  }

  // Define the whitelist middleware function
export function whitelist(req: Request, res: Response, next: NextFunction) {
    const whitelistRoutes = ['/users/login', '/users/signup']; // Array of whitelisted routes

    // Check if the requested route is in the whitelist
    if (whitelistRoutes.includes(req.path)) {
        return next(); // Skip authentication for whitelisted routes
    }

    // If the requested route is not in the whitelist, continue with authentication
    return authenticateToken(req, res, next);
}