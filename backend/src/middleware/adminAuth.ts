import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      adminID?: string;
      role?: string;
    }
  }
}

const verifyAdminToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies["admin_auth_token"];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    req.adminID = (decoded as JwtPayload).userID;
    req.role = (decoded as JwtPayload).role;
    if (req.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default verifyAdminToken;
