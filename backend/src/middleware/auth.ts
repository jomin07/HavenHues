import { Request,Response,NextFunction } from "express";
import jwt,{ JwtPayload } from "jsonwebtoken";
import User from "../models/user";

declare global{
    namespace Express{
        interface Request{
            userID: string;
            role?: string;
        }
    }
}

const verifyToken = (req: Request,res: Response,next: NextFunction) =>{
    const token = req.cookies["auth_token"];
    if(!token){
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
        req.userID = (decoded as JwtPayload).userID;
        req.role = (decoded as JwtPayload).role;
        if (req.role !== "user") {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}

export const checkBlockedStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.userID);

        if (user && user.isBlocked) {
            res.clearCookie("auth_token");
            return res.status(401).json({ message: "Your account has been blocked. Please contact support for assistance." });
        }

        next();
    } catch (error) {
        console.error("Error checking blocked status:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export default verifyToken;