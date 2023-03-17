import { User } from '../users/user.model';
import * as jwt from "jsonwebtoken";

export class AuthService {
    // accessTokens
    generateAccessToken(user:User) {
        return jwt.sign(
            user, 
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: 15*60}
        ); 
    }

    // refreshTokens
    refreshTokensArray = [];

    generateRefreshToken(user:User) {
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: 20*60})
        this.refreshTokensArray.push(refreshToken);
        return refreshToken;
    }
}