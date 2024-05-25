import { Request, Response } from "express";
import User from "../models/user";

export const getUsers = async (req: Request, res: Response) =>{
    try {
        const users = await User.find({ isAdmin: false });
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
    }
}

export const toggleUserStatus = async (req: Request, res: Response) => {
    const userId = req.params.id;

    try {
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Toggle the user's blocked status
        user.isBlocked = !user.isBlocked;
        
        // Save the updated user
        await user.save();

        res.status(200).json({ message: 'User status updated successfully', user });
    } catch (error) {
        console.error('Error toggling user status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};