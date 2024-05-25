import { Request,Response,NextFunction } from "express";
import jwt,{ JwtPayload } from "jsonwebtoken";

declare global{
    namespace Express{
        interface Request{
            adminID?: string;
        }
    }
}

const verifyAdminToken = (req: Request,res: Response,next: NextFunction) =>{
    const token = req.cookies["admin_auth_token"];
    if(!token){
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
        if (!(decoded as JwtPayload).isAdmin) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        req.adminID = (decoded as JwtPayload).userID;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}

export default verifyAdminToken;